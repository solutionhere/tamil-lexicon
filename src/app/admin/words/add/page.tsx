'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Ban } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { WordForm } from '@/components/submission-form';
import { categories, locations } from '@/lib/data';
import { addWordAction } from '../actions';

export default function AddWordPage() {
    const { isAdmin, loading } = useAuth();

    if (loading) {
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <Skeleton className="h-10 w-36 mb-8" />
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-full max-w-md" />
                    </CardHeader>
                    <CardContent className="pt-6">
                        <Skeleton className="h-48 w-full" />
                    </CardContent>
                </Card>
            </div>
          </div>
        );
    }
    
    if (!isAdmin) {
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto max-w-md px-4 py-12 text-center">
                <Card>
                    <CardHeader className="items-center">
                        <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
                            <Ban className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>You do not have permission to view this page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/">Back to Lexicon</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
          </div>
        );
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
