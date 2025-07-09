'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ClipboardList, Ban, Users, BookMarked, Newspaper } from 'lucide-react';
import { useAuth } from '@/context/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { words } from '@/lib/data';

export default function AdminPage() {
  const { isAdmin, isSuperAdmin, loading } = useAuth();
  const flaggedWordsCount = words.filter(word => word.isFlagged).length;
  const pendingWordsCount = words.filter(word => word.status === 'pending').length;
  const publishedWordsCount = words.filter(word => word.status === 'published' && !word.isFlagged).length;


  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto max-w-4xl px-4 py-12">
            <Skeleton className="h-10 w-36 mb-8" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-full max-w-md" />
                </CardHeader>
                <CardContent className="pt-6 grid gap-4 md:grid-cols-2">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </CardContent>
            </Card>
        </div>
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
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lexicon
            </Link>
          </Button>
        </div>
        
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
                            <div className="text-sm text-muted-foreground">Published: <span className="font-bold text-foreground">{publishedWordsCount}</span></div>
                            <div className="text-sm text-muted-foreground">Pending: <span className="font-bold text-foreground">{pendingWordsCount}</span></div>
                            <div className="text-sm text-muted-foreground">Flagged: <span className="font-bold text-destructive">{flaggedWordsCount}</span></div>
                        </CardContent>
                        <CardFooter>
                             <Button asChild><Link href="/admin/words">Manage Words</Link></Button>
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
                                </CardTitle>
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
      </div>
    </div>
  );
}
