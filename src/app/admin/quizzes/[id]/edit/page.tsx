'use client';

import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Ban } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { QuizCreationForm } from '@/components/quiz-creation-form';
import { updateQuizAction } from '../../actions';
import type { QuizCreationData } from '../../actions';
import { quizzes } from '@/lib/data';

export default function EditQuizPage({ params }: { params: { id: string } }) {
    const { isAdmin, loading } = useAuth();
    const resolvedParams = React.use(params);
    const quiz = quizzes.find(q => q.id === resolvedParams.id);

    if (!quiz) {
        notFound();
    }
    
    // Wrapper action to include the quizId with the form data
    const updateActionWithId = (data: QuizCreationData) => {
        return updateQuizAction({ ...data, quizId: quiz.id });
    };

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
            <div className="container mx-auto max-w-3xl px-4 py-12">
                <div className="mb-4">
                    <Button variant="ghost" asChild>
                        <Link href="/admin/quizzes">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Quizzes
                        </Link>
                    </Button>
                </div>
                 <div className="mb-8 text-center">
                    <h1 className="font-headline text-4xl font-bold text-primary">Edit Quiz</h1>
                    <p className="mt-2 text-muted-foreground">Update the details for "{quiz.title}".</p>
                </div>
                <QuizCreationForm 
                    formAction={updateActionWithId} 
                    initialData={quiz}
                    submitButtonText="Update Quiz"
                />
            </div>
        </div>
    );
}
