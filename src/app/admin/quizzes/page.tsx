'use client';

import React, { useActionState, useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import type { Quiz } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Ban, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { deleteQuizAction } from './actions';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="ghost" size="icon" type="submit" disabled={pending} title="Delete Quiz">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      <span className="sr-only">Delete Quiz</span>
    </Button>
  );
}

const QuizActionCell = ({ quizId, onActionComplete }: { quizId: string, onActionComplete: () => void }) => {
  const { toast } = useToast();
  
  const handleAction = async (actionFn: (prevState: any, formData: FormData) => Promise<any>, formData: FormData) => {
    const result = await actionFn({ success: false, message: '' }, formData);
    toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
    });
    if (result.success) {
        onActionComplete();
    }
  };

  const [deleteState, deleteFormAction] = useActionState(async (p,f) => handleAction(deleteQuizAction, f), null);

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" asChild title="Edit Quiz"><Link href={`/admin/quizzes/${quizId}/edit`}><Edit className="h-4 w-4" /><span className="sr-only">Edit Quiz</span></Link></Button>
      <form action={deleteFormAction}><input type="hidden" name="quizId" value={quizId} /><DeleteButton /></form>
    </div>
  );
};

export default function AdminQuizzesPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchQuizzes = React.useCallback(() => {
    if (!isAdmin) {
        setLoading(false);
        return;
    };
    startTransition(async () => {
        setLoading(true);
        const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
        setQuizzes(quizzesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Quiz));
        setLoading(false);
    });
  }, [isAdmin]);

  useEffect(() => {
    if (!authLoading) {
      fetchQuizzes();
    }
  }, [authLoading, fetchQuizzes]);


  if (authLoading) {
    return (
      <div className="space-y-4">
        <Card><CardHeader><Skeleton className="h-8 w-48" /><Skeleton className="h-4 w-full max-w-md" /></CardHeader><CardContent className="pt-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Quizzes</CardTitle>
            <CardDescription>Create, edit, and schedule quizzes for the community.</CardDescription>
          </div>
           <Button variant="default" asChild><Link href="/admin/quizzes/create"><PlusCircle className="mr-2 h-4 w-4" />Create Quiz</Link></Button>
        </CardHeader>
        <CardContent>
          {loading || isPending ? <p>Loading quizzes...</p> : quizzes.length > 0 ? (
            <Table>
              <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Questions</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
              <TableBody>
                {quizzes.map(quiz => (
                    <TableRow key={quiz.id}><TableCell className="font-semibold">{quiz.title}</TableCell><TableCell>{quiz.questions.length}</TableCell><TableCell><Badge variant={quiz.status === 'live' ? 'default' : (quiz.status === 'completed' ? 'secondary' : 'outline')} className="capitalize">{quiz.status}</Badge></TableCell><TableCell className="text-right"><QuizActionCell quizId={quiz.id} onActionComplete={fetchQuizzes} /></TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10"><h3 className="text-lg font-semibold">No Quizzes Found</h3><p className="mt-2 text-muted-foreground">Get started by creating a new quiz.</p><Button asChild className="mt-4"><Link href="/admin/quizzes/create">Create Quiz</Link></Button></div>
          )}
        </CardContent>
      </Card>
  );
}
