'use client';

import Link from 'next/link';
import React, { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { addAdminAction, removeAdminAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Ban, Trash2, UserPlus, Crown, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

type AdminUser = {
    id: string;
    role: 'admin' | 'superadmin';
};

function AddAdminButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
      Add Admin
    </Button>
  );
}

function RemoveAdminButton({ uid }: { uid: string }) {
    const { pending } = useFormStatus();
    return (
        <Button variant="ghost" size="icon" type="submit" disabled={pending}>
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-destructive" />}
            <span className="sr-only">Remove admin {uid}</span>
        </Button>
    );
}

export default function ManageAdminsPage() {
    const { user, isSuperAdmin, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const addFormRef = useRef<HTMLFormElement>(null);
    
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    const fetchAdmins = React.useCallback(() => {
        if (!isSuperAdmin) {
            setLoading(false);
            return;
        }
        startTransition(async () => {
            setLoading(true);
            const q = query(collection(db, "users"), where("role", "in", ["admin", "superadmin"]));
            const querySnapshot = await getDocs(q);
            const adminList = querySnapshot.docs.map(doc => ({ id: doc.id, role: doc.data().role })) as AdminUser[];
            setAdmins(adminList);
            setLoading(false);
        });
    }, [isSuperAdmin]);

    useEffect(() => {
        if (!authLoading) {
            fetchAdmins();
        }
    }, [authLoading, fetchAdmins]);
    
    const handleAction = async (actionFn: (prevState: any, formData: FormData) => Promise<any>, formData: FormData) => {
        const result = await actionFn({ success: false, message: '' }, formData);
        toast({
            title: result.success ? 'Success' : 'Error',
            description: result.message,
            variant: result.success ? 'default' : 'destructive',
        });
        if (result.success) {
            fetchAdmins();
            if (actionFn === addAdminAction) {
                addFormRef.current?.reset();
            }
        }
    };

    const [addState, addFormAction] = useActionState(async (p,f) => handleAction(addAdminAction, f), null);
    const [removeState, removeFormAction] = useActionState(async (p,f) => handleAction(removeAdminAction, f), null);

    if (authLoading) {
        return <div className="container mx-auto max-w-2xl px-4 py-12"><Skeleton className="h-10 w-36 mb-8" /><Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><Skeleton className="h-64 w-full" /></CardContent></Card></div>;
    }

    if (!isSuperAdmin) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="container mx-auto max-w-md px-4 py-12 text-center"><Card><CardHeader className="items-center"><div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2"><Ban className="h-8 w-8 text-destructive" /></div><CardTitle>Access Denied</CardTitle><CardDescription>Only a Super Admin can manage users.</CardDescription></CardHeader><CardContent><Button asChild><Link href="/admin">Back to Admin</Link></Button></CardContent></Card></div></div>;
    }
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <div className="mb-4"><Button variant="ghost" asChild><Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin</Link></Button></div>
                <div className="grid gap-8">
                    <Card><CardHeader><CardTitle>Add New Admin</CardTitle><CardDescription>Enter the Firebase User ID (UID) of the user you want to grant admin privileges to.</CardDescription></CardHeader><form action={addFormAction} ref={addFormRef}><CardContent><Input name="uid" placeholder="Enter User ID (UID)" required /></CardContent><CardFooter><AddAdminButton /></CardFooter></form></Card>
                    <Card>
                        <CardHeader><CardTitle>Current Admins</CardTitle><CardDescription>This list shows all users with admin privileges.</CardDescription></CardHeader>
                        <CardContent>
                            {(loading || isPending) ? <p>Loading...</p> : 
                            <Table className="mt-4">
                                <TableHeader><TableRow><TableHead>User ID (UID)</TableHead><TableHead>Role</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                <TableBody>
                                    {admins.map(admin => (
                                        <TableRow key={admin.id}>
                                            <TableCell className="font-mono">{admin.id}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {admin.role === 'superadmin' && <Crown className="h-4 w-4 text-primary" />}
                                                    {admin.role === 'superadmin' ? 'Super Admin' : 'Admin'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {admin.role !== 'superadmin' && (
                                                    <form action={removeFormAction}><input type="hidden" name="uid" value={admin.id} /><RemoveAdminButton uid={admin.id} /></form>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
