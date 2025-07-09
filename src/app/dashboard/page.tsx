'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/auth-provider';
import { words, categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  // In a real application with a database, you would fetch contributions for the logged-in user.
  // For this demo, we filter the static data using a placeholder ID to demonstrate the UI.
  // To test this with your own account after submitting a word, you would need to
  // add your Firebase User ID to a word in the `src/lib/data.ts` file.
  const userContributions = words.filter(
    // In a real app, you'd use: word.submittedBy === user?.uid
    (word) => word.submittedBy === 'SAMPLE_USER_ID'
  );

  if (loading) {
    return (
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Skeleton className="h-8 w-36 mb-4" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 py-12 text-center">
            <Card className="max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>Please log in to view your contributions.</CardDescription>
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
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lexicon
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>My Contributions</CardTitle>
            <CardDescription>
              A list of the words you have submitted for review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userContributions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tamil Word</TableHead>
                    <TableHead>Definition</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userContributions.map((word) => {
                    const category = categories.find((c) => c.id === word.category);
                    return (
                      <TableRow key={word.id}>
                        <TableCell className="font-semibold">{word.tamil}</TableCell>
                        <TableCell className="max-w-xs truncate">{word.definition}</TableCell>
                        <TableCell>
                          {category && <Badge variant="outline">{category.name}</Badge>}
                        </TableCell>
                        <TableCell>
                           <Badge variant={word.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                              {word.status}
                           </Badge>
                        </TableCell>
                        <TableCell>
                           <Button variant="ghost" size="icon" disabled>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit Word (coming soon)</span>
                            </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-semibold">No Contributions Yet</h3>
                <p className="mt-2 text-muted-foreground">You haven't submitted any words. Help us grow the lexicon!</p>
                 <Button asChild className="mt-4">
                    <Link href="/submit">Suggest a Word</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
