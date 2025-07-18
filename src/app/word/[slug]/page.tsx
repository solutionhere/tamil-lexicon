import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WordDetail } from '@/components/word-detail';
import type { Word, Category, Location } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

async function getWordData(slug: string) {
    const wordsQuery = query(collection(db, 'words'), where('transliteration', '==', slug), limit(1));
    const categoriesQuery = collection(db, 'categories');
    const locationsQuery = collection(db, 'locations');

    const [wordsSnapshot, categoriesSnapshot, locationsSnapshot] = await Promise.all([
        getDocs(wordsQuery),
        getDocs(categoriesQuery),
        getDocs(locationsQuery),
    ]);

    const word = wordsSnapshot.empty ? null : { id: wordsSnapshot.docs[0].id, ...wordsSnapshot.docs[0].data() } as Word;
    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
    const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];

    return { word, categories, locations };
}

// Generate static pages for each word at build time for better SEO
export async function generateStaticParams() {
  const wordsSnapshot = await getDocs(query(collection(db, 'words'), where('status', '==', 'published')));
  return wordsSnapshot.docs.map(doc => ({
    slug: doc.data().transliteration,
  }));
}

// Generate dynamic metadata for each page for better SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { word } = await getWordData(decodeURIComponent(params.slug));

  if (!word) {
    return {
      title: 'Word not found - Tamil Lexicon',
    };
  }

  return {
    title: `${word.tamil} (${word.transliteration}) - Tamil Lexicon`,
    description: word.definition,
    keywords: [word.tamil, word.transliteration, 'tamil slang', 'tamil lexicon'],
  };
}

export default async function WordPage({ params }: { params: { slug: string } }) {
  const { word, categories, locations } = await getWordData(decodeURIComponent(params.slug));

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
            <WordDetail word={word} categories={categories} locations={locations} />
        </div>
    </div>
  );
}
