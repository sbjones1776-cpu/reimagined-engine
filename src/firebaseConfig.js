import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA-ji4PrndkvUwbcN6axWGjLJd-pNJrTBY",
  authDomain: "math-adventure-app.firebaseapp.com",
  projectId: "math-adventure-app",
  storageBucket: "math-adventure-app.firebasestorage.app",
  messagingSenderId: "685781375492",
  appId: "1:685781375492:web:cb2f52696292927cb07351",
  measurementId: "G-FGQWD7WPCY"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence and better error handling
import { enableIndexedDbPersistence } from "firebase/firestore";
try {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence: Not supported in this browser');
    }
  });
} catch (e) {
  console.warn('Firestore persistence init failed:', e);
}
// Guard analytics initialization: avoid runtime errors in unsupported environments (e.g. localhost without measurement or SSR)
let analyticsInstance = null;
try {
  isSupported().then((supported) => {
    if (supported) {
      analyticsInstance = getAnalytics(app);
    }
  }).catch(() => {/* ignore */});
} catch {/* ignore */}
export const analytics = analyticsInstance;
