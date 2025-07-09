'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { wordUpdateSchema } from '@/lib/schemas';

type ActionState = {
  message: string;
  success: boolean;
};

export type WordFormState = {
  message?: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

// In a real app, these actions would interact with a database
// to update the word's status. Here, we'll just log
// the action to the console for demonstration purposes.

export async function approveWordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const wordId = formData.get('wordId') as string;
  const validation = z.string().min(1).safeParse(wordId);

  if (!validation.success) {
    return {
      message: 'Validation failed: Word ID cannot be empty.',
      success: false,
    };
  }

  console.log(`SIMULATION: Approving word with ID: ${wordId}`);
  // In a real DB: await db.word.update({ where: { id: wordId }, data: { status: 'published' } });

  revalidatePath('/admin/words');
  revalidatePath('/');
  return { message: `Successfully simulated approving word.`, success: true };
}

export async function rejectWordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const wordId = formData.get('wordId') as string;
  const validation = z.string().min(1).safeParse(wordId);

  if (!validation.success) {
    return {
      message: 'Validation failed: Word ID cannot be empty.',
      success: false,
    };
  }

  console.log(`SIMULATION: Rejecting word with ID: ${wordId}`);
  // In a real DB: await db.word.delete({ where: { id: wordId } });

  revalidatePath('/admin/words');
  return { message: `Successfully simulated rejecting word.`, success: true };
}

export async function deleteWordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const wordId = formData.get('wordId') as string;
  const validation = z.string().min(1).safeParse(wordId);

  if (!validation.success) {
    return { message: 'Validation failed: Word ID is missing.', success: false };
  }

  console.log(`SIMULATION: Deleting word with ID: ${wordId}`);
  // In a real DB: await db.word.delete({ where: { id: wordId } });

  revalidatePath('/admin/words');
  revalidatePath('/');
  return { message: `Successfully simulated deleting word.`, success: true };
}

export async function updateWordAction(
  prevState: WordFormState,
  formData: FormData
): Promise<WordFormState> {
  const validatedFields = wordUpdateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.errors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }
  
  const { wordId, ...wordData } = validatedFields.data;

  // In a real app, you would save this to a database
  console.log(`SIMULATION: Updating word with ID: ${wordId}`);
  console.log('Updated data:', wordData);

  revalidatePath('/admin/words');
  revalidatePath('/');
  revalidatePath(`/admin/words/${wordId}/edit`);

  return {
    message: `Successfully simulated updating "${wordData.transliteration}".`,
    success: true,
  };
}
