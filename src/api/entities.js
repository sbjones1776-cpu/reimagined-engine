// Firebase/Firestore entity API calls
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig";

const db = getFirestore(firebaseApp);

// GameProgress
export const listGameProgress = async (userEmail) => {
	const q = query(collection(db, "gameProgress"), where("user_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const createGameProgress = async (progressData) => {
	await addDoc(collection(db, "gameProgress"), progressData);
};

// DailyChallenge
export const listDailyChallenges = async (date) => {
	const q = query(collection(db, "dailyChallenges"), where("challenge_date", "==", date));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const createDailyChallenge = async (challengeData) => {
	await addDoc(collection(db, "dailyChallenges"), challengeData);
};

// CustomGoal
export const listCustomGoals = async (userEmail) => {
	const q = query(collection(db, "customGoals"), where("child_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const createCustomGoal = async (goalData) => {
	await addDoc(collection(db, "customGoals"), goalData);
};
export const updateCustomGoal = async (goalId, data) => {
	await setDoc(doc(db, "customGoals", goalId), data, { merge: true });
};
export const deleteCustomGoal = async (goalId) => {
	await deleteDoc(doc(db, "customGoals", goalId));
};

// Message
export const listMessages = async (userEmail) => {
	const q = query(collection(db, "messages"), where("child_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const createMessage = async (messageData) => {
	await addDoc(collection(db, "messages"), messageData);
};
export const updateMessage = async (messageId, data) => {
	await setDoc(doc(db, "messages", messageId), data, { merge: true });
};
export const deleteMessage = async (messageId) => {
	await deleteDoc(doc(db, "messages", messageId));
};


// TODO: Refactor GameProgress to use new backend. Base44 removed.

// TODO: Refactor DailyChallenge to use new backend. Base44 removed.

// TODO: Refactor CustomGoal to use new backend. Base44 removed.

// TODO: Refactor Tournament to use new backend. Base44 removed.

// TODO: Refactor FriendConnection to use new backend. Base44 removed.

// TODO: Refactor TutorSession to use new backend. Base44 removed.

// TODO: Refactor TeamChallenge to use new backend. Base44 removed.

// TODO: Refactor PendingSubscription to use new backend. Base44 removed.

// TODO: Refactor Message to use new backend. Base44 removed.



// auth sdk:
// User authentication removed. Implement new authentication system here.