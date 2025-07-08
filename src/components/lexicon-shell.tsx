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


interface LexiconShellProps {
  words: Word[];
  categories: Category[];
  locations: Location[];
}

const SEARCH_LIMIT = 3;

export function LexiconShell({ words, categories, locations }: LexiconShellProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(words[0] || null);

  const [searchCount, setSearchCount] = useState(0);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    // This runs only on the client, after hydration
    const storedCount = localStorage.getItem('lexiconSearchCount');
    if (storedCount) {
      setSearchCount(parseInt(storedCount, 10));
    }
  }, []);


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
    // In a real app, you would check if the user is authenticated.
    // For this demo, we'll check the count for any user.
    if (searchCount >= SEARCH_LIMIT) {
      setShowLoginPrompt(true);
    } else {
      const newCount = searchCount + 1;
      setSearchCount(newCount);
      localStorage.setItem('lexiconSearchCount', newCount.toString());
      setSelectedWord(word);
    }
  };

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
                    <AlertDialogTitle>You've reached your search limit</AlertDialogTitle>
                    <AlertDialogDescription>
                        You can view up to {SEARCH_LIMIT} word definitions as a guest. Please log in with Google to continue exploring the lexicon.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        {/* In a real app, this would trigger the Google Sign-In flow */}
                        <Button onClick={() => console.log('Login with Google clicked')}>
                            Login with Google
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </SidebarProvider>
  );
}
