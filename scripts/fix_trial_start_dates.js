// Script to fix existing users: set trial_start_date = created_at if they differ
// Run this with Node.js after setting up Firebase Admin SDK credentials


import admin from 'firebase-admin';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

admin.initializeApp();
const db = admin.firestore();

async function fixTrialStartDates() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  let updated = 0;
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (!data.created_at || !data.trial_start_date) continue;
    const createdAt = data.created_at.toDate ? data.created_at.toDate() : (data.created_at.seconds ? new Date(data.created_at.seconds * 1000) : null);
    const trialStart = data.trial_start_date.toDate ? data.trial_start_date.toDate() : (data.trial_start_date.seconds ? new Date(data.trial_start_date.seconds * 1000) : null);
    if (!createdAt || !trialStart) continue;
    if (createdAt.getTime() !== trialStart.getTime()) {
      // Update trial_start_date to match created_at
      await doc.ref.update({
        trial_start_date: admin.firestore.Timestamp.fromDate(createdAt)
      });
      updated++;
      console.log(`Updated ${doc.id}: trial_start_date set to created_at (${createdAt.toISOString()})`);
    }
  }
  console.log(`Done. Updated ${updated} users.`);
}

fixTrialStartDates().catch(console.error);
