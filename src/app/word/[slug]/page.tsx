import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WordDetail } from '@/components/word-detail';
import { words, categories, locations } from '@/lib/data';
import { ArrowLeft } from 'lucide-react';

interface WordPageProps {
  params: {
    slug: string;
  };
}

// Generate static pages for each word at build time for better SEO
export async function generateStaticParams() {
  const publishedWords = words.filter(word => word.status === 'published');
  return publishedWords.map(word => ({
    slug: word.transliteration,
  }));
}

// Generate dynamic metadata for each page for better SEO
export async function generateMetadata({ params }: WordPageProps): Promise<Metadata> {
  const word = words.find(w => w.transliteration.toLowerCase() === decodeURIComponent(params.slug).toLowerCase());

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

export default function WordPage({ params }: WordPageProps) {
  // Find the word by its transliteration slug, case-insensitively
  const word = words.find(w => w.transliteration.toLowerCase() === decodeURIComponent(params.slug).toLowerCase());

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
