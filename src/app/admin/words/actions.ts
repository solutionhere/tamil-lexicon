'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

type ActionState = {
  message: string;
  success: boolean;
};

const wordIdSchema = z.string().min(1, 'Word ID cannot be empty.');

// In a real app, these actions would interact with a database
// to update the word's status. Here, we'll just log
// the action to the console for demonstration purposes.

export async function approveWordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const wordId = formData.get('wordId') as string;
  const validation = wordIdSchema.safeParse(wordId);

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
  const validation = wordIdSchema.safeParse(wordId);

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
  const validation = wordIdSchema.safeParse(wordId);

  if (!validation.success) {
    return { message: 'Validation failed: Word ID is missing.', success: false };
  }

  console.log(`SIMULATION: Deleting word with ID: ${wordId}`);
  // In a real DB: await db.word.delete({ where: { id: wordId } });

  revalidatePath('/admin/words');
  revalidatePath('/');
  return { message: `Successfully simulated deleting word.`, success: true };
}
