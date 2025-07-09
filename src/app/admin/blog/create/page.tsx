'use client';

import React from 'react';
import { createPostAction } from '../actions';
import { BlogPostForm } from '@/components/blog-post-form';

export default function CreateBlogPage() {
    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="font-headline text-4xl font-bold text-primary">Create a New Post</h1>
                <p className="mt-2 text-muted-foreground">Write a new article for the Lexicon blog.</p>
            </div>
            <BlogPostForm formAction={createPostAction} submitButtonText="Create Post" />
        </div>
    );
}
