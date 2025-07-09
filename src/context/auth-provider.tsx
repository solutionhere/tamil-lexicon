'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ALL_ADMIN_UIDS, SUPERADMIN_UID } from '@/lib/admins';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean; // For initial auth check
  signInWithGoogle: () => Promise<void>; // Return a promise to allow chaining
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect runs once on mount to set up the auth state listener.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const adminStatus = ALL_ADMIN_UIDS.includes(user.uid);
        const superAdminStatus = user.uid === SUPERADMIN_UID;
        setIsAdmin(adminStatus);
        setIsSuperAdmin(superAdminStatus);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    // The promise will be handled by the component that calls this function.
    // This avoids triggering state changes within the provider during the auth flow.
    await signInWithPopup(auth, provider);
  }, []);

  const signOut = useCallback(() => {
    firebaseSignOut(auth).catch((error) => {
      console.error("Error signing out", error);
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders of consumers.
  const value = useMemo(() => ({
      user,
      isAdmin,
      isSuperAdmin,
      loading,
      signInWithGoogle,
      signOut
  }), [user, isAdmin, isSuperAdmin, loading, signInWithGoogle, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
