import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AlzaSyA-ji4PrndkvUwbcN6axWGjLJd-pNJrTBY",
  authDomain: "math-adventure-app.firebaseapp.com",
  projectId: "math-adventure-app",
  // Add other config values here if needed (storageBucket, messagingSenderId, appId, etc.)
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
