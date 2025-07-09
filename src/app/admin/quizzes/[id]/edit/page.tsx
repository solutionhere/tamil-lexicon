'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { QuizCreationForm } from '@/components/quiz-creation-form';
import { updateQuizAction } from '../../actions';
import type { QuizCreationData } from '../../actions';
import type { Quiz } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function EditQuizPage({ params }: { params: { id: string } }) {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            const quizDoc = await getDoc(doc(db, 'quizzes', params.id));
            if (quizDoc.exists()) {
                setQuiz({ id: quizDoc.id, ...quizDoc.data() } as Quiz);
            }
            setLoading(false);
        };
        fetchQuiz();
    }, [params.id]);
    
    if (loading) {
        return (
          <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto max-w-2xl px-4 py-12"><Skeleton className="h-10 w-36 mb-8" /><Skeleton className="h-96 w-full" /></div>
          </div>
        );
    }

    if (!quiz) {
        notFound();
    }
    
    const updateActionWithId = (data: QuizCreationData) => {
        return updateQuizAction({ ...data, quizId: quiz.id });
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-3xl px-4 py-12">
                <div className="mb-4"><Button variant="ghost" asChild><Link href="/admin/quizzes"><ArrowLeft className="mr-2 h-4 w-4" />Back to Quizzes</Link></Button></div>
                 <div className="mb-8 text-center"><h1 className="font-headline text-4xl font-bold text-primary">Edit Quiz</h1><p className="mt-2 text-muted-foreground">Update the details for "{quiz.title}".</p></div>
                <QuizCreationForm 
                    formAction={updateActionWithId} 
                    initialData={quiz}
                    submitButtonText="Update Quiz"
                />
            </div>
        </div>
    );
}
