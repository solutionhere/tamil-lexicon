
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WordDetail } from '@/components/word-detail';
import type { Word, Category, Location } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit, DocumentData } from 'firebase/firestore';

async function getWordData(slug: string) {
    const lowercaseSlug = slug.toLowerCase();
    
    // Primary query against the reliable, lowercase 'slug' field.
    const q = query(collection(db, 'words'), where('slug', '==', lowercaseSlug), limit(1));
    const wordsSnapshot = await getDocs(q);
    
    const wordDoc = wordsSnapshot.docs[0];
    if (!wordDoc) return { word: null, categories: [], locations: [], relatedWords: [] };
    
    const word = { id: wordDoc.id, ...wordDoc.data() } as Word;

    const categoriesQuery = collection(db, 'categories');
    const locationsQuery = collection(db, 'locations');

    const [categoriesSnapshot, locationsSnapshot] = await Promise.all([
        getDocs(categoriesQuery),
        getDocs(locationsQuery),
    ]);
    
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
    const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];
    
    let relatedWords: Word[] = [];
    if (word?.tags && word.tags.length > 0) {
        const relatedWordsQuery = query(
            collection(db, 'words'), 
            where('tags', 'array-contains-any', word.tags),
            where('status', '==', 'published'),
            where('__name__', '!=', word.id), // Use __name__ to compare document IDs
            limit(5)
        );
        const relatedWordsSnapshot = await getDocs(relatedWordsQuery);
        relatedWords = relatedWordsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Word));
    }


    return { word, categories, locations, relatedWords };
}

// Generate dynamic metadata for each page for better SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { word } = await getWordData(params.slug);

  if (!word) {
    return {
      title: 'Word not found - Tamil Lexicon',
    };
  }

  return {
    title: `${word.tamil} (${word.transliteration}) - Tamil Lexicon`,
    description: word.definition,
    keywords: [word.tamil, word.transliteration, ...(word.tags || []), 'tamil slang', 'tamil lexicon'],
  };
}

export default async function WordPage({ params }: { params: { slug: string } }) {
  const { word, categories, locations, relatedWords } = await getWordData(params.slug);

  if (!word) {
    notFound();
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
