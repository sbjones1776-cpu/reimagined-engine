/**
 * Export Users Script
 * 
 * Exports all user data from Firestore to a CSV file for analysis.
 * 
 * Usage: node scripts/export-users.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase config (same as your app)
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

async function exportUsers() {
  console.log('📊 Fetching all users from Firestore...');
  
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  
  const users = [];
  
  snapshot.forEach(doc => {
    const data = doc.data();
    
    // Format timestamps for CSV
    const formatDate = (timestamp) => {
      if (!timestamp) return '';
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toISOString();
    };
    
    users.push({
      email: data.email || '',
      full_name: data.full_name || '',
      subscription_tier: data.subscription_tier || 'free',
      created_at: formatDate(data.created_at),
      
      // Trial info
      trial_start_date: formatDate(data.trial_start_date),
      trial_expires_at: formatDate(data.trial_expires_at),
      trial_used: data.trial_used || false,
      trial_grace_used: data.trial_grace_used || false,
      
      // Subscription info
      subscription_expires_at: formatDate(data.subscription_expires_at),
      subscription_auto_renew: data.subscription_auto_renew || false,
      
      // Usage stats
      coins: data.coins || 0,
      total_stars_earned: data.total_stars_earned || 0,
      daily_login_streak: data.daily_login_streak || 0,
      total_login_days: data.total_login_days || 0,
      last_login_date: formatDate(data.last_login_date),
      
      // Parent/child info
      parent_email: data.parent_email || '',
      child_name: data.child_name || '',
      is_parent_mode: data.is_parent_mode || false,
      
      updated_at: formatDate(data.updated_at)
    });
  });
  
  console.log(`✅ Found ${users.length} users`);
  
  // Convert to CSV
  if (users.length === 0) {
    console.log('⚠️ No users found');
    return;
  }
  
  const headers = Object.keys(users[0]);
  const csvRows = [
    headers.join(','),
    ...users.map(user => 
      headers.map(header => {
        const value = user[header];
        // Escape commas and quotes in CSV
        const escaped = String(value).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ];
  
  const csvContent = csvRows.join('\n');
  const outputPath = path.join(__dirname, '..', 'user-export.csv');
  
  fs.writeFileSync(outputPath, csvContent, 'utf8');
  
  console.log(`\n📄 User data exported to: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total users: ${users.length}`);
  
  const tierCounts = users.reduce((acc, user) => {
    acc[user.subscription_tier] = (acc[user.subscription_tier] || 0) + 1;
    return acc;
  }, {});
  
  console.log(`\n   By subscription tier:`);
  Object.entries(tierCounts).forEach(([tier, count]) => {
    console.log(`     ${tier}: ${count}`);
  });
  
  const onTrialCount = users.filter(u => 
    u.trial_start_date && !u.trial_used
  ).length;
  
  console.log(`\n   Active trials: ${onTrialCount}`);
  
  process.exit(0);
}

exportUsers().catch(error => {
  console.error('❌ Error exporting users:', error);
  process.exit(1);
});
