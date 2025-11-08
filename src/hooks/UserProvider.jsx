import React, { createContext, useContext } from 'react';
import { useFirebaseUser } from './useFirebaseUser';

// Provides global user/auth state sourced from Firebase user document.
// Ensures only one instance of useFirebaseUser runs, avoiding duplicate auth listeners.
const UserContext = createContext({ user: null, loading: true, error: null });

export function UserProvider({ children }) {
  const value = useFirebaseUser();
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  return useContext(UserContext);
}
