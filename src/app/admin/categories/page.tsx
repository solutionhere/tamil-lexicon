'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { addCategoryAction, deleteCategoryAction } from './actions';
import type { Category } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Ban, Trash2, Tag, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

function AddCategoryButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Tag className="mr-2 h-4 w-4" />}
      Add Category
    </Button>
  );
}

function RemoveCategoryButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="ghost" size="icon" type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
            <span className="sr-only">Remove Category</span>
        </Button>
    );
}

export default function ManageCategoriesPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const addFormRef = useRef<HTMLFormElement>(null);
    
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const fetchCategories = React.useCallback(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        startTransition(async () => {
            setLoading(true);
            const q = query(collection(db, "categories"), orderBy("name"));
            const querySnapshot = await getDocs(q);
            setCategories(querySnapshot.docs.map(doc => doc.data() as Category));
            setLoading(false);
        });
    }, [isAdmin]);

    useEffect(() => {
        if (!authLoading) {
            fetchCategories();
        }
    }, [authLoading, fetchCategories]);
    
    const handleAction = async (actionFn: (prevState: any, formData: FormData) => Promise<any>, formData: FormData) => {
        const result = await actionFn({ success: false, message: '' }, formData);
        toast({
            title: result.success ? 'Success' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
        });
        if (result.success) {
            fetchCategories();
            if (actionFn === addCategoryAction) {
                addFormRef.current?.reset();
            }
        }
    };

    const [addState, addFormAction] = useActionState(async (p,f) => handleAction(addCategoryAction, f), null);
    const [removeState, removeFormAction] = useActionState(async (p,f) => handleAction(deleteCategoryAction, f), null);

    if (authLoading) {
        return <div className="grid gap-8"><Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card></div>;
    }

    return (
        <div className="grid gap-8">
            <Card><CardHeader><CardTitle>Add New Category</CardTitle><CardDescription>Create a new category for organizing words.</CardDescription></CardHeader><form action={addFormAction} ref={addFormRef}><CardContent><Input name="name" placeholder="e.g., Cinema Slang" required /></CardContent><CardFooter><AddCategoryButton /></CardFooter></form></Card>
            <Card>
                <CardHeader><CardTitle>Current Categories</CardTitle><CardDescription>This list shows all available categories.</CardDescription></CardHeader>
                <CardContent>
                    {(loading || isPending) ? <p>Loading...</p> : 
                    <Table className="mt-4">
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>ID</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {categories.map(category => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{category.id}</TableCell>
                                    <TableCell className="text-right">
                                        <form action={removeFormAction}><input type="hidden" name="id" value={category.id} /><RemoveCategoryButton /></form>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    }
                </CardContent>
            </Card>
        </div>
    );
}
