'use client';

import React, { useTransition, useEffect, useActionState, useRef } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { blogPostSchema } from '@/lib/schemas';
import { createPostAction } from '../actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

type FormData = z.infer<typeof blogPostSchema>;

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')       // Replace spaces with -
        .replace(/[^\w-]+/g, '')   // Remove all non-word chars
        .replace(/--+/g, '-')       // Replace multiple - with single -
        .replace(/^-+/, '')          // Trim - from start of text
        .replace(/-+$/, '');         // Trim - from end of text
}

export default function CreateBlogPage() {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [state, formAction] = useActionState(createPostAction, { success: false });
    const formRef = useRef<HTMLFormElement>(null);

    const form = useForm<FormData>({
        resolver: zodResolver(blogPostSchema),
        defaultValues: {
            title: '',
            slug: '',
            content: '',
        },
    });

    const titleValue = form.watch('title');

    useEffect(() => {
        if (titleValue) {
            form.setValue('slug', slugify(titleValue), { shouldValidate: true });
        }
    }, [titleValue, form]);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success!",
                description: state.message,
                action: <CheckCircle className="text-green-500" />,
            });
            form.reset();
            formRef.current?.reset();
        } else if (state.message) {
             toast({
                title: "Error submitting form",
                description: state.message,
                variant: "destructive",
            });
             state.errors?.forEach(error => {
                form.setError(error.path[0] as keyof FormData, { message: error.message });
            });
        }
    }, [state, toast, form]);


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
                
                <Form {...form}>
                  <form 
                    ref={formRef}
                    action={formAction} 
                    onSubmit={(evt) => {
                      evt.preventDefault();
                      form.handleSubmit(() => {
                        startTransition(() => {
                           formAction(new FormData(formRef.current!));
                        });
                      })(evt);
                    }}
                    className="space-y-8"
                  >
                    <Card>
                      <CardContent className="p-6 space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Post Title</FormLabel>
                              <FormControl><Input placeholder="e.g., The History of Tamil Memes" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="slug"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>URL Slug</FormLabel>
                              <FormControl><Input placeholder="a-url-friendly-slug" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="content"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Content</FormLabel>
                              <FormControl><Textarea placeholder="Write your blog post here..." {...field} rows={15} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Post
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </Form>
            </div>
        </div>
    );
}
