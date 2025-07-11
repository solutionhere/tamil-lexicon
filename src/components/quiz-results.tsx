'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { QuizScore, User } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trophy, Award } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';


interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  quizId: string;
  user: User;
}

export function QuizResults({ score, totalQuestions, quizId, user }: QuizResultsProps) {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const [leaderboard, setLeaderboard] = useState<QuizScore[]>([]);
    
    useEffect(() => {
      const processScore = async () => {
        if (!user) return; // Guard against missing user

        try {
            // Save the current user's score
            const newScore: Omit<QuizScore, 'id'> = {
              quizId,
              userId: user.uid,
              userName: user.displayName ?? 'Anonymous',
              score,
              createdAt: new Date(),
            };
            await addDoc(collection(db, 'quizScores'), newScore);
        } catch (error) {
            console.error("Error saving score:", error);
        }

        try {
            // Fetch top 10 scores
            const q = query(
                collection(db, 'quizScores'),
                where('quizId', '==', quizId),
                orderBy('score', 'desc'),
                orderBy('createdAt', 'asc'),
                limit(10)
            );
            const snapshot = await getDocs(q);
            const scores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as QuizScore);
            setLeaderboard(scores);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
      };

      processScore();
    }, [quizId, score, user]);


    return (
        <Card className="w-full">
            <CardHeader className="items-center text-center">
                <Trophy className="h-16 w-16 text-primary" />
                <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
                <CardDescription>You scored</CardDescription>
                <p className="text-5xl font-bold">{score} / {totalQuestions}</p>
                <p className="text-xl text-muted-foreground">({percentage}%)</p>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="mb-4 text-center text-xl font-semibold">Top 10 Scorers</h3>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader><TableRow><TableHead className="w-[50px]">Rank</TableHead><TableHead>Player</TableHead><TableHead className="text-right">Score</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {leaderboard.map((entry, index) => (
                                    <TableRow key={entry.id} className={user && entry.userId === user.uid ? 'bg-primary/10' : ''}>
                                        <TableCell className="font-bold text-lg flex items-center justify-center">
                                            {index === 0 ? <Award className="h-6 w-6 text-yellow-500" /> :
                                            index === 1 ? <Award className="h-6 w-6 text-slate-400" /> :
                                            index === 2 ? <Award className="h-6 w-6 text-yellow-700" /> :
                                            index + 1}
                                        </TableCell>
                                        <TableCell>{entry.userName}</TableCell>
                                        <TableCell className="text-right font-semibold">{entry.score}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
                 <div className="text-center"><Button asChild><Link href="/">Back to Lexicon</Link></Button></div>
            </CardContent>
        </Card>
    );
}
