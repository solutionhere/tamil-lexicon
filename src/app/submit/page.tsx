import { WordForm } from '@/components/submission-form';
import { categories, locations } from '@/lib/data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { submitWord } from './actions';

export default function SubmitPage() {
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
        <WordForm 
            categories={categories} 
            locations={locations} 
            formAction={submitWord}
            submitButtonText="Submit for Review"
        />
      </div>
    </div>
  );
}
