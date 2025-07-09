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
  isSigningIn: boolean; // For the sign-in process
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    console.log("Setting up onAuthStateChanged listener...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("onAuthStateChanged triggered. User:", user ? user.uid : null);
      setUser(user);
      if (user) {
        const adminStatus = ALL_ADMIN_UIDS.includes(user.uid);
        const superAdminStatus = user.uid === SUPERADMIN_UID;
        setIsAdmin(adminStatus);
        setIsSuperAdmin(superAdminStatus);
        console.log('Logged in User UID:', user.uid);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });

    return () => {
        console.log("Cleaning up onAuthStateChanged listener.");
        unsubscribe();
    };
  }, []);

  const signInWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    setIsSigningIn(true);
    console.log("Starting signInWithPopup...");

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log("signInWithPopup successful for user:", result.user.displayName);
        // Success state is handled by the onAuthStateChanged listener.
      })
      .catch((error: any) => {
        if (error.code !== 'auth/popup-closed-by-user') {
          console.error("Error signing in with Google:", error);
        } else {
          console.log("Sign-in popup closed by user.");
        }
      })
      .finally(() => {
        setIsSigningIn(false);
      });
  }, []);

  const signOut = useCallback(() => {
    firebaseSignOut(auth).catch((error) => {
      console.error("Error signing out", error);
    });
  }, []);

  const value = useMemo(() => ({ 
      user, 
      isAdmin, 
      isSuperAdmin, 
      loading, 
      isSigningIn, 
      signInWithGoogle, 
      signOut 
  }), [user, isAdmin, isSuperAdmin, loading, isSigningIn, signInWithGoogle, signOut]);

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
