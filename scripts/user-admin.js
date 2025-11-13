/**
 * User Admin Script
 * 
 * Allows you to manually update user subscriptions, grant trials, etc.
 * 
 * Usage examples:
 *   node scripts/user-admin.js grant-trial user@example.com
 *   node scripts/user-admin.js extend-trial user@example.com 14
 *   node scripts/user-admin.js upgrade user@example.com premium_player
 *   node scripts/user-admin.js view user@example.com
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, updateDoc, serverTimestamp, Timestamp } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDLFVkEQ3JiBrZGFSNL7n6SjH7L7sF5vRA",
  authDomain: "math-adventure-app.firebaseapp.com",
  projectId: "math-adventure-app",
  storageBucket: "math-adventure-app.firebasestorage.app",
  messagingSenderId: "975991041265",
  appId: "1:975991041265:web:e94a33e96fdd2f5b5ae99b",
  measurementId: "G-EDFZRWHES9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString();
};

async function viewUser(email) {
  console.log(`\n👤 Looking up user: ${email}\n`);
  
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log('❌ User not found');
    return;
  }
  
  const user = userSnap.data();
  
  console.log('📋 User Information:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Email:              ${user.email}`);
  console.log(`Full Name:          ${user.full_name || 'Not set'}`);
  console.log(`Created:            ${formatDate(user.created_at)}`);
  console.log(`Last Updated:       ${formatDate(user.updated_at)}`);
  
  console.log('\n💳 Subscription:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Tier:               ${user.subscription_tier}`);
  console.log(`Expires:            ${formatDate(user.subscription_expires_at)}`);
  console.log(`Auto-renew:         ${user.subscription_auto_renew ? 'Yes' : 'No'}`);
  
  console.log('\n🎁 Trial Status:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Trial Started:      ${formatDate(user.trial_start_date)}`);
  console.log(`Trial Expires:      ${formatDate(user.trial_expires_at)}`);
  console.log(`Trial Used:         ${user.trial_used ? 'Yes' : 'No'}`);
  console.log(`Grace Used:         ${user.trial_grace_used ? 'Yes' : 'No'}`);
  
  console.log('\n⭐ Stats:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`Coins:              ${user.coins || 0}`);
  console.log(`Total Stars:        ${user.total_stars_earned || 0}`);
  console.log(`Login Streak:       ${user.daily_login_streak || 0} days`);
  console.log(`Total Logins:       ${user.total_login_days || 0} days`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

async function grantTrial(email, days = 7) {
  console.log(`\n🎁 Granting ${days}-day trial to: ${email}\n`);
  
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log('❌ User not found');
    return;
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  
  await updateDoc(userRef, {
    trial_start_date: Timestamp.fromDate(now),
    trial_expires_at: Timestamp.fromDate(expiresAt),
    trial_used: false,
    trial_grace_used: false,
    updated_at: serverTimestamp()
  });
  
  console.log('✅ Trial granted successfully!');
  console.log(`   Trial starts: ${now.toLocaleString()}`);
  console.log(`   Trial expires: ${expiresAt.toLocaleString()}`);
}

async function extendTrial(email, days) {
  console.log(`\n⏰ Extending trial by ${days} days for: ${email}\n`);
  
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log('❌ User not found');
    return;
  }
  
  const user = userSnap.data();
  
  if (!user.trial_expires_at) {
    console.log('❌ User has no active trial');
    return;
  }
  
  const currentExpiry = user.trial_expires_at.toDate();
  const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);
  
  await updateDoc(userRef, {
    trial_expires_at: Timestamp.fromDate(newExpiry),
    updated_at: serverTimestamp()
  });
  
  console.log('✅ Trial extended successfully!');
  console.log(`   Previous expiry: ${currentExpiry.toLocaleString()}`);
  console.log(`   New expiry: ${newExpiry.toLocaleString()}`);
}

async function upgradeUser(email, tier, months = 1) {
  console.log(`\n⬆️ Upgrading user to ${tier} for ${months} month(s): ${email}\n`);
  
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log('❌ User not found');
    return;
  }
  
  const validTiers = ['free', 'premium_player', 'premium_parent', 'family_teacher'];
  if (!validTiers.includes(tier)) {
    console.log(`❌ Invalid tier. Must be one of: ${validTiers.join(', ')}`);
    return;
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + months * 30 * 24 * 60 * 60 * 1000);
  
  await updateDoc(userRef, {
    subscription_tier: tier,
    subscription_expires_at: Timestamp.fromDate(expiresAt),
    subscription_auto_renew: false,
    updated_at: serverTimestamp()
  });
  
  console.log('✅ User upgraded successfully!');
  console.log(`   New tier: ${tier}`);
  console.log(`   Expires: ${expiresAt.toLocaleString()}`);
}

async function resetTrial(email) {
  console.log(`\n🔄 Resetting trial for: ${email}\n`);
  
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    console.log('❌ User not found');
    return;
  }
  
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  await updateDoc(userRef, {
    trial_start_date: Timestamp.fromDate(now),
    trial_expires_at: Timestamp.fromDate(expiresAt),
    trial_used: false,
    trial_grace_used: false,
    updated_at: serverTimestamp()
  });
  
  console.log('✅ Trial reset successfully!');
  console.log(`   New trial expires: ${expiresAt.toLocaleString()}`);
}

// Main command handler
const command = process.argv[2];
const email = process.argv[3];
const arg3 = process.argv[4];

if (!command) {
  console.log('\n📖 Usage:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  node scripts/user-admin.js view <email>');
  console.log('  node scripts/user-admin.js grant-trial <email> [days]');
  console.log('  node scripts/user-admin.js extend-trial <email> <days>');
  console.log('  node scripts/user-admin.js upgrade <email> <tier> [months]');
  console.log('  node scripts/user-admin.js reset-trial <email>');
  console.log('\n📝 Examples:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  node scripts/user-admin.js view user@example.com');
  console.log('  node scripts/user-admin.js grant-trial user@example.com 14');
  console.log('  node scripts/user-admin.js extend-trial user@example.com 7');
  console.log('  node scripts/user-admin.js upgrade user@example.com premium_player 12');
  console.log('  node scripts/user-admin.js reset-trial user@example.com\n');
  process.exit(1);
}

if (!email && command !== 'help') {
  console.log('❌ Email address required');
  process.exit(1);
}

async function main() {
  try {
    switch (command) {
      case 'view':
        await viewUser(email);
        break;
      case 'grant-trial':
        await grantTrial(email, parseInt(arg3) || 7);
        break;
      case 'extend-trial':
        if (!arg3) {
          console.log('❌ Number of days required');
          process.exit(1);
        }
        await extendTrial(email, parseInt(arg3));
        break;
      case 'upgrade':
        if (!arg3) {
          console.log('❌ Subscription tier required');
          process.exit(1);
        }
        await upgradeUser(email, arg3, parseInt(process.argv[5]) || 1);
        break;
      case 'reset-trial':
        await resetTrial(email);
        break;
      default:
        console.log(`❌ Unknown command: ${command}`);
        process.exit(1);
    }
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
