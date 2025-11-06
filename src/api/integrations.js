// Firebase/Firestore integration functions for analytics, notifications, and lesson assignments
import { getFirestore, collection, doc, getDoc, getDocs, addDoc, setDoc, deleteDoc, query, where } from "firebase/firestore";
import { app as firebaseApp } from "@/firebaseConfig";

const db = getFirestore(firebaseApp);

// Analytics
export const getUserAnalytics = async (userEmail) => {
	const q = query(collection(db, "analytics"), where("user_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};

// Notifications
export const getUserNotifications = async (userEmail) => {
	const q = query(collection(db, "notifications"), where("user_email", "==", userEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const addUserNotification = async (notificationData) => {
	await addDoc(collection(db, "notifications"), notificationData);
};

// Lesson Assignments
export const getLessonAssignments = async (childEmail) => {
	const q = query(collection(db, "lessonAssignments"), where("child_email", "==", childEmail));
	const snapshot = await getDocs(q);
	return snapshot.docs.map(doc => doc.data());
};
export const createLessonAssignment = async (assignmentData) => {
	await addDoc(collection(db, "lessonAssignments"), assignmentData);
};
export const updateLessonAssignment = async (assignmentId, data) => {
	await setDoc(doc(db, "lessonAssignments", assignmentId), data, { merge: true });
};
export const deleteLessonAssignment = async (assignmentId) => {
	await deleteDoc(doc(db, "lessonAssignments", assignmentId));
};




// TODO: Refactor Core to use new backend. Base44 removed.

// TODO: Refactor InvokeLLM to use new backend. Base44 removed.

// TODO: Refactor SendEmail to use new backend. Base44 removed.

// TODO: Refactor UploadFile to use new backend. Base44 removed.

// TODO: Refactor GenerateImage to use new backend. Base44 removed.

// TODO: Refactor ExtractDataFromUploadedFile to use new backend. Base44 removed.

// TODO: Refactor CreateFileSignedUrl to use new backend. Base44 removed.

// TODO: Refactor UploadPrivateFile to use new backend. Base44 removed.






