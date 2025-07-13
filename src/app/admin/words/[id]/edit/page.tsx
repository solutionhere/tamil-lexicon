'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { WordForm } from '@/components/submission-form';
import type { Category, Location, Word } from '@/lib/types';
import { updateWordAction } from '../../actions';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

async function getEditData(id: string) {
    const wordRef = doc(db, 'words', id);
    const categoriesQuery = collection(db, 'categories');
    const locationsQuery = collection(db, 'locations');

    const [wordDoc, categoriesSnapshot, locationsSnapshot] = await Promise.all([
        getDoc(wordRef),
        getDocs(categoriesQuery),
        getDocs(locationsQuery),
    ]);

    const word = wordDoc.exists() ? { id: wordDoc.id, ...wordDoc.data() } as Word : null;
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
    const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];

    return { word, categories, locations };
}

export default function EditWordPage({ params }: { params: { id:string } }) {
  const [data, setData] = useState<{ word: Word | null; categories: Category[]; locations: Location[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEditData(params.id).then(fetchedData => {
        setData(fetchedData);
        setLoading(false);
    });
  }, [params.id]);

  if (loading) {
      return (
        <div>
            <Skeleton className="h-10 w-48 mb-8" />
            <Skeleton className="h-96 w-full" />
        </div>
      );
  }
  
  if (!data || !data.word) {
    notFound();
  }
  
  const { word, categories, locations } = data;

  return (
    <div>
      <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary">Edit Word</h1>
          <p className="mt-2 text-muted-foreground">Update the details for "{word.transliteration}".</p>
      </div>
      <WordForm
        categories={categories}
        locations={locations}
        formAction={updateWordAction}
        initialData={{...word, tamilWord: word.tamil, exampleTamil: word.example.tamil, exampleEnglish: word.example.english }}
        submitButtonText="Update Word"
      />
    </div>
  );
}
