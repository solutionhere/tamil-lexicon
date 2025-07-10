'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ClipboardList, Users, BookMarked, Newspaper, Tags, Globe } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { getAdminDashboardCounts, type AdminDashboardCounts } from './actions';

export default function AdminPage() {
  const { isSuperAdmin, loading: authLoading } = useAuth();
  const [counts, setCounts] = useState<AdminDashboardCounts | null>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if auth has finished loading
    if (!authLoading) {
      getAdminDashboardCounts().then(data => {
        setCounts(data);
        setDataLoading(false);
      });
    }
  }, [authLoading]); // This effect depends only on the authentication loading state

  const isLoading = authLoading || dataLoading;

  if (isLoading) {
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
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-48 w-full" />
            </CardContent>
        </Card>
    );
  }

  // We check for counts existence here, after loading is false.
  if (!counts) {
      return (
          <Card>
            <CardHeader>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>Could not load dashboard data.</CardDescription>
            </CardHeader>
        </Card>
      )
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
