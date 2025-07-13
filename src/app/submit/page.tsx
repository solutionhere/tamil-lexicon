
'use client';

import { WordForm } from '@/components/submission-form';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { submitWord } from './actions';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import type { Category, Location } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

export default function SubmitPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getFormData() {
      try {
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const locationsSnapshot = await getDocs(collection(db, 'locations'));

        setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
        setLocations(locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[]);
      } catch (error) {
        console.error("Error fetching form data:", error);
      } finally {
        setLoading(false);
      }
    }
    getFormData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-2">
            <Button variant="ghost" asChild>
                <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Lexicon
                </Link>
            </Button>
        </div>
        <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold text-primary">Suggest a New Word</h1>
            <p className="mt-2 text-muted-foreground">Help us grow the lexicon! Your suggestions will be reviewed by our team.</p>
        </div>
        {loading ? (
            <Card><CardContent className="p-6 space-y-6"><Skeleton className="h-64 w-full" /></CardContent><CardFooter><Skeleton className="h-10 w-full" /></CardFooter></Card>
        ) : (
            <WordForm 
                categories={categories} 
                locations={locations} 
                formAction={submitWord}
                submitButtonText="Submit for Review"
            />
        )}
      </div>
    </div>
  );
}
