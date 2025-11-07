import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AlzaSyA-ji4PrndkvUwbcN6axWGjLJd-pNJrTBY",
  authDomain: "math-adventure-app.firebaseapp.com",
  projectId: "math-adventure-app",
  storageBucket: "math-adventure-app.appspot.com",
  // Add messagingSenderId and appId if you have them
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
