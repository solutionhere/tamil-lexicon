'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { blogPostSchema, blogPostUpdateSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase';

export type BlogPostFormState = {
  message?: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

export async function createPostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const validatedFields = blogPostSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.errors, message: 'Validation failed.', success: false };
  }

  // Basic check for authenticated user
  if (!auth.currentUser) {
      return { message: 'Authentication error: You must be logged in.', success: false };
  }

  try {
    const postData = {
        ...validatedFields.data,
        publishedAt: new Date(),
        author: {
            name: auth.currentUser.displayName || "Anonymous",
            avatarUrl: auth.currentUser.photoURL || "",
        }
    };
    await addDoc(collection(db, 'blogPosts'), postData);
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { message: `Successfully created post: "${validatedFields.data.title}".`, success: true };
  } catch (error) {
    console.error("Database error creating post:", error);
    return { message: 'Database error.', success: false };
  }
}

export async function updatePostAction(
  prevState: BlogPostFormState,
  formData: FormData
): Promise<BlogPostFormState> {
  const validatedFields = blogPostUpdateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.errors, message: 'Validation failed.', success: false };
  }

  const { postId, ...postData } = validatedFields.data;

  try {
    const postRef = doc(db, 'blogPosts', postId);
    await updateDoc(postRef, postData);
    
    revalidatePath('/admin/blog');
    revalidatePath(`/blog/${postData.slug}`);
    return { message: `Successfully updated post: "${postData.title}".`, success: true };
  } catch (error) {
    console.error("Database error updating post:", error);
    return { message: 'Database error.', success: false };
  }
}

export async function deletePostAction(
  prevState: { success: boolean, message?: string },
  formData: FormData
): Promise<{ success: boolean, message?: string }> {
  const postId = formData.get('postId') as string;
  const validation = z.string().min(1).safeParse(postId);

  if (!validation.success) {
    return { message: 'Validation failed: Post ID cannot be empty.', success: false };
  }

  try {
    await deleteDoc(doc(db, 'blogPosts', postId));
    revalidatePath('/admin/blog');
    revalidatePath('/blog');
    return { message: 'Successfully deleted post.', success: true };
  } catch (error) {
    console.error("Database error deleting post:", error);
    return { message: 'Database error.', success: false };
  }
}
