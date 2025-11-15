import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig';

const db = getFirestore(app);
const auth = getAuth(app);

// ========================================
// USER OPERATIONS
// ========================================

/**
 * User Document Schema:
 * - subscription_tier: Subscription tier level. One of:
 *   - 'free' (default, no subscription)
 *   - 'premium_player' (individual student subscription)
 *   - 'premium_parent' (parent monitoring subscription)
 *   - 'family_teacher' (multi-student/classroom subscription)
 * - This field is populated automatically by the backend (functions/index.js)
 *   when verifying Play Billing or Square purchases based on the productId.
 */

export const createUserProfile = async (email, additionalData = {}) => {
  const userRef = doc(db, 'users', email);
  // Step 1: Create user with trial_start_date and created_at as serverTimestamp (will resolve after write)
  const userData = {
    email,
    subscription_tier: 'free',
    subscription_expires_at: null,
    subscription_auto_renew: false,
    trial_start_date: serverTimestamp(), // will be overwritten below
    trial_expires_at: null, // will be set after serverTimestamp resolves
    trial_used: false,
    trial_grace_used: false,
    coins: 0,
    stars_spent: 0,
    total_stars_earned: 0,
    owned_pets: [],
    active_pet: null,
    purchased_items: [],
    unlocked_items: [],
    power_ups: {},
    pet_experience: {},
    daily_login_streak: 0,
    total_login_days: 0,
    last_login_date: null,
    parental_controls: {
      enabled: false,
      allowed_operations: [],
      allowed_levels: [],
      focus_operations: [],
      daily_time_limit_minutes: 0,
      enforce_time_limits: false
    },
    daily_usage_tracking: {},
    is_parent_mode: false,
    is_premium_parent: false,
    is_family_teacher: false,
    parent_email: null,
    child_name: null,
    full_name: null,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
    ...additionalData
  };

  await setDoc(userRef, userData);

  // Step 2: Fetch the document to get the resolved serverTimestamp
  const snap = await getDoc(userRef);
  const data = snap.data();
  let createdAt = null;
  if (data && data.created_at && data.created_at.toDate) {
    createdAt = data.created_at.toDate();
  } else if (data && data.created_at && data.created_at.seconds) {
    createdAt = new Date(data.created_at.seconds * 1000);
  }
  if (createdAt) {
    // Overwrite trial_start_date with created_at
    await updateDoc(userRef, {
      trial_start_date: Timestamp.fromDate(createdAt),
      updated_at: serverTimestamp(),
    });
    // Set trial_expires_at based on created_at
    const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
    await updateDoc(userRef, {
      trial_expires_at: Timestamp.fromDate(expiresAt),
      updated_at: serverTimestamp(),
    });
    // Return the updated data
    return { ...data, trial_start_date: Timestamp.fromDate(createdAt), trial_expires_at: Timestamp.fromDate(expiresAt) };
  }
  // If for some reason createdAt is not available, just return the initial data
  return data || userData;
};

export const getUserProfile = async (email) => {
  const userRef = doc(db, 'users', email);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  }
  
  // If user doesn't exist, create default profile (no trial)
  return await createUserProfile(email);
};

export const updateUserProfile = async (email, updates) => {
  const userRef = doc(db, 'users', email);
  await updateDoc(userRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
};

export const getAllUsers = async () => {
  const usersRef = collection(db, 'users');
  const snapshot = await getDocs(usersRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ========================================
// GAME PROGRESS OPERATIONS
// ========================================

export const saveGameProgress = async (email, progressData) => {
  const progressRef = collection(db, 'gameProgress');
  const newProgressRef = doc(progressRef);
  
  const data = {
    user_email: email,
    operation: progressData.operation,
    level: progressData.level,
    score: progressData.score || 0,
    correct_answers: progressData.correct_answers || 0,
    total_questions: progressData.total_questions || 0,
    time_taken: progressData.time_taken || 0,
    stars_earned: progressData.stars_earned || 0,
    coins_earned: progressData.coins_earned || 0,
    accuracy: progressData.accuracy || 0,
    completed_at: serverTimestamp(),
    ...progressData
  };
  
  await setDoc(newProgressRef, data);
  return { id: newProgressRef.id, ...data };
};

export const getUserGameProgress = async (email) => {
  const progressRef = collection(db, 'gameProgress');
  const q = query(
    progressRef, 
    where('user_email', '==', email),
    orderBy('completed_at', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

/**
 * subscribeUserGameProgress(email, callback)
 * Real-time subscription for a user's game progress ordered by completed_at desc.
 * Returns an unsubscribe function.
 */
export const subscribeUserGameProgress = (email, callback) => {
  const progressRef = collection(db, 'gameProgress');
  const q = query(
    progressRef,
    where('user_email', '==', email),
    orderBy('completed_at', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

export const getAllGameProgress = async () => {
  const progressRef = collection(db, 'gameProgress');
  const q = query(progressRef, orderBy('score', 'desc'), limit(100));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ========================================
// DAILY CHALLENGE OPERATIONS
// ========================================

export const saveDailyChallenge = async (email, challengeData) => {
  const challengeRef = collection(db, 'dailyChallenges');
  const newChallengeRef = doc(challengeRef);
  
  const data = {
    user_email: email,
    challenge_type: challengeData.challenge_type,
    challenge_date: challengeData.challenge_date,
    score: challengeData.score || 0,
    correct_answers: challengeData.correct_answers || 0,
    total_questions: challengeData.total_questions || 0,
    time_taken: challengeData.time_taken || 0,
    stars_earned: challengeData.stars_earned || 0,
    bonus_coins: challengeData.bonus_coins || 0,
    completed_at: serverTimestamp(),
    ...challengeData
  };
  
  await setDoc(newChallengeRef, data);
  return { id: newChallengeRef.id, ...data };
};

export const getUserDailyChallenges = async (email) => {
  const challengeRef = collection(db, 'dailyChallenges');
  const q = query(
    challengeRef,
    where('user_email', '==', email),
    orderBy('completed_at', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllDailyChallenges = async () => {
  const challengeRef = collection(db, 'dailyChallenges');
  const q = query(challengeRef, orderBy('score', 'desc'), limit(100));
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ========================================
// MESSAGE OPERATIONS
// ========================================

export const sendMessage = async (messageData) => {
  const messageRef = collection(db, 'messages');
  const newMessageRef = doc(messageRef);
  
  const data = {
    parent_email: messageData.parent_email,
    child_email: messageData.child_email,
    subject: messageData.subject,
    message_text: messageData.message_text,
    is_read: false,
    sent_at: serverTimestamp(),
    ...messageData
  };
  
  await setDoc(newMessageRef, data);
  return { id: newMessageRef.id, ...data };
};

export const getMessagesForUser = async (email) => {
  const messageRef = collection(db, 'messages');
  const q = query(
    messageRef,
    where('child_email', '==', email),
    orderBy('sent_at', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markMessageAsRead = async (messageId) => {
  const messageRef = doc(db, 'messages', messageId);
  await updateDoc(messageRef, {
    is_read: true,
    read_at: serverTimestamp()
  });
};

export const deleteMessage = async (messageId) => {
  const messageRef = doc(db, 'messages', messageId);
  await deleteDoc(messageRef);
};

// ========================================
// TEAM CHALLENGE OPERATIONS
// ========================================

export const createTeamChallenge = async (challengeData) => {
  const challengeRef = collection(db, 'teamChallenges');
  const newChallengeRef = doc(challengeRef);
  
  const data = {
    creator_email: challengeData.creator_email,
    challenge_name: challengeData.challenge_name,
    challenge_type: challengeData.challenge_type,
    description: challengeData.description || '',
    target_value: challengeData.target_value || 0,
    team_members: challengeData.team_members || [],
    start_date: challengeData.start_date,
    end_date: challengeData.end_date || null,
    reward_stars: challengeData.reward_stars || 0,
    reward_coins: challengeData.reward_coins || 0,
    is_completed: false,
    current_progress: 0,
    specific_operation: challengeData.specific_operation || 'any',
    specific_level: challengeData.specific_level || 'any',
    created_at: serverTimestamp(),
    ...challengeData
  };
  
  await setDoc(newChallengeRef, data);
  return { id: newChallengeRef.id, ...data };
};

export const getUserTeamChallenges = async (email) => {
  const challengeRef = collection(db, 'teamChallenges');
  
  // Get challenges where user is creator or member
  const q1 = query(challengeRef, where('creator_email', '==', email));
  const q2 = query(challengeRef, where('team_members', 'array-contains', email));
  
  const [snapshot1, snapshot2] = await Promise.all([
    getDocs(q1),
    getDocs(q2)
  ]);
  
  const challenges = new Map();
  snapshot1.docs.forEach(doc => challenges.set(doc.id, { id: doc.id, ...doc.data() }));
  snapshot2.docs.forEach(doc => challenges.set(doc.id, { id: doc.id, ...doc.data() }));
  
  return Array.from(challenges.values());
};

export const updateTeamChallenge = async (challengeId, updates) => {
  const challengeRef = doc(db, 'teamChallenges', challengeId);
  await updateDoc(challengeRef, {
    ...updates,
    updated_at: serverTimestamp()
  });
};

// ========================================
// TUTOR SESSION OPERATIONS
// ========================================

export const saveTutorSession = async (email, sessionData) => {
  const sessionRef = collection(db, 'tutorSessions');
  const newSessionRef = doc(sessionRef);
  
  const data = {
    user_email: email,
    question: sessionData.question,
    correct_answer: sessionData.correct_answer,
    user_answer: sessionData.user_answer,
    operation: sessionData.operation,
    level: sessionData.level,
    hint_requested: sessionData.hint_requested || false,
    hint_text: sessionData.hint_text || null,
    explanation_viewed: sessionData.explanation_viewed || false,
    explanation_text: sessionData.explanation_text || null,
    created_at: serverTimestamp(),
    ...sessionData
  };
  
  await setDoc(newSessionRef, data);
  return { id: newSessionRef.id, ...data };
};

export const getUserTutorSessions = async (email) => {
  const sessionRef = collection(db, 'tutorSessions');
  const q = query(
    sessionRef,
    where('user_email', '==', email),
    orderBy('created_at', 'desc'),
    limit(50)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ========================================
// FRIEND CONNECTION OPERATIONS
// ========================================

export const sendFriendRequest = async (userEmail, friendEmail) => {
  const connectionRef = collection(db, 'friendConnections');
  const newConnectionRef = doc(connectionRef);
  
  const data = {
    user_email: userEmail,
    friend_email: friendEmail,
    status: 'pending',
    sent_at: serverTimestamp()
  };
  
  await setDoc(newConnectionRef, data);
  return { id: newConnectionRef.id, ...data };
};

export const getUserFriendConnections = async (email) => {
  const connectionRef = collection(db, 'friendConnections');
  
  // Get connections where user sent or received
  const q1 = query(
    connectionRef,
    where('user_email', '==', email),
    where('status', '==', 'accepted')
  );
  const q2 = query(
    connectionRef,
    where('friend_email', '==', email),
    where('status', '==', 'accepted')
  );
  
  const [snapshot1, snapshot2] = await Promise.all([
    getDocs(q1),
    getDocs(q2)
  ]);
  
  return [
    ...snapshot1.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ...snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  ];
};

export const getPendingFriendRequests = async (email) => {
  const connectionRef = collection(db, 'friendConnections');
  const q = query(
    connectionRef,
    where('friend_email', '==', email),
    where('status', '==', 'pending')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateFriendRequestStatus = async (connectionId, status) => {
  const connectionRef = doc(db, 'friendConnections', connectionId);
  await updateDoc(connectionRef, {
    status,
    updated_at: serverTimestamp()
  });
};

// ========================================
// HELPER FUNCTIONS
// ========================================

export const getCurrentUser = () => {
  return auth.currentUser;
};

export const getCurrentUserEmail = () => {
  const user = auth.currentUser;
  return user ? user.email : null;
};
