"use client";
import React from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';

interface LexiconHeaderProps {
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
}

export function LexiconHeader({ searchQuery, onSearchQueryChange }: LexiconHeaderProps) {
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
        <Button asChild variant="secondary">
          <Link href="/submit">
            <PlusCircle className="mr-2 h-4 w-4" />
            Suggest
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" aria-label="Admin Panel">
            <Link href="/admin">
                <Shield className="h-5 w-5" />
            </Link>
        </Button>
    </header>
  );
}
