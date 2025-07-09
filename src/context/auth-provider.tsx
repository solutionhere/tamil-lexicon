'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ALL_ADMIN_UIDS, SUPERADMIN_UID } from '@/lib/admins';

// The core context only deals with the user object and loading state.
interface CoreAuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const CoreAuthContext = createContext<CoreAuthContextType | undefined>(undefined);

// The provider component that will wrap the application.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up the listener for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Stable sign-in function, wrapped in useCallback.
  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }, []);

  // Stable sign-out function, wrapped in useCallback.
  const signOut = useCallback(() => {
    firebaseSignOut(auth).catch((error) => {
      console.error("Error signing out", error);
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders.
  // The value is stable because the functions are wrapped in useCallback.
  const value = useMemo(() => ({
      user,
      loading,
      signInWithGoogle,
      signOut
  }), [user, loading, signInWithGoogle, signOut]);

  return (
    <CoreAuthContext.Provider value={value}>
      {children}
    </CoreAuthContext.Provider>
  );
}

// Custom hook that provides the full auth context, including derived admin status.
interface FullAuthContextType extends CoreAuthContextType {
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

export function useAuth(): FullAuthContextType {
  const context = useContext(CoreAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { user } = context;

  // Derive admin status from the user object.
  // useMemo ensures this is only recalculated when the user changes.
  const isAdmin = useMemo(() => (user ? ALL_ADMIN_UIDS.includes(user.uid) : false), [user]);
  const isSuperAdmin = useMemo(() => (user ? user.uid === SUPERADMIN_UID : false), [user]);
  
  // Return the original context values plus the derived admin statuses.
  return {
    ...context,
    isAdmin,
    isSuperAdmin,
  };
}
