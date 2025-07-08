"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Word, Category, Location } from '@/lib/types';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { LexiconHeader } from '@/components/layout/lexicon-header';
import { LexiconSidebar } from '@/components/layout/lexicon-sidebar';
import { WordList } from '@/components/word-list';
import { WordDetail } from '@/components/word-detail';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-provider';


interface LexiconShellProps {
  words: Word[];
  categories: Category[];
  locations: Location[];
}

const SEARCH_LIMIT = 3;

type Usage = {
  count: number;
  date: string; // YYYY-MM-DD
};

export function LexiconShell({ words, categories, locations }: LexiconShellProps) {
  const { user, signInWithGoogle } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(words[0] || null);
  
  const [usage, setUsage] = useState<Usage>({ count: 0, date: '' });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // This runs only on the client, after hydration
    if (user) return; // Don't track usage for logged-in users

    const today = new Date().toISOString().split('T')[0];
    let storedUsage: Usage;

    try {
        const item = localStorage.getItem('lexiconUsage');
        storedUsage = item ? JSON.parse(item) : { count: 0, date: today };

        if (storedUsage.date !== today) {
            // It's a new day, reset the count
            storedUsage = { count: 0, date: today };
            localStorage.setItem('lexiconUsage', JSON.stringify(storedUsage));
        }
    } catch (error) {
        // If parsing fails, reset to default
        storedUsage = { count: 0, date: today };
    }
    
    setUsage(storedUsage);
  }, [user]); // Rerun if user logs in/out


  const filteredWords = useMemo(() => {
    return words.filter(word => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        word.tamil.toLowerCase().includes(searchLower) ||
        word.transliteration.toLowerCase().includes(searchLower) ||
        word.definition.toLowerCase().includes(searchLower);

      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(word.category);
      
      const locationHierarchy = [selectedLocation];
      if (selectedLocation) {
        const children = locations.filter(l => l.parent === selectedLocation).map(l => l.id);
        locationHierarchy.push(...children);
      }

      const matchesLocation =
        !selectedLocation || locationHierarchy.includes(word.location);

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [searchQuery, selectedCategories, selectedLocation, words, locations]);
  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleWordSelect = (word: Word) => {
    // If the user is logged in, they have unlimited access.
    if (user) {
      setSelectedWord(word);
      return;
    }

    // if same word is clicked, just make sure it's selected and do nothing else.
    if (word.id === selectedWord?.id) {
        setSelectedWord(word);
        return;
    }

    // For guests, check the usage count when selecting a NEW word.
    if (usage.count >= SEARCH_LIMIT) {
      setShowLoginPrompt(true);
    } else {
      const newUsage = { ...usage, count: usage.count + 1 };
      setUsage(newUsage);
      try {
        localStorage.setItem('lexiconUsage', JSON.stringify(newUsage));
      } catch (error) {
        console.error("Could not write to localStorage", error);
      }
      setSelectedWord(word);
    }
  };
  
  const handleLogin = async () => {
    await signInWithGoogle();
    setShowLoginPrompt(false);
  }

  return (
    <SidebarProvider>
      <Sidebar>
          <LexiconSidebar
            categories={categories}
            locations={locations}
            selectedCategories={selectedCategories}
            onCategoryToggle={handleCategoryToggle}
            selectedLocation={selectedLocation}
            onLocationChange={setSelectedLocation}
          />
        </Sidebar>
        <SidebarInset>
          <div className="flex h-screen flex-col">
            <LexiconHeader searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
            <main className="grid flex-1 overflow-hidden md:grid-cols-[40%_60%] lg:grid-cols-[35%_65%]">
              <div className="overflow-y-auto border-r border-border">
                <WordList
                  words={filteredWords}
                  selectedWord={selectedWord}
                  onWordSelect={handleWordSelect}
                />
              </div>
              <div className="hidden overflow-y-auto bg-card md:block">
                 <WordDetail word={selectedWord} categories={categories} locations={locations} />
              </div>
            </main>
          </div>
        </SidebarInset>

        <AlertDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>You've reached your daily limit</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can view up to {SEARCH_LIMIT} word definitions per day as a guest. Please log in with Google for unlimited access.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button onClick={handleLogin}>
                            Login with Google
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </SidebarProvider>
  );
}
