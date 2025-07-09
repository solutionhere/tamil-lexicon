"use client";
import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Shield, LogOut, LogIn, LayoutDashboard, Puzzle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/auth-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from '@/components/ui/skeleton';

interface LexiconHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function LexiconHeader({ searchQuery, onSearchQueryChange }: LexiconHeaderProps) {
    const { user, isAdmin, signInWithGoogle, signOut, loading } = useAuth();
    const [isSigningIn, setIsSigningIn] = useState(false);

    const handleSignIn = useCallback(async () => {
        setIsSigningIn(true);
        try {
            await signInWithGoogle();
        } catch (error: any) {
            if (error.code !== 'auth/popup-closed-by-user') {
                console.error("Error signing in with Google:", error);
            }
        } finally {
            setIsSigningIn(false);
        }
    }, [signInWithGoogle]);

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
        <SidebarTrigger className="md:hidden" />
        <div className="hidden md:block">
          <Logo />
        </div>
        <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by Tamil, English, or definition..."
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              className="w-full pl-10"
              aria-label="Search words"
            />
        </div>
        <div className="flex items-center gap-2">
            <Button asChild variant="secondary" className="hidden sm:flex">
            <Link href="/submit">
                <PlusCircle className="mr-2 h-4 w-4" />
                Suggest
            </Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Take a Quiz">
                <Link href="/quiz">
                    <Puzzle className="h-5 w-5" />
                </Link>
            </Button>
            {isAdmin && (
                <Button asChild variant="ghost" size="icon" aria-label="Admin Panel">
                    <Link href="/admin">
                        <Shield className="h-5 w-5" />
                    </Link>
                </Button>
            )}
            {loading ? (
                <Skeleton className="h-10 w-10 rounded-full" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.photoURL ?? ''} alt={user.displayName ?? 'User'} />
                                <AvatarFallback>{user.displayName?.charAt(0)?.toUpperCase() ?? 'U'}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName}</p>
                                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>My Contributions</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => signOut()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button onClick={handleSignIn} disabled={isSigningIn}>
                  {isSigningIn ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <LogIn className="mr-2 h-4 w-4" />
                  )}
                  {isSigningIn ? 'Logging in...' : 'Login'}
                </Button>
            )}
        </div>
    </header>
  );
}
