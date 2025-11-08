# Firebase Backend Setup Guide

## Overview
This app now uses Firebase for all backend operations including authentication, database, and real-time features.

## Firestore Collections

### 1. users
Stores user profiles and settings.

**Document ID:** User's email address

**Fields:**
- `email` (string): User's email
- `subscription_tier` (string): 'free', 'premium_player', 'premium_parent', 'family_teacher'
- `subscription_expires_at` (timestamp): Subscription expiration
- `coins` (number): Virtual currency balance
- `stars_spent` (number): Stars used for purchases
- `total_stars_earned` (number): Lifetime stars earned
- `owned_pets` (array): IDs of purchased pets
- `active_pet` (string): Currently equipped pet ID
- `purchased_items` (array): IDs of purchased avatar items
- `power_ups` (object): Power-up inventory {power_up_id: quantity}
- `pet_experience` (object): Pet XP {pet_id: xp_value}
- `daily_login_streak` (number): Consecutive login days
- `last_login_date` (string): YYYY-MM-DD format
- `parental_controls` (object): Parent settings
- `daily_usage_tracking` (object): Time tracking data
- `is_parent_mode` (boolean): Parent account flag
- `parent_email` (string): Linked parent email
- `child_name` (string): Child's display name
- `created_at` (timestamp): Account creation
- `updated_at` (timestamp): Last update

### 2. gameProgress
Tracks individual game session results.

**Document ID:** Auto-generated

**Fields:**
- `user_email` (string): Player's email
- `operation` (string): Math concept played (e.g., 'addition', 'fractions')
- `level` (string): 'easy', 'medium', 'hard', 'expert'
- `score` (number): Points earned
- `correct_answers` (number): Correct question count
- `total_questions` (number): Total questions answered
- `time_taken` (number): Seconds to complete
- `stars_earned` (number): Stars awarded (0-3)
- `coins_earned` (number): Coins rewarded
- `accuracy` (number): Percentage correct
- `completed_at` (timestamp): When game finished

### 3. dailyChallenges
Records daily challenge completions.

**Document ID:** Auto-generated

**Fields:**
- `user_email` (string): Player's email
- `challenge_type` (string): Type of challenge (e.g., 'speed_round', 'accuracy_focus')
- `challenge_date` (string): YYYY-MM-DD format
- `score` (number): Points earned
- `correct_answers` (number): Correct answers
- `total_questions` (number): Total questions
- `time_taken` (number): Completion time in seconds
- `stars_earned` (number): Stars awarded
- `bonus_coins` (number): Bonus coins earned
- `completed_at` (timestamp): Completion timestamp

### 4. messages
Parent-child messaging system.

**Document ID:** Auto-generated

**Fields:**
- `parent_email` (string): Sender email
- `child_email` (string): Recipient email
- `subject` (string): Message subject
- `message_text` (string): Message body
- `is_read` (boolean): Read status
- `sent_at` (timestamp): When sent
- `read_at` (timestamp): When read (optional)

### 5. teamChallenges
Collaborative challenges for groups.

**Document ID:** Auto-generated

**Fields:**
- `creator_email` (string): Challenge creator
- `challenge_name` (string): Challenge title
- `challenge_type` (string): Type (e.g., 'team_score', 'concept_mastery')
- `description` (string): Challenge description
- `target_value` (number): Goal to reach
- `team_members` (array): Array of member emails
- `start_date` (string): YYYY-MM-DD
- `end_date` (string): YYYY-MM-DD (optional)
- `reward_stars` (number): Stars reward
- `reward_coins` (number): Coins reward
- `is_completed` (boolean): Completion status
- `current_progress` (number): Current progress value
- `specific_operation` (string): Focused math concept
- `specific_level` (string): Difficulty requirement
- `created_at` (timestamp): Creation time

### 6. tutorSessions
AI tutor interaction logs.

**Document ID:** Auto-generated

**Fields:**
- `user_email` (string): Student email
- `question` (string): Math question text
- `correct_answer` (string): Right answer
- `user_answer` (string): Student's answer
- `operation` (string): Math concept
- `level` (string): Difficulty level
- `hint_requested` (boolean): Whether hint was used
- `hint_text` (string): Hint content (optional)
- `explanation_viewed` (boolean): Whether explanation was shown
- `explanation_text` (string): Explanation content (optional)
- `created_at` (timestamp): Session time

### 7. friendConnections
Friend system for social features.

**Document ID:** Auto-generated

**Fields:**
- `user_email` (string): Request sender
- `friend_email` (string): Request recipient
- `status` (string): 'pending', 'accepted', 'rejected'
- `sent_at` (timestamp): When request sent
- `updated_at` (timestamp): Status change time (optional)

## Security Rules

Security rules are defined in `firestore.rules`. Key principles:

- Users can only read/write their own data
- Leaderboard data is readable by all authenticated users
- Team challenge members can access shared challenges
- Parents can message their linked children
- Friend connections are visible to both parties

## Indexes

Composite indexes are defined in `firestore.indexes.json` for:

- Sorting game progress by user and date
- Leaderboard queries (score + date)
- Daily challenge lookups
- Message inbox queries
- Friend connection filtering

## Setup Instructions

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Build > Firestore Database**
4. Click **Create Database**
5. Choose **Start in production mode** (rules are already configured)
6. Select a location close to your users

### 2. Deploy Security Rules

```bash
firebase deploy --only firestore:rules
```

### 3. Deploy Indexes

```bash
firebase deploy --only firestore:indexes
```

### 4. Enable Authentication

1. Go to **Build > Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. (Optional) Enable **Google** sign-in for easier auth

### 5. Configure Firebase in App

Ensure `src/firebaseConfig.js` has your Firebase project credentials:

```javascript
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const firebaseApp = app;
```

## API Reference

All Firebase operations are abstracted in `src/api/firebaseService.js`:

### User Operations
- `createUserProfile(email, additionalData)` - Create new user
- `getUserProfile(email)` - Fetch user data
- `updateUserProfile(email, updates)` - Update user fields
- `getAllUsers()` - Get all users (for leaderboards)

### Game Progress
- `saveGameProgress(email, progressData)` - Record game session
- `getUserGameProgress(email)` - Get user's game history
- `getAllGameProgress()` - Get top scores globally

### Daily Challenges
- `saveDailyChallenge(email, challengeData)` - Record challenge completion
- `getUserDailyChallenges(email)` - Get user's challenge history
- `getAllDailyChallenges()` - Get global challenge data

### Messages
- `sendMessage(messageData)` - Send parent-child message
- `getMessagesForUser(email)` - Get user's inbox
- `markMessageAsRead(messageId)` - Mark message read
- `deleteMessage(messageId)` - Delete message

### Team Challenges
- `createTeamChallenge(challengeData)` - Create group challenge
- `getUserTeamChallenges(email)` - Get user's team challenges
- `updateTeamChallenge(challengeId, updates)` - Update challenge

### Tutor Sessions
- `saveTutorSession(email, sessionData)` - Log AI tutor interaction
- `getUserTutorSessions(email)` - Get tutoring history

### Friend Connections
- `sendFriendRequest(userEmail, friendEmail)` - Send friend request
- `getUserFriendConnections(email)` - Get accepted friends
- `getPendingFriendRequests(email)` - Get pending requests
- `updateFriendRequestStatus(connectionId, status)` - Accept/reject request

## Data Migration

If you have existing data, create a migration script:

```javascript
import { getAllUsers, createUserProfile } from './api/firebaseService';

async function migrateData() {
  // Import old data
  const oldUsers = await fetchFromOldDatabase();
  
  // Create Firebase documents
  for (const oldUser of oldUsers) {
    await createUserProfile(oldUser.email, {
      subscription_tier: oldUser.tier,
      coins: oldUser.coin_balance,
      // ... map other fields
    });
  }
}
```

## Performance Tips

1. **Enable persistence** for offline support:
```javascript
import { enableIndexedDbPersistence } from 'firebase/firestore';
enableIndexedDbPersistence(db);
```

2. **Use React Query caching** - Already configured with 5-minute stale time

3. **Batch writes** when updating multiple documents:
```javascript
import { writeBatch } from 'firebase/firestore';
const batch = writeBatch(db);
// Add operations...
await batch.commit();
```

4. **Paginate large queries**:
```javascript
import { query, limit, startAfter } from 'firebase/firestore';
const q = query(collection(db, 'gameProgress'), limit(25));
```

## Monitoring

1. Go to **Firebase Console > Firestore Database**
2. Click **Usage** tab to monitor reads/writes
3. Set up billing alerts if needed (free tier: 50k reads/day, 20k writes/day)

## Troubleshooting

### "Missing or insufficient permissions"
- Check that security rules are deployed
- Verify user is authenticated
- Ensure document email matches auth user email

### "Index not found"
- Deploy indexes: `firebase deploy --only firestore:indexes`
- Or create index via Firebase Console link in error message

### Slow queries
- Check that indexes exist for your query
- Limit result size with `.limit()`
- Add pagination for large datasets

## Next Steps

- [ ] Set up Firebase Functions for server-side logic (AI tutor)
- [ ] Configure Firebase Storage for user avatars
- [ ] Enable Firebase Analytics for usage tracking
- [ ] Set up Cloud Messaging for push notifications
- [ ] Configure Firebase Hosting for production deployment
