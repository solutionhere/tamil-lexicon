import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { WordForm } from '@/components/submission-form';
import type { Category, Location } from '@/lib/types';
import { addWordAction } from '../actions';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

async function getFormData() {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));
    const locationsSnapshot = await getDocs(collection(db, 'locations'));

    const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
    const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];
    
    return { categories, locations };
}

export default async function AddWordPage() {
    const { categories, locations } = await getFormData();

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
                    <h1 className="font-headline text-4xl font-bold text-primary">Add a New Word</h1>
                    <p className="mt-2 text-muted-foreground">Directly add a new word to the lexicon. It will be published immediately.</p>
                </div>
                <WordForm
                  categories={categories}
                  locations={locations}
                  formAction={addWordAction}
                  submitButtonText="Add and Publish Word"
                />
            </div>
        </div>
    );
}
