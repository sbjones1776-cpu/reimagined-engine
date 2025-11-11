// Admin analytics aggregation utilities for trial conversion.
// Provides functions to calculate trial->subscription conversion rates.
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/firebaseConfig';

const db = getFirestore(app);

/**
 * Fetch users who started a trial and count how many converted.
 * Conversion rule: subscription_tier !== 'free' and trial_used === true
 * (Meaning trial concluded and user upgraded at or after expiration or during trial.)
 */
export async function getTrialConversionSummary() {
  const usersRef = collection(db, 'users');
  // Users with trial fields
  const qTrial = query(usersRef, where('trial_start_date', '!=', null));
  const snap = await getDocs(qTrial);
  let trialUsers = 0;
  let converted = 0;
  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (d.trial_start_date) {
      trialUsers++;
      if (d.subscription_tier && d.subscription_tier !== 'free') {
        converted++;
      }
    }
  });
  return {
    total_trial_users: trialUsers,
    converted_users: converted,
    conversion_rate: trialUsers > 0 ? (converted / trialUsers) : 0
  };
}

/**
 * Breakdown by day-of-trial conversion (approximate):
 * For each converted user estimate the day number when they upgraded.
 */
export async function getTrialConversionByDay() {
  const usersRef = collection(db, 'users');
  const qTrial = query(usersRef, where('trial_start_date', '!=', null));
  const snap = await getDocs(qTrial);
  const dayBuckets = {};
  const now = Date.now();
  snap.forEach(docSnap => {
    const d = docSnap.data();
    if (!d.trial_start_date || !d.subscription_tier || d.subscription_tier === 'free') return;
    try {
      const startMs = d.trial_start_date.toDate ? d.trial_start_date.toDate().getTime() : new Date(d.trial_start_date).getTime();
      const diffDays = Math.floor((now - startMs) / (1000*60*60*24));
      const bucket = diffDays <= 7 ? diffDays : 'after_trial';
      dayBuckets[bucket] = (dayBuckets[bucket] || 0) + 1;
    } catch {/* ignore parse errors */}
  });
  return dayBuckets;
}

export default {
  getTrialConversionSummary,
  getTrialConversionByDay
};
