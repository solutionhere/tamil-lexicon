'use client';

import React, { useTransition, useEffect, useActionState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { blogPostSchema, blogPostUpdateSchema } from '@/lib/schemas';
import type { BlogPostFormState } from '@/app/admin/blog/actions';
import type { BlogPost } from '@/lib/types';
import { slugify } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, CheckCircle } from 'lucide-react';
import { RichTextEditor } from './rich-text-editor';

interface BlogPostFormProps {
    formAction: (prevState: BlogPostFormState, formData: FormData) => Promise<BlogPostFormState>;
    initialData?: BlogPost;
    submitButtonText?: string;
}

type FormData = z.infer<typeof blogPostSchema>;

export function BlogPostForm({ formAction, initialData, submitButtonText = "Submit" }: BlogPostFormProps) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const [state, dispatchFormAction] = useActionState(formAction, { success: false });
    const formRef = useRef<HTMLFormElement>(null);
    const isEditMode = !!initialData;

    const form = useForm<FormData>({
        resolver: zodResolver(isEditMode ? blogPostUpdateSchema : blogPostSchema),
        defaultValues: {
            title: initialData?.title || '',
            slug: initialData?.slug || '',
            content: initialData?.content || '',
        },
    });

    const titleValue = form.watch('title');

    useEffect(() => {
        const currentSlug = form.getValues('slug');
        if (titleValue && (!currentSlug || slugify(titleValue) !== currentSlug) && !isEditMode) {
            form.setValue('slug', slugify(titleValue), { shouldValidate: true });
        }
    }, [titleValue, form, isEditMode]);

    useEffect(() => {
        if (state.success) {
            toast({
                title: "Success!",
                description: state.message,
                action: <CheckCircle className="text-green-500" />,
            });
            if (!isEditMode) {
                form.reset();
                form.setValue('content', ''); // Explicitly clear Tiptap editor
                formRef.current?.reset();
            }
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
    }, [state, toast, form, isEditMode]);

    return (
        <Form {...form}>
            <form 
            ref={formRef}
            action={dispatchFormAction} 
            onSubmit={(evt) => {
                evt.preventDefault();
                form.handleSubmit(() => {
                startTransition(() => {
                    const formData = new FormData();
                    const formValues = form.getValues();
                    formData.append('title', formValues.title);
                    formData.append('slug', formValues.slug);
                    formData.append('content', formValues.content);

                    if (isEditMode) {
                        formData.append('postId', initialData.id);
                    }
                    dispatchFormAction(formData);
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
                        <FormControl>
                            <RichTextEditor
                                content={field.value}
                                onChange={field.onChange}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </CardContent>
                <CardFooter>
                <Button type="submit" disabled={isPending} className="w-full">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {submitButtonText}
                </Button>
                </CardFooter>
            </Card>
            </form>
        </Form>
    );
}
