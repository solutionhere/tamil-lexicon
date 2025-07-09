'use client';

import React, { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { updatePostAction } from '../../actions';
import { BlogPostForm } from '@/components/blog-post-form';
import type { BlogPost } from '@/lib/types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
        const postDoc = await getDoc(doc(db, 'blogPosts', params.id));
        if (postDoc.exists()) {
            const data = postDoc.data();
            setPost({
                id: postDoc.id,
                ...data,
                // Convert Firestore Timestamp to string
                publishedAt: data.publishedAt.toDate().toISOString(),
            } as BlogPost);
        }
        setLoading(false);
    };
    fetchPost();
  }, [params.id]);

  if (loading) {
    return <div className="container mx-auto max-w-3xl px-4 py-12"><Skeleton className="h-10 w-48 mb-8" /><Skeleton className="h-96 w-full" /></div>
  }
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-4"><Button variant="ghost" asChild><Link href="/admin/blog"><ArrowLeft className="mr-2 h-4 w-4" />Back to Blog Posts</Link></Button></div>
        <div className="mb-8 text-center"><h1 className="font-headline text-4xl font-bold text-primary">Edit Post</h1><p className="mt-2 text-muted-foreground">Update the details for "{post.title}".</p></div>
        <BlogPostForm formAction={updatePostAction} initialData={post} submitButtonText="Update Post" />
      </div>
    </div>
  );
}
