'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { WordForm } from '@/components/submission-form';
import { categories, locations, words } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { updateWordAction } from '../../actions';

export default function EditWordPage({ params }: { params: { id: string } }) {
  const word = words.find(w => w.id === params.id);

  if (!word) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="mb-2">
            <Button variant="ghost" asChild>
                <Link href="/admin/words">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Manage Words
                </Link>
            </Button>
        </div>
        <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold text-primary">Edit Word</h1>
            <p className="mt-2 text-muted-foreground">Update the details for "{word.transliteration}".</p>
        </div>
        <WordForm
          categories={categories}
          locations={locations}
          formAction={updateWordAction}
          initialData={word}
          submitButtonText="Update Word"
        />
      </div>
    </div>
  );
}
