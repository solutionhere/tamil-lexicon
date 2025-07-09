'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { ALL_ADMIN_UIDS, SUPERADMIN_UID } from '@/lib/admins';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        // Check if the logged-in user is an admin or superadmin
        const adminStatus = ALL_ADMIN_UIDS.includes(user.uid);
        const superAdminStatus = user.uid === SUPERADMIN_UID;
        setIsAdmin(adminStatus);
        setIsSuperAdmin(superAdminStatus);
        
        // You can find your UID by logging `user.uid` to the console
        console.log('Logged in User UID:', user.uid);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const value = { user, isAdmin, isSuperAdmin, loading, signInWithGoogle, signOut };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <Skeleton className="h-16 w-16 rounded-full" />
        </div>
      ) : (
        children
      )}
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
