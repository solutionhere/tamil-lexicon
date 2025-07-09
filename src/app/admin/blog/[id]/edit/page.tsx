'use client';

import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { updatePostAction } from '../../actions';
import { BlogPostForm } from '@/components/blog-post-form';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const post = blogPosts.find(p => p.id === resolvedParams.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog Posts
            </Link>
          </Button>
        </div>
        <div className="mb-8 text-center">
          <h1 className="font-headline text-4xl font-bold text-primary">Edit Post</h1>
          <p className="mt-2 text-muted-foreground">Update the details for "{post.title}".</p>
        </div>
        <BlogPostForm
          formAction={updatePostAction}
          initialData={post}
          submitButtonText="Update Post"
        />
      </div>
    </div>
  );
}
