'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Quiz } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { QuizPlayer } from '@/components/quiz-player';
import { useAuth } from '@/context/auth-provider';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';


export default function QuizPage() {
  const { user, loading: authLoading } = useAuth();
  const [quizStarted, setQuizStarted] = useState(false);
  const [liveQuiz, setLiveQuiz] = useState<Quiz | null | undefined>(undefined);

  useEffect(() => {
    const fetchLiveQuiz = async () => {
        const q = query(collection(db, 'quizzes'), where('status', '==', 'live'), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) {
            setLiveQuiz(null);
        } else {
            const doc = snapshot.docs[0];
            setLiveQuiz({ id: doc.id, ...doc.data() } as Quiz);
        }
    };
    fetchLiveQuiz();
  }, []);

  const isLoading = authLoading || liveQuiz === undefined;

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
             <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
                <Card>
                    <CardHeader><Skeleton className="h-8 w-48 mx-auto" /><Skeleton className="h-4 w-full max-w-md mx-auto mt-2" /></CardHeader>
                    <CardContent><Skeleton className="h-12 w-32 mx-auto" /></CardContent>
                </Card>
            </div>
        </div>
    );
  }
  
  if (!user) {
    return (
     <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
        <Card><CardHeader><CardTitle>Login Required</CardTitle><CardDescription>You must be logged in to participate in quizzes.</CardDescription></CardHeader><CardContent className="flex flex-col items-center gap-4"><Button asChild><Link href="/">Back to Lexicon</Link></Button></CardContent></Card>
      </div>
      </div>
    );
  }

  if (!liveQuiz) {
    return (
       <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
                <div className="mb-2 text-left"><Button variant="ghost" asChild><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Lexicon</Link></Button></div>
                <Card><CardHeader><CardTitle>No Live Quiz</CardTitle><CardDescription>There isn't a quiz running right now. Please check back later!</CardDescription></CardHeader></Card>
            </div>
       </div>
    );
  }

  if (!quizStarted) {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="container mx-auto max-w-2xl px-4 py-12 text-center">
                <div className="mb-2 text-left"><Button variant="ghost" asChild><Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Lexicon</Link></Button></div>
                <Card><CardHeader><CardTitle className="text-primary">{liveQuiz.title}</CardTitle><CardDescription>Ready to test your knowledge? This quiz has {liveQuiz.questions.length} questions.</CardDescription></CardHeader><CardContent><Button size="lg" onClick={() => setQuizStarted(true)}>Start Quiz</Button></CardContent></Card>
            </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="container mx-auto max-w-2xl">
            <QuizPlayer quiz={liveQuiz} user={user} />
        </div>
    </div>
  );
}
