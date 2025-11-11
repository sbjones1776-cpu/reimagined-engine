import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { app } from '@/firebaseConfig';
import { createUserProfile, getUserProfile, updateUserProfile } from '@/api/firebaseService';
import { hasPremiumAccess, isOnTrial, isTrialExpired, getTrialDaysRemaining } from '@/utils/trialHelpers';

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
              setUser({
                ...userData,
                isOnTrial: onTrial,
                trialExpired: trialExpired,
                trialDaysRemaining,
                hasPremiumAccess: hasPremiumAccess(userData)
              });

              // If trial is expired and not yet marked used (and still free), mark it
              if (trialExpired && userData.subscription_tier === 'free' && userData.trial_used !== true) {
                updateUserProfile(snap.id, { trial_used: true }).catch(() => {});
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
