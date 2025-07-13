'use client';

import { LexiconShell } from '@/components/lexicon-shell';
import type { Category, Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFilterData() {
      try {
        const categoriesQuery = query(collection(db, 'categories'));
        const locationsQuery = query(collection(db, 'locations'));

        const [categoriesSnapshot, locationsSnapshot] = await Promise.all([
          getDocs(categoriesQuery),
          getDocs(locationsQuery),
        ]);

        const fetchedCategories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
        const fetchedLocations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];
        
        setCategories(fetchedCategories);
        setLocations(fetchedLocations);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      } finally {
        setLoading(false);
      }
    }
    getFilterData();
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
      initialWords={[]}
      categories={categories}
      locations={locations}
    />
  );
}
