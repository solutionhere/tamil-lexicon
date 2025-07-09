'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { blogPostSchema } from '@/lib/schemas';

export type BlogPostFormState = {
  message?: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

// In a real app, this would save the post to a database.
export async function createPostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const validatedFields = blogPostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.errors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }

  console.log(`SIMULATION: Creating new blog post with title: "${validatedFields.data.title}"`);
  console.log({ ...validatedFields.data, id: `post-${Date.now()}`, publishedAt: new Date().toISOString() });

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  
  return {
    message: `Successfully simulated creating post: "${validatedFields.data.title}".`,
    success: true,
  };
}
