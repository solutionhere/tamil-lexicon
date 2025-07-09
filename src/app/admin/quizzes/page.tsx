'use client';

import React, { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { quizzes } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, PlusCircle, Edit, Trash2, Ban, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { deleteQuizAction } from './actions';

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="ghost" size="icon" type="submit" disabled={pending} title="Delete Quiz">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      <span className="sr-only">Delete Quiz</span>
    </Button>
  );
}

const QuizActionCell = ({ quizId }: { quizId: string }) => {
  const { toast } = useToast();
  const [state, formAction] = useActionState(deleteQuizAction, { success: false });

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
  }, [state, toast]);

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" asChild title="Edit Quiz">
        <Link href={`/admin/quizzes/${quizId}/edit`}>
          <Edit className="h-4 w-4" />
          <span className="sr-only">Edit Quiz</span>
        </Link>
      </Button>
      <form action={formAction}>
        <input type="hidden" name="quizId" value={quizId} />
        <DeleteButton />
      </form>
    </div>
  );
};

export default function AdminQuizzesPage() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 py-12">
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
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-4 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
           <Button variant="default" asChild>
            <Link href="/admin/quizzes/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Quiz
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Quizzes</CardTitle>
            <CardDescription>
              Create, edit, and schedule quizzes for the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {quizzes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Questions</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quizzes.map(quiz => (
                      <TableRow key={quiz.id}>
                        <TableCell className="font-semibold">{quiz.title}</TableCell>
                        <TableCell>{quiz.questions.length}</TableCell>
                        <TableCell>
                            <Badge 
                                variant={quiz.status === 'live' ? 'default' : (quiz.status === 'completed' ? 'secondary' : 'outline')} 
                                className="capitalize"
                            >
                                {quiz.status}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <QuizActionCell quizId={quiz.id} />
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-semibold">No Quizzes Found</h3>
                <p className="mt-2 text-muted-foreground">Get started by creating a new quiz.</p>
                 <Button asChild className="mt-4">
                    <Link href="/admin/quizzes/create">Create Quiz</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
