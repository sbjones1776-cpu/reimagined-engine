import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
import { app } from '@/firebaseConfig';
import { createUserProfile, getUserProfile } from '@/api/firebaseService';

export function useFirebaseUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);
    let userDocUnsub = null;
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        // Ensure profile exists
        const profile = await getUserProfile(fbUser.email);
        setUser(profile);
        // Subscribe to live updates on the user document
        if (userDocUnsub) userDocUnsub();
        userDocUnsub = onSnapshot(doc(db, 'users', fbUser.email), (snap) => {
          if (snap.exists()) {
            setUser({ id: snap.id, ...snap.data() });
          }
        });
      } catch (e) {
        console.error('Failed to load user profile', e);
        setError(e);
      } finally {
        setLoading(false);
      }
    });
    return () => {
      if (userDocUnsub) userDocUnsub();
      unsub();
    };
  }, []);

  return { user, loading, error };
}
