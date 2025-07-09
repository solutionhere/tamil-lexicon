'use client';

import React, { useState, useEffect, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import type { Word, Category } from '@/lib/types';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { approveWordAction, rejectWordAction, deleteWordAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, PlusCircle, Edit, Trash2, Ban, CheckCircle, XCircle, Loader2, Eye } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';


// Button component with pending state for form actions
function ActionButton({
  icon: Icon,
  text,
  pendingText,
  className = '',
}: {
  icon: React.ElementType;
  text: string;
  pendingText: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button variant="ghost" size="icon" type="submit" disabled={pending} title={text}>
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className={`h-4 w-4 ${className}`} />}
      <span className="sr-only">{pending ? pendingText : text}</span>
    </Button>
  );
}

const WordActionCell = ({ word, onActionComplete }: { word: Word; onActionComplete: () => void }) => {
  const { toast } = useToast();

  const handleAction = async (actionFn: (prevState: any, formData: FormData) => Promise<any>, formData: FormData) => {
    const result = await actionFn({ message: '', success: false }, formData);
    toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
    });
    if (result.success) {
        onActionComplete();
    }
  };

  const [approveState, approveFormAction] = useActionState(async (p, f) => handleAction(approveWordAction, f), null);
  const [rejectState, rejectFormAction] = useActionState(async (p, f) => handleAction(rejectWordAction, f), null);
  const [deleteState, deleteFormAction] = useActionState(async (p, f) => handleAction(deleteWordAction, f), null);

  return (
    <TableCell className="text-right">
      <div className="flex items-center justify-end gap-1">
        <Button variant="ghost" size="icon" asChild title="View Word Page" >
            <Link href={`/word/${word.transliteration}`} target="_blank">
              <Eye className="h-4 w-4" />
              <span className="sr-only">View Word</span>
            </Link>
        </Button>
        {word.status === 'pending' && (
          <>
            <form action={approveFormAction}><input type="hidden" name="wordId" value={word.id} /><ActionButton icon={CheckCircle} text="Approve Word" pendingText="Approving..." className="text-green-600" /></form>
            <form action={rejectFormAction}><input type="hidden" name="wordId" value={word.id} /><ActionButton icon={XCircle} text="Reject Word" pendingText="Rejecting..." className="text-destructive" /></form>
          </>
        )}
        <Button variant="ghost" size="icon" asChild title="Edit Word"><Link href={`/admin/words/${word.id}/edit`}><Edit className="h-4 w-4" /><span className="sr-only">Edit Word</span></Link></Button>
        <form action={deleteFormAction}><input type="hidden" name="wordId" value={word.id} /><ActionButton icon={Trash2} text="Delete Word" pendingText="Deleting..." className="text-destructive" /></form>
      </div>
    </TableCell>
  );
};


const WordTable = ({ words, categories, onActionComplete }: { words: Word[], categories: Category[], onActionComplete: () => void }) => {
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
                    <TableCell>{category && <Badge variant="outline">{category.name}</Badge>}</TableCell>
                    <TableCell><Badge variant={getBadgeVariant()} className="capitalize">{word.isFlagged ? 'Flagged' : word.status}</Badge></TableCell>
                    <WordActionCell word={word} onActionComplete={onActionComplete} />
                </TableRow>
                );
            })}
            </TableBody>
        </Table>
    );
};

export default function ManageWordsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [words, setWords] = useState<Word[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [isPending, startTransition] = useTransition();

  const fetchData = React.useCallback(() => {
    startTransition(async () => {
        setLoading(true);
        const wordsQuery = query(collection(db, "words"), orderBy('createdAt', 'desc'));
        const categoriesQuery = query(collection(db, "categories"));
        const [wordsSnapshot, categoriesSnapshot] = await Promise.all([getDocs(wordsQuery), getDocs(categoriesQuery)]);
        
        const fetchedWords = wordsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                // Convert Firestore Timestamp to plain object if needed, otherwise it's fine
                createdAt: data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt),
            } as Word;
        });
        
        setWords(fetchedWords);
        setCategories(categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category)));
        setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredWords = React.useMemo(() => {
    switch (tab) {
        case 'published': return words.filter(w => w.status === 'published' && !w.isFlagged);
        case 'pending': return words.filter(w => w.status === 'pending');
        case 'flagged': return words.filter(w => w.isFlagged);
        case 'all': default: return words;
    }
  }, [tab, words]);

  if (authLoading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
          <Skeleton className="h-10 w-36 mb-8" />
          <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent className="pt-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto max-w-md px-4 py-12 text-center"><Card><CardHeader className="items-center"><div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2"><Ban className="h-8 w-8 text-destructive" /></div><CardTitle>Access Denied</CardTitle><CardDescription>You do not have permission to view this page.</CardDescription></CardHeader><CardContent><Button asChild><Link href="/">Back to Lexicon</Link></Button></CardContent></Card></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="mb-4 flex justify-between items-center"><Button variant="ghost" asChild><Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin</Link></Button><Button variant="default" asChild><Link href="/admin/words/add"><PlusCircle className="mr-2 h-4 w-4" />Add Word</Link></Button></div>
        <Card>
          <CardHeader><CardTitle>Manage Words</CardTitle><CardDescription>View, approve, edit, and add words to the lexicon.</CardDescription></CardHeader>
          <CardContent>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All ({words.length})</TabsTrigger>
                <TabsTrigger value="published">Published ({words.filter(w => w.status === 'published' && !w.isFlagged).length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({words.filter(w => w.status === 'pending').length})</TabsTrigger>
                <TabsTrigger value="flagged">Flagged ({words.filter(w => w.isFlagged).length})</TabsTrigger>
              </TabsList>
              <div className="mt-4">
                {loading || isPending ? <div className="py-10 text-center">Loading words...</div> : <WordTable words={filteredWords} categories={categories} onActionComplete={fetchData} />}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
