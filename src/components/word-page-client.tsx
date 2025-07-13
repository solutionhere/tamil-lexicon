
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WordDetail } from '@/components/word-detail';
import type { Word, Category, Location } from '@/lib/types';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function WordPageClient() {
    const params = useParams();
    const slug = params.slug as string;
    
    const [word, setWord] = useState<Word | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [relatedWords, setRelatedWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;

        const getWordData = async (slug: string) => {
            setLoading(true);
            setError(null);
            try {
                const lowercaseSlug = slug.toLowerCase();
                const q = query(collection(db, 'words'), where('slug', '==', lowercaseSlug), limit(1));
                const wordsSnapshot = await getDocs(q);

                let fetchedWord: Word | null = null;
                if (!wordsSnapshot.empty) {
                    const wordDoc = wordsSnapshot.docs[0];
                    fetchedWord = { id: wordDoc.id, ...wordDoc.data() } as Word;
                }
                
                setWord(fetchedWord);

                if (fetchedWord) {
                    const categoriesQuery = collection(db, 'categories');
                    const locationsQuery = collection(db, 'locations');
                    const [categoriesSnapshot, locationsSnapshot] = await Promise.all([
                        getDocs(categoriesQuery),
                        getDocs(locationsQuery),
                    ]);
                    
                    setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[]);
                    setLocations(locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[]);

                    if (fetchedWord.tags && fetchedWord.tags.length > 0) {
                        const relatedWordsQuery = query(
                            collection(db, 'words'), 
                            where('tags', 'array-contains-any', fetchedWord.tags),
                            where('status', '==', 'published'),
                            where('__name__', '!=', fetchedWord.id),
                            limit(5)
                        );
                        const relatedWordsSnapshot = await getDocs(relatedWordsQuery);
                        setRelatedWords(relatedWordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Word)));
                    }
                }
            } catch (e) {
                console.error("Error fetching word data:", e);
                setError("Failed to load the word. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        getWordData(slug);
    }, [slug]);

    if (loading) {
        return (
            <div className="container mx-auto max-w-4xl px-4 py-12">
                 <div className="mb-4"><Skeleton className="h-8 w-36" /></div>
                 <div className="p-6 lg:p-8"><Skeleton className="h-[500px] w-full" /></div>
            </div>
        );
    }

    if (error) {
         return (
            <div className="container mx-auto max-w-4xl px-4 py-12">
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
         );
    }

    if (!word) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                 <div className="container mx-auto max-w-md px-4 py-12 text-center">
                    <Card>
                        <CardHeader>
                            <CardTitle>404 - Word Not Found</CardTitle>
                            <CardDescription>The word you are looking for does not exist.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild>
                                <Link href="/">Back to Lexicon</Link>
                            </Button>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-4xl px-4 py-12">
                 <div className="mb-4">
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Lexicon
                        </Link>
                    </Button>
                </div>
                <WordDetail word={word} categories={categories} locations={locations} relatedWords={relatedWords} />
            </div>
        </div>
    );
}
