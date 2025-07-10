
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, Users, BookMarked, Newspaper, Tags, Globe } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type AdminDashboardCounts = {
    published: number;
    pending: number;
    flagged: number;
    categories: number;
    locations: number;
};

export default function AdminPage() {
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const [counts, setCounts] = useState<AdminDashboardCounts>({ published: 0, pending: 0, flagged: 0, categories: 0, locations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCounts() {
        if (authLoading) {
            // Don't fetch if auth state is still loading.
            // The loading UI will be handled by the combined loading state below.
            return;
        }

        try {
            const publishedQuery = query(collection(db, 'words'), where('status', '==', 'published'), where('isFlagged', '==', false));
            const pendingQuery = query(collection(db, 'words'), where('status', '==', 'pending'));
            const flaggedQuery = query(collection(db, 'words'), where('isFlagged', '==', true));
            const categoriesQuery = collection(db, 'categories');
            const locationsQuery = collection(db, 'locations');

            const [publishedSnap, pendingSnap, flaggedSnap, categoriesSnap, locationsSnap] = await Promise.all([
                getCountFromServer(publishedQuery),
                getCountFromServer(pendingQuery),
                getCountFromServer(flaggedQuery),
                getCountFromServer(categoriesQuery),
                getCountFromServer(locationsQuery)
            ]);

            setCounts({
                published: publishedSnap.data().count,
                pending: pendingSnap.data().count,
                flagged: flaggedSnap.data().count,
                categories: categoriesSnap.data().count,
                locations: locationsSnap.data().count,
            });
        } catch (error) {
            console.error("Error fetching admin counts:", error);
        } finally {
            setLoading(false);
        }
    }
    
    fetchCounts();
  }, [authLoading]);

  if (loading || authLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-full max-w-md" />
            </CardHeader>
            <CardContent className="pt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid gap-8">
        <Card>
            <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                Manage lexicon content and application features.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <BookMarked className="h-5 w-5" />
                            Manage Words
                        </CardTitle>
                        <CardDescription>Approve, edit, and add new lexicon entries.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2">
                        <div className="text-sm text-muted-foreground">Published: <span className="font-bold text-foreground">{counts.published}</span></div>
                        <div className="text-sm text-muted-foreground">Pending: <span className="font-bold text-foreground">{counts.pending}</span></div>
                        <div className="text-sm text-muted-foreground">Flagged: <span className="font-bold text-destructive">{counts.flagged}</span></div>
                    </CardContent>
                    <CardFooter>
                         <Button asChild><Link href="/admin/words">Manage Words</Link></Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Tags className="h-5 w-5" />
                            Manage Categories
                        </CardTitle>
                        <CardDescription>Add or remove word categories.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <p className="text-sm text-muted-foreground">Total Categories: <span className="font-bold text-foreground">{counts.categories}</span></p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild><Link href="/admin/categories">Manage Categories</Link></Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Globe className="h-5 w-5" />
                            Manage Locations
                        </CardTitle>
                        <CardDescription>Add or remove geographical regions.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                          <p className="text-sm text-muted-foreground">Total Locations: <span className="font-bold text-foreground">{counts.locations}</span></p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild><Link href="/admin/locations">Manage Locations</Link></Button>
                    </CardFooter>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <ClipboardList className="h-5 w-5" />
                            Manage Quizzes
                        </CardTitle>
                        <CardDescription>Create and schedule live quizzes for users.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <p className="text-muted-foreground">View all quizzes and create new ones.</p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild><Link href="/admin/quizzes">Manage Quizzes</Link></Button>
                    </CardFooter>
                </Card>
                 <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Newspaper className="h-5 w-5" />
                            Manage Blog
                        </CardTitle>
                        <CardDescription>Create and publish blog posts.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <p className="text-muted-foreground">Write articles to engage the community.</p>
                    </CardContent>
                    <CardFooter>
                         <Button asChild><Link href="/admin/blog">Manage Blog</Link></Button>
                    </CardFooter>
                </Card>
                 {isSuperAdmin && (
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Users className="h-5 w-5" />
                                Manage Admins
                            </Title>
                            <CardDescription>Add or remove admin users.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-muted-foreground">Control who has access to this dashboard.</p>
                        </CardContent>
                        <CardFooter>
                             <Button asChild><Link href="/admin/users">Manage Admins</Link></Button>
                        </CardFooter>
                    </Card>
                )}
            </CardContent>
        </Card>
    </div>
  );
}
