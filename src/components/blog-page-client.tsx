
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit, DocumentData } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';
import type { Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


export function BlogPageClient() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const getPost = async (slug: string) => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, 'blogPosts'),
          where('slug', '==', slug.toLowerCase()),
          where('status', '==', 'published'),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setPost(null);
        } else {
          const doc = snapshot.docs[0];
          const data = doc.data();
          const publishedAt = (data.publishedAt as Timestamp).toDate().toISOString();
          setPost({
            id: doc.id,
            ...data,
            publishedAt: publishedAt,
          } as BlogPost);
        }
      } catch (e) {
        console.error("Error fetching post:", e);
        setError("Failed to load the blog post. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getPost(slug);
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Skeleton className="h-8 w-36 mb-4" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="container mx-auto max-w-3xl px-4 py-12">
             <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
     )
  }

  if (!post) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="container mx-auto max-w-md px-4 py-12 text-center">
                <Card>
                    <CardHeader>
                        <CardTitle>404 - Post Not Found</CardTitle>
                        <CardDescription>The blog post you are looking for does not exist.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/blog">Back to Blog</Link>
                        </Button>
                    </CardContent>
                </Card>
              </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        
        <article>
            <header className="mb-8 border-b pb-4">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">{post.title}</h1>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />}
                            <AvatarFallback>
                                <UserCircle className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                    </div>
                    <span>•</span>
                    <time dateTime={post.publishedAt as string}>
                        {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </time>
                </div>
            </header>
            
            <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
      </div>
    </div>
  );
}
