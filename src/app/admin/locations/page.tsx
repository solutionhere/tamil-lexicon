'use client';

import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { addLocationAction, deleteLocationAction } from './actions';
import type { Location } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Trash2, Globe, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

function AddLocationButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
      Add Location
    </Button>
  );
}

function RemoveLocationButton() {
    const { pending } = useFormStatus();
    return (
        <Button variant="ghost" size="icon" type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
            <span className="sr-only">Remove Location</span>
        </Button>
    );
}

export default function ManageLocationsPage() {
    const { isAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const addFormRef = useRef<HTMLFormElement>(null);
    
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const fetchLocations = React.useCallback(() => {
        if (!isAdmin) {
            setLoading(false);
            return;
        }
        startTransition(async () => {
            setLoading(true);
            const q = query(collection(db, "locations"), orderBy("name"));
            const querySnapshot = await getDocs(q);
            setLocations(querySnapshot.docs.map(doc => doc.data() as Location));
            setLoading(false);
        });
    }, [isAdmin]);

    useEffect(() => {
        if (!authLoading) {
            fetchLocations();
        }
    }, [authLoading, fetchLocations]);
    
    const handleAction = async (actionFn: (prevState: any, formData: FormData) => Promise<any>, formData: FormData) => {
        const result = await actionFn({ success: false, message: '' }, formData);
        toast({
            title: result.success ? 'Success' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
        });
        if (result.success) {
            fetchLocations();
            if (actionFn === addLocationAction) {
                addFormRef.current?.reset();
            }
        }
    };

    const [addState, addFormAction] = useActionState(async (p,f) => handleAction(addLocationAction, f), null);
    const [removeState, removeFormAction] = useActionState(async (p,f) => handleAction(deleteLocationAction, f), null);

    if (authLoading) {
        return <div className="grid gap-8"><Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card></div>;
    }
    
    return (
        <div className="grid gap-8">
            <Card>
                <CardHeader><CardTitle>Add New Location</CardTitle><CardDescription>Create a new geographical region for organizing words.</CardDescription></CardHeader>
                <form action={addFormAction} ref={addFormRef}>
                    <CardContent className="space-y-4">
                        <Input name="name" placeholder="e.g., Madurai" required />
                        <Select name="parent">
                            <SelectTrigger><SelectValue placeholder="Select a parent location (optional)" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="">None (Top-Level)</SelectItem>
                                {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </CardContent>
                    <CardFooter><AddLocationButton /></CardFooter>
                </form>
            </Card>
            <Card>
                <CardHeader><CardTitle>Current Locations</CardTitle><CardDescription>This list shows all available locations.</CardDescription></CardHeader>
                <CardContent>
                    {(loading || isPending) ? <p>Loading...</p> : 
                    <Table className="mt-4">
                        <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Parent</TableHead><TableHead>ID</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {locations.map(location => (
                                <TableRow key={location.id}>
                                    <TableCell className="font-medium">{location.name}</TableCell>
                                    <TableCell>{location.parent ? locations.find(l => l.id === location.parent)?.name : 'N/A'}</TableCell>
                                    <TableCell className="font-mono text-sm text-muted-foreground">{location.id}</TableCell>
                                    <TableCell className="text-right">
                                        <form action={removeFormAction}><input type="hidden" name="id" value={location.id} /><RemoveLocationButton /></form>
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
