// TODO: Refactor to use Firebase Functions or new backend. Base44 import removed.
// Firebase/Firestore functions for authentication, progress, rewards, and team challenges
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// User Authentication
export const loginUser = async (email, password) => {
	return await signInWithEmailAndPassword(auth, email, password);
};
export const registerUser = async (email, password) => {
	return await createUserWithEmailAndPassword(auth, email, password);
};
export const logoutUser = async () => {
	return await signOut(auth);
};

// Progress
export const getUserProgress = async (userEmail) => {
	const q = query(collection(db, "gameProgress"), where("user_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};

// Rewards
export const getUserRewards = async (userEmail) => {
	const q = query(collection(db, "rewards"), where("user_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const addUserReward = async (rewardData) => {
	await addDoc(collection(db, "rewards"), rewardData);
};

// Team Challenges
export const getTeamChallenges = async (teamId) => {
	const q = query(collection(db, "teamChallenges"), where("team_id", "==", teamId));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const createTeamChallenge = async (challengeData) => {
	await addDoc(collection(db, "teamChallenges"), challengeData);
};


// TODO: Refactor squareWebhook to use new backend. Base44 removed.

// TODO: Refactor createSquareCheckout to use new backend. Base44 removed.

// TODO: Refactor generateAppIcons to use new backend. Base44 removed.

// TODO: Refactor getSquareLocations to use new backend. Base44 removed.

