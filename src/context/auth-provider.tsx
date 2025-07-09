'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

type Role = 'user' | 'admin' | 'superadmin';

// The core context only deals with the user object and loading state.
interface CoreAuthContextType {
  user: User | null;
  loading: boolean;
  role: Role | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const CoreAuthContext = createContext<CoreAuthContextType | undefined>(undefined);

// The provider component that will wrap the application.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up the listener for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setRole(userDoc.data().role || 'user');
        } else {
          // If user doc doesn't exist, create it with 'user' role
          await setDoc(userDocRef, { role: 'user' }, { merge: true });
          setRole('user');
        }
      } else {
        setUser(null);
        setRole(null);
      }
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
  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  }, []);

  const value = useMemo(() => ({
      user,
      loading,
      role,
      signInWithGoogle,
      signOut
  }), [user, loading, role, signInWithGoogle, signOut]);

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

  const { role } = context;

  const isAdmin = useMemo(() => role === 'admin' || role === 'superadmin', [role]);
  const isSuperAdmin = useMemo(() => role === 'superadmin', [role]);
  
  return {
    ...context,
    isAdmin,
    isSuperAdmin,
  };
}
