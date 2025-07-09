'use client';

import Link from 'next/link';
import React from 'react';
import { useActionState, useFormStatus } from 'react-dom';
import { useAuth } from '@/context/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { adminUids, SUPERADMIN_UID } from '@/lib/admins';
import { addAdminAction, removeAdminAction } from './actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ArrowLeft, Ban, Trash2, UserPlus, Crown, Loader2 } from 'lucide-react';

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
    const { isSuperAdmin, loading } = useAuth();
    const { toast } = useToast();

    const [addState, addFormAction] = useActionState(addAdminAction, { message: '', success: false });
    const [removeState, removeFormAction] = useActionState(removeAdminAction, { message: '', success: false });
    
    const addFormRef = React.useRef<HTMLFormElement>(null);

    React.useEffect(() => {
        if (addState.message) {
            toast({
                title: addState.success ? 'Success' : 'Error',
                description: addState.message,
                variant: addState.success ? 'default' : 'destructive',
            });
            if (addState.success) {
                addFormRef.current?.reset();
            }
        }
    }, [addState, toast]);

    React.useEffect(() => {
        if (removeState.message) {
            toast({
                title: removeState.success ? 'Success' : 'Error',
                description: removeState.message,
                variant: removeState.success ? 'default' : 'destructive',
            });
        }
    }, [removeState, toast]);

    if (loading) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <Skeleton className="h-10 w-36 mb-8" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
                    <CardContent><Skeleton className="h-64 w-full" /></CardContent>
                </Card>
            </div>
        );
    }

    if (!isSuperAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="container mx-auto max-w-md px-4 py-12 text-center">
                    <Card>
                        <CardHeader className="items-center">
                             <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-2">
                                <Ban className="h-8 w-8 text-destructive" />
                            </div>
                            <CardTitle>Access Denied</CardTitle>
                            <CardDescription>Only a Super Admin can manage users.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild><Link href="/admin">Back to Admin</Link></Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto max-w-2xl px-4 py-12">
                <div className="mb-4">
                    <Button variant="ghost" asChild>
                        <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin</Link>
                    </Button>
                </div>

                <div className="grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Add New Admin</CardTitle>
                             <CardDescription>
                                Enter the Firebase User ID (UID) of the user you want to grant admin privileges to.
                            </CardDescription>
                        </CardHeader>
                        <form action={addFormAction} ref={addFormRef}>
                            <CardContent>
                                <Input name="uid" placeholder="Enter User ID (UID)" required />
                            </CardContent>
                            <CardFooter>
                                <AddAdminButton />
                            </CardFooter>
                        </form>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Current Admins</CardTitle>
                            <CardDescription>
                                This list shows all users with admin privileges.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <Alert>
                                <Crown className="h-4 w-4" />
                                <AlertTitle>Demonstration Only</AlertTitle>
                                <AlertDescription>
                                    Adding or removing admins here will only simulate the action. In a real application, this would update a database.
                                </AlertDescription>
                            </Alert>
                            <Table className="mt-4">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>User ID (UID)</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>
                                        <TableCell className="font-mono">{SUPERADMIN_UID}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Crown className="h-4 w-4 text-primary" /> Super Admin
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right"></TableCell>
                                    </TableRow>
                                    {adminUids.map(uid => (
                                        <TableRow key={uid}>
                                            <TableCell className="font-mono">{uid}</TableCell>
                                            <TableCell>Admin</TableCell>
                                            <TableCell className="text-right">
                                                <form action={removeFormAction}>
                                                    <input type="hidden" name="uid" value={uid} />
                                                    <RemoveAdminButton uid={uid} />
                                                </form>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
