'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, getDocs, type Timestamp } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function getExcerpt(html: string, length = 150) {
    if (!html) return '';
    const plainText = html.replace(/<[^>]*>?/gm, '');
    if (plainText.length <= length) return plainText;
    return plainText.substring(0, length) + '...';
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getBlogPosts() {
      try {
        const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
        const snapshot = await getDocs(q);
        const fetchedPosts = snapshot.docs.map(doc => {
            const data = doc.data();
            const publishedAt = (data.publishedAt as Timestamp).toDate().toISOString();
            return {
              id: doc.id,
              ...data,
              publishedAt,
            } as BlogPost;
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    }
    getBlogPosts();
  }, []);

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
        <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold text-primary">Lexicon Blog</h1>
            <p className="mt-2 text-muted-foreground">Thoughts, articles, and updates from the team.</p>
        </div>

        {loading ? (
            <div className="space-y-8">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}><CardHeader><Skeleton className="h-8 w-3/4" /><Skeleton className="h-4 w-1/2 mt-2" /></CardHeader><CardContent><Skeleton className="h-6 w-full" /></CardContent><CardFooter><Skeleton className="h-6 w-24" /></CardFooter></Card>
                ))}
            </div>
        ) : (
          <div className="space-y-8">
              {posts.length > 0 ? posts.map(post => (
                  <Card key={post.id} className="flex flex-col">
                      <CardHeader>
                          <Link href={`/blog/${post.slug}`} className="group">
                              <CardTitle className="group-hover:text-primary group-hover:underline">{post.title}</CardTitle>
                          </Link>
                          <CardDescription>
                              Posted by {post.author.name} on {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                          <p className="line-clamp-3 text-muted-foreground">
                             {getExcerpt(post.content)}
                          </p>
                      </CardContent>
                      <CardFooter>
                          <Button asChild variant="link" className="p-0">
                              <Link href={`/blog/${post.slug}`}>
                                  Read More
                              </Link>
                          </Button>
                      </CardFooter>
                  </Card>
              )) : (
                <div className="text-center py-10">
                    <h3 className="text-lg font-semibold">No Blog Posts Yet</h3>
                    <p className="mt-2 text-muted-foreground">Check back later for articles and updates.</p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
