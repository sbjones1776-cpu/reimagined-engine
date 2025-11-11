import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getFirestore, serverTimestamp, Timestamp } from 'firebase/firestore';
import { app } from '@/firebaseConfig';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/api/firebaseService';
import { hasPremiumAccess, isOnTrial, isTrialExpired, getTrialDaysRemaining } from '@/utils/trialHelpers';
import { trackTrialStart, trackTrialDay, trackTrialExpired, trackTrialGraceLock } from '@/lib/analytics';
import { createDay6Notification, createTrialExpiredNotification, createGraceDayNotification } from '@/api/trialNotifications';

export function useFirebaseUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    let userDocUnsub = null;
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // Immediately set a minimal user so the app can render without waiting on Firestore
        setUser((prev) => prev || { email: fbUser.email, subscription_tier: 'free', coins: 0 });
        setError(null);

        // Optional immediate trial reset via URL param (?reset_trial=true)
        try {
          if (typeof window !== 'undefined' && window.location.search.includes('reset_trial=true')) {
            const days = 7;
            const now = Date.now();
            const expiresAt = new Date(now + days * 24 * 60 * 60 * 1000);
            await updateUserProfile(fbUser.email, {
              trial_start_date: serverTimestamp(),
              trial_expires_at: Timestamp.fromDate(expiresAt),
              trial_used: false,
              trial_grace_used: false
            });
            // Clear any stored trial log so events & UI re-fire
            localStorage.removeItem(`trial_log_${fbUser.email}`);
            // Remove the param from the URL (non-destructive replace)
            const url = new URL(window.location.href);
            url.searchParams.delete('reset_trial');
            window.history.replaceState({}, '', url.toString());
            // Provide a quick console note for debugging
            console.info('[trial] Trial reset performed for', fbUser.email);
          }
        } catch (resetErr) {
          console.warn('[trial] Trial reset attempt failed:', resetErr?.message);
        }

        // Subscribe to live updates on the user document ASAP
        if (userDocUnsub) userDocUnsub();
        userDocUnsub = onSnapshot(
          doc(db, 'users', fbUser.email),
          (snap) => {
            if (snap.exists()) {
              const userData = { id: snap.id, ...snap.data() };
              
              // Derive trial state + premium access
              const onTrial = isOnTrial(userData);
              const trialExpired = isTrialExpired(userData);
              const trialDaysRemaining = getTrialDaysRemaining(userData);
              // Grace day (day 8) logic
              const totalTrialDays = 7;
              const daysSinceStart = userData.trial_start_date?.toDate ? Math.floor((Date.now() - userData.trial_start_date.toDate().getTime()) / (1000*60*60*24)) : null;
              const inGraceDay = trialExpired && daysSinceStart === totalTrialDays && userData.trial_grace_used !== true;

              setUser({
                ...userData,
                isOnTrial: onTrial,
                trialExpired: trialExpired,
                trialDaysRemaining,
                inGraceDay,
                hasPremiumAccess: hasPremiumAccess(userData) || inGraceDay // Allow premium during grace
              });

              // Analytics & Firestore updates with localStorage deduplication
              const email = snap.id;
              const logKey = `trial_log_${email}`;
              const storedLog = localStorage.getItem(logKey);
              let logData = storedLog ? JSON.parse(storedLog) : {};

              // Detect recreated account (new trial_start_date) and reset stale log
              const trialStartMs = userData.trial_start_date?.toDate ? userData.trial_start_date.toDate().getTime() : null;
              if (trialStartMs) {
                const recordedStart = logData.trial_start_timestamp || null;
                if (!recordedStart || recordedStart !== trialStartMs) {
                  // Fresh trial start detected; clear previous dedupe flags
                  logData = {};
                }
              }

              // Trial start event (once)
              if (userData.trial_start_date && !logData.trial_start) {
                trackTrialStart(email);
                logData.trial_start = true;
                if (trialStartMs) {
                  logData.trial_start_timestamp = trialStartMs;
                }
              }

              // Daily event (once per day)
              if (onTrial && trialDaysRemaining >= 0 && trialDaysRemaining <= 7) {
                const dayKey = `day_${7 - trialDaysRemaining}`;
                if (!logData[dayKey]) {
                  trackTrialDay(email, 7 - trialDaysRemaining);
                  logData[dayKey] = true;
                }
                // Day 6 notification (1 day left)
                if (trialDaysRemaining === 1 && !logData.notif_day6) {
                  createDay6Notification(email);
                  logData.notif_day6 = true;
                }
              }

              // Expired event (once)
              if (trialExpired && userData.subscription_tier === 'free' && !logData.trial_expired) {
                trackTrialExpired(email);
                logData.trial_expired = true;
                if (userData.trial_used !== true) {
                  updateUserProfile(snap.id, { trial_used: true }).catch(() => {});
                }
                // Create expiration notification
                if (!logData.notif_expired) {
                  createTrialExpiredNotification(email);
                  logData.notif_expired = true;
                }
              }

              // Grace lock event (once)
              if (inGraceDay && !logData.grace_lock) {
                trackTrialGraceLock(email);
                logData.grace_lock = true;
                if (userData.trial_grace_used !== true) {
                  updateUserProfile(snap.id, { trial_grace_used: true }).catch(() => {});
                }
                // Grace day notification
                if (!logData.notif_grace) {
                  createGraceDayNotification(email);
                  logData.notif_grace = true;
                }
              }

              try {
                localStorage.setItem(logKey, JSON.stringify(logData));
              } catch (e) {
                // Storage might be full or blocked; fail silently
              }
            }
          },
          (err) => {
            console.error('Firestore snapshot error:', err);
            // Don't fail completely on snapshot errors - keep existing user data
          }
        );

        // Ensure profile exists but don't block initial render
        // This will create a default profile if missing; snapshot above will update state when ready
        getUserProfile(fbUser.email).catch((e) => {
          console.error('Failed to ensure user profile', e);
          setError(e);
        });
      } catch (e) {
        console.error('Failed to initialize user session', e);
        setError(e);
        // Set a minimal user object so auth still works
        setUser({ email: fbUser.email, subscription_tier: 'free', coins: 0 });
      } finally {
        // Don't block UI on profile/network; as soon as auth state is known, stop loading
        setLoading(false);
      }
    });
    return () => {
      if (userDocUnsub) userDocUnsub();
      unsub();
    };
  }, []);

  return { user, loading, error };
}
