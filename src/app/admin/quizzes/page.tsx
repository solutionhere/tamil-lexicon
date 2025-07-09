import { quizzes } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminQuizzesPage() {
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
                           <Button variant="ghost" size="icon" disabled>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit Quiz (coming soon)</span>
                            </Button>
                            <Button variant="ghost" size="icon" disabled>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete Quiz (coming soon)</span>
                            </Button>
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
