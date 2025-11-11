// Client-side notification helper: creates Firestore notification docs for day6 warning and trial expiration.
// Notifications are written to 'notifications' collection and can be displayed in Messages/Inbox UI.
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { app } from '@/firebaseConfig';

const db = getFirestore(app);

/**
 * Create a day-6 warning notification for user
 */
export async function createDay6Notification(userEmail) {
  try {
    await addDoc(collection(db, 'notifications'), {
      user_email: userEmail,
      type: 'trial_day6_warning',
      title: 'Trial Ending Soon!',
      message: 'Your 7-day trial ends tomorrow. Upgrade now to keep unlimited access to premium features!',
      is_read: false,
      created_at: serverTimestamp(),
      action_url: '/subscription'
    });
  } catch (e) {
    console.warn('Failed to create day6 notification:', e.message);
  }
}

/**
 * Create a trial expiration notification
 */
export async function createTrialExpiredNotification(userEmail) {
  try {
    await addDoc(collection(db, 'notifications'), {
      user_email: userEmail,
      type: 'trial_expired',
      title: 'Trial Ended',
      message: 'Your 7-day trial has ended. You are now on the free plan. Upgrade anytime to regain premium features.',
      is_read: false,
      created_at: serverTimestamp(),
      action_url: '/subscription'
    });
  } catch (e) {
    console.warn('Failed to create trial expired notification:', e.message);
  }
}

/**
 * Create a grace day notification
 */
export async function createGraceDayNotification(userEmail) {
  try {
    await addDoc(collection(db, 'notifications'), {
      user_email: userEmail,
      type: 'trial_grace_day',
      title: 'Grace Day: Final Chance!',
      message: 'Your trial expired, but you still have premium access today only. Upgrade now before it locks tomorrow.',
      is_read: false,
      created_at: serverTimestamp(),
      action_url: '/subscription'
    });
  } catch (e) {
    console.warn('Failed to create grace day notification:', e.message);
  }
}

export default {
  createDay6Notification,
  createTrialExpiredNotification,
  createGraceDayNotification
};
