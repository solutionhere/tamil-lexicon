'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { blogPostSchema, blogPostUpdateSchema } from '@/lib/schemas';

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

export async function updatePostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const validatedFields = blogPostUpdateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.errors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }

  const { postId, ...postData } = validatedFields.data;

  console.log(`SIMULATION: Updating blog post with ID: "${postId}"`);
  console.log(postData);

  revalidatePath('/admin/blog');
  revalidatePath(`/blog/${postData.slug}`);
  
  return {
    message: `Successfully simulated updating post: "${postData.title}".`,
    success: true,
  };
}

export async function deletePostAction(
  prevState: { success: boolean, message?: string },
  formData: FormData
): Promise<{ success: boolean, message?: string }> {
  const postId = formData.get('postId') as string;
  const validation = z.string().min(1).safeParse(postId);

  if (!validation.success) {
    return {
      message: 'Validation failed: Post ID cannot be empty.',
      success: false,
    };
  }

  console.log(`SIMULATION: Deleting post with ID: ${postId}`);

  revalidatePath('/admin/blog');
  revalidatePath('/blog');
  
  return {
    message: `Successfully simulated deleting post.`,
    success: true,
  };
}
