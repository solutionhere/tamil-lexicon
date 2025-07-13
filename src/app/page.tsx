'use client';

import { LexiconShell } from '@/components/lexicon-shell';
import type { Word, Category, Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLexiconData() {
      try {
        const wordsQuery = query(collection(db, 'words'), where('status', '==', 'published'));
        const categoriesQuery = query(collection(db, 'categories'));
        const locationsQuery = query(collection(db, 'locations'));

        const [wordsSnapshot, categoriesSnapshot, locationsSnapshot] = await Promise.all([
          getDocs(wordsQuery),
          getDocs(categoriesQuery),
          getDocs(locationsQuery),
        ]);

        const fetchedWords = wordsSnapshot.docs.map(doc => {
          const data = doc.data();
          const createdAt = (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString();
          return { 
              id: doc.id, 
              ...data,
              createdAt,
          } as Word;
        });

        const fetchedCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        const fetchedLocations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];
        
        setWords(fetchedWords);
        setCategories(fetchedCategories);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching lexicon data:", error);
      } finally {
        setLoading(false);
      }
    }
    getLexiconData();
  }, []);

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="flex items-center gap-2 text-lg">
                <Skeleton className="h-10 w-10 rounded-full" />
                <p>Loading Lexicon...</p>
            </div>
        </div>
    )
  }

  return (
    <LexiconShell
      words={words}
      categories={categories}
      locations={locations}
    />
  );
}
