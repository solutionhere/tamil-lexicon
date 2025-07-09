'use client';

import React from 'react';
import Link from 'next/link';
import { createPostAction } from '../actions';
import { Button } from '@/components/ui/button';
import { BlogPostForm } from '@/components/blog-post-form';
import { ArrowLeft } from 'lucide-react';

export default function CreateBlogPage() {
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
                    <h1 className="font-headline text-4xl font-bold text-primary">Create a New Post</h1>
                    <p className="mt-2 text-muted-foreground">Write a new article for the Lexicon blog.</p>
                </div>
                <BlogPostForm formAction={createPostAction} submitButtonText="Create Post" />
            </div>
        </div>
    );
}
