// Centralized analytics event logging with safe guards.
// Provides semantic helpers for trial lifecycle events.
import { analytics } from '@/firebaseConfig';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { app } from '@/firebaseConfig';

let analyticsInstance = analytics;
(async () => {
  try {
    if (!analyticsInstance && (await isSupported())) {
      analyticsInstance = getAnalytics(app);
    }
  } catch {/* ignore */}
})();

function safeLog(name, params = {}) {
  if (!analyticsInstance) return;
  try {
    logEvent(analyticsInstance, name, params);
  } catch (e) {
    // Silently ignore analytics errors
    console.warn('analytics log skipped', name, e?.message);
  }
}

// Trial lifecycle events
export const trackTrialStart = (email) => safeLog('trial_start', { method: 'auto', user_email: email });
export const trackTrialDay = (email, dayNum) => safeLog('trial_day', { day: dayNum, user_email: email });
export const trackTrialExpired = (email) => safeLog('trial_expired', { user_email: email });
export const trackTrialUpgrade = (email, dayNum) => safeLog('trial_upgrade', { day: dayNum, user_email: email });
export const trackTrialGraceLock = (email) => safeLog('trial_grace_lock', { user_email: email });

// Generic wrapper so other features can reuse
export const trackEvent = (name, params) => safeLog(name, params);

export default {
  trackTrialStart,
  trackTrialDay,
  trackTrialExpired,
  trackTrialUpgrade,
  trackTrialGraceLock,
  trackEvent
};
