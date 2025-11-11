/**
 * Trial Helper Functions
 * Manages 7-day trial logic for new users
 */

/**
 * Check if user is currently on trial
 * @param {Object} user - User object from Firestore
 * @returns {boolean}
 */
export const isOnTrial = (user) => {
  if (!user) return false;
  
  // User must have trial_start_date and trial_expires_at
  // Fallback: if fields missing but trial not marked used and user is free, treat as trial (profile backfill race or offline creation)
  if (!user.trial_start_date || !user.trial_expires_at) {
    if (user.subscription_tier === 'free' && user.trial_used !== true) {
      return true; // provisional trial state
    }
    return false;
  }
  
  // If user has upgraded (not free tier), they're no longer on trial
  if (user.subscription_tier !== 'free') return false;
  
  // If trial was already used/expired, return false
  if (user.trial_used === true) return false;
  
  // Check if trial period hasn't expired yet
  const now = new Date();
  const expiresAt = user.trial_expires_at.toDate();
  
  return now < expiresAt;
};

/**
 * Check if user's trial has expired
 * @param {Object} user - User object from Firestore
 * @returns {boolean}
 */
export const isTrialExpired = (user) => {
  if (!user) return false;
  
  // No trial dates means no trial
  if (!user.trial_start_date || !user.trial_expires_at) return false;
  
  // If user upgraded, trial is not "expired" (it's completed successfully)
  if (user.subscription_tier !== 'free') return false;
  
  // Check if trial period has passed
  const now = new Date();
  const expiresAt = user.trial_expires_at.toDate();
  
  return now >= expiresAt;
};

/**
 * Get days remaining in trial
 * @param {Object} user - User object from Firestore
 * @returns {number} Days remaining (0 if expired or no trial)
 */
export const getTrialDaysRemaining = (user) => {
  if (!user || !user.trial_expires_at) return 0;
  
  // If user upgraded, no need to show trial countdown
  if (user.subscription_tier !== 'free') return 0;
  
  const now = new Date();
  const expiresAt = user.trial_expires_at.toDate();
  const msRemaining = expiresAt - now;
  
  if (msRemaining <= 0) return 0;
  
  return Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
};

/**
 * Check if user should see premium features (trial or paid)
 * @param {Object} user - User object from Firestore
 * @returns {boolean}
 */
export const hasPremiumAccess = (user) => {
  if (!user) return false;
  
  // Paid subscription
  if (user.subscription_tier && user.subscription_tier !== 'free') return true;
  // Active trial (including provisional when dates missing)
  if (isOnTrial(user) && user.trial_used !== true) return true;
  // Grace day logic handled higher up (in hook) by adding inGraceDay
  return false;
};

/**
 * Get trial status message
 * @param {Object} user - User object from Firestore
 * @returns {string}
 */
export const getTrialStatusMessage = (user) => {
  if (!user) return '';
  
  if (user.subscription_tier !== 'free') {
    return 'Premium Active';
  }
  
    // Trial messaging removed
  return 'Free plan';
};
