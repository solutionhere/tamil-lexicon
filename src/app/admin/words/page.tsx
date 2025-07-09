'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { words, categories, locations } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, PlusCircle, Edit, Trash2, Ban, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';

const WordTable = ({ words, categories, locations }) => {
    if (words.length === 0) {
        return <p className="py-10 text-center text-muted-foreground">No words in this category.</p>;
    }

    return (
        <Table>
            <TableHeader>
            <TableRow>
                <TableHead>Tamil Word</TableHead>
                <TableHead>Transliteration</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
            </TableRow>
            </TableHeader>
            <TableBody>
            {words.map(word => {
                const category = categories.find(c => c.id === word.category);
                const getBadgeVariant = () => {
                    if (word.isFlagged) return 'destructive';
                    if (word.status === 'published') return 'default';
                    return 'secondary';
                };
                return (
                <TableRow key={word.id}>
                    <TableCell className="font-semibold">{word.tamil}</TableCell>
                    <TableCell>{word.transliteration}</TableCell>
                    <TableCell>
                      {category && <Badge variant="outline">{category.name}</Badge>}
                    </TableCell>
                    <TableCell>
                        <Badge 
                            variant={getBadgeVariant()}
                            className="capitalize"
                        >
                            {word.isFlagged ? 'Flagged' : word.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                        {word.status === 'pending' && (
                            <>
                            <Button variant="ghost" size="icon" title="Approve (coming soon)" disabled>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="sr-only">Approve Word</span>
                            </Button>
                            <Button variant="ghost" size="icon" title="Reject (coming soon)" disabled>
                                <XCircle className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Reject Word</span>
                            </Button>
                            </>
                        )}
                       <Button variant="ghost" size="icon" title="Edit (coming soon)" disabled>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit Word</span>
                        </Button>
                        <Button variant="ghost" size="icon" title="Delete (coming soon)" disabled>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete Word</span>
                        </Button>
                    </TableCell>
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
    );
};

export default function ManageWordsPage() {
  const { isAdmin, loading } = useAuth();
  
  const [tab, setTab] = useState('all');

  const filteredWords = React.useMemo(() => {
    switch (tab) {
        case 'published':
            return words.filter(w => w.status === 'published' && !w.isFlagged);
        case 'pending':
            return words.filter(w => w.status === 'pending');
        case 'flagged':
            return words.filter(w => w.isFlagged);
        case 'all':
        default:
            return words;
    }
  }, [tab]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
          <Skeleton className="h-10 w-36 mb-8" />
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full max-w-md" />
              </CardHeader>
              <CardContent className="pt-6">
                  <Skeleton className="h-64 w-full" />
              </CardContent>
          </Card>
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
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-4 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
           <Button variant="default" asChild>
            <Link href="/admin/words/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Word
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Words</CardTitle>
            <CardDescription>
              View, approve, edit, and add words to the lexicon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All ({words.length})</TabsTrigger>
                <TabsTrigger value="published">Published ({words.filter(w => w.status === 'published' && !w.isFlagged).length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({words.filter(w => w.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="flagged">Flagged ({words.filter(w => w.isFlagged).length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <WordTable words={filteredWords} categories={categories} locations={locations} />
              </TabsContent>
              <TabsContent value="published" className="mt-4">
                 <WordTable words={filteredWords} categories={categories} locations={locations} />
              </TabsContent>
              <TabsContent value="pending" className="mt-4">
                 <WordTable words={filteredWords} categories={categories} locations={locations} />
              </TabsContent>
              <TabsContent value="flagged" className="mt-4">
                 <WordTable words={filteredWords} categories={categories} locations={locations} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
