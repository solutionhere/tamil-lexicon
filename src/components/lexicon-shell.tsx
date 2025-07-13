
'use client';

import React, { useState, useMemo, useEffect, useTransition, useCallback } from 'react';
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
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, orderBy, type Query, type DocumentData, type Timestamp } from 'firebase/firestore';
import { useDebounce } from '@/hooks/use-debounce';

interface LexiconShellProps {
  initialWords: Word[];
  categories: Category[];
  locations: Location[];
}

const SEARCH_LIMIT = 3;

type Usage = {
  count: number;
  date: string; // YYYY-MM-DD
};

export function LexiconShell({ initialWords, categories, locations }: LexiconShellProps) {
  const { user, signInWithGoogle } = useAuth();

  const [words, setWords] = useState<Word[]>(initialWords);
  const [isFetchingWords, startFetchingWords] = useTransition();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  
  const [usage, setUsage] = useState<Usage>({ count: 0, date: '' });
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchWords = useCallback(() => {
    startFetchingWords(async () => {
      let q: Query<DocumentData> = query(collection(db, 'words'), where('status', '==', 'published'));
      
      const hasFilters = debouncedSearchQuery || selectedCategories.length > 0 || selectedLocation;

      if (hasFilters) {
        if (debouncedSearchQuery) {
            const queryLower = debouncedSearchQuery.toLowerCase();
            // This is a simple prefix search. For full-text search, a dedicated service like Algolia or Typesense would be better.
            q = query(q, where('transliteration', '>=', queryLower), where('transliteration', '<=', queryLower + '\uf8ff'), limit(25));
        }
        
        if (selectedCategories.length > 0) {
          q = query(q, where('category', 'in', selectedCategories));
        }
        
        if (selectedLocation) {
          q = query(q, where('location', '==', selectedLocation));
        }
      } else {
        // Default query: Fetch the 50 most recent words if no filters are active.
        q = query(q, orderBy('createdAt', 'desc'), limit(50));
      }


      try {
        const snapshot = await getDocs(q);
        const fetchedWords = snapshot.docs.map(doc => {
           const data = doc.data();
           const createdAt = (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString();
           return {
               id: doc.id,
               ...data,
               createdAt,
           } as Word;
        });
        setWords(fetchedWords);
        if (fetchedWords.length > 0 && !selectedWord) {
            setSelectedWord(fetchedWords[0]);
        } else if (fetchedWords.length === 0) {
            setSelectedWord(null);
        }
      } catch (error) {
        console.error("Error fetching words:", error);
        setWords([]);
        setSelectedWord(null);
      }
    });
  }, [debouncedSearchQuery, selectedCategories, selectedLocation, selectedWord]);

  useEffect(() => {
      fetchWords();
  }, [fetchWords]);


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

  
  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };
  
  const handleWordSelect = (word: Word) => {
    if (user) {
      setSelectedWord(word);
      return;
    }

    if (word.id === selectedWord?.id) {
        setSelectedWord(word);
        return;
    }

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
  
  const relatedWords = useMemo(() => {
    if (!selectedWord || !selectedWord.tags || selectedWord.tags.length === 0) {
        return [];
    }
    return words.filter(word => 
        word.id !== selectedWord.id &&
        word.tags?.some(tag => selectedWord.tags?.includes(tag))
    ).slice(0, 5);
  }, [selectedWord, words]);


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
                  words={words}
                  selectedWord={selectedWord}
                  onWordSelect={handleWordSelect}
                  isLoading={isFetchingWords}
                />
              </div>
              <div className="hidden overflow-y-auto bg-card md:block">
                 <WordDetail word={selectedWord} categories={categories} locations={locations} relatedWords={relatedWords} />
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
