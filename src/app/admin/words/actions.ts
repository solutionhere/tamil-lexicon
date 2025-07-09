'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { wordUpdateSchema, submissionSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { doc, updateDoc, deleteDoc, addDoc, collection, getDoc } from 'firebase/firestore';

type ActionState = {
  message: string;
  success: boolean;
};

export type WordFormState = {
  message?: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

export async function approveWordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const wordId = formData.get('wordId') as string;
  const validation = z.string().min(1).safeParse(wordId);

  if (!validation.success) {
    return { message: 'Validation failed: Word ID cannot be empty.', success: false };
  }

  try {
    const wordRef = doc(db, 'words', wordId);
    await updateDoc(wordRef, { status: 'published', isFlagged: false });
    revalidatePath('/admin/words');
    revalidatePath('/');
    return { message: 'Successfully approved word.', success: true };
  } catch (e) {
    console.error("Database error approving word:", e);
    return { message: 'Database error.', success: false };
  }
}

export async function rejectWordAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const wordId = formData.get('wordId') as string;
  const validation = z.string().min(1).safeParse(wordId);

  if (!validation.success) {
    return { message: 'Validation failed: Word ID cannot be empty.', success: false };
  }

  try {
    await deleteDoc(doc(db, 'words', wordId));
    revalidatePath('/admin/words');
    return { message: 'Successfully rejected word.', success: true };
  } catch (e) {
    console.error("Database error rejecting word:", e);
    return { message: 'Database error.', success: false };
  }
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
  
  try {
    const wordDoc = await getDoc(doc(db, 'words', wordId));
    const wordData = wordDoc.data();
    await deleteDoc(doc(db, 'words', wordId));

    revalidatePath('/admin/words');
    revalidatePath('/');
    if (wordData) {
        revalidatePath(`/word/${wordData.transliteration}`);
    }
    return { message: 'Successfully deleted word.', success: true };
  } catch (e) {
    console.error("Database error deleting word:", e);
    return { message: 'Database error.', success: false };
  }
}

export async function updateWordAction(
  prevState: WordFormState,
  formData: FormData
): Promise<WordFormState> {
  const validatedFields = wordUpdateSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.errors, message: 'Validation failed.', success: false };
  }
  
  const { wordId, exampleTamil, exampleEnglish, tamilWord, ...rest } = validatedFields.data;

  try {
    const wordData = {
        ...rest,
        tamil: tamilWord,
        example: {
            tamil: exampleTamil,
            english: exampleEnglish
        },
    };
    await updateDoc(doc(db, 'words', wordId), wordData);
    revalidatePath('/admin/words');
    revalidatePath('/');
    revalidatePath(`/word/${wordData.transliteration}`);
    revalidatePath(`/admin/words/${wordId}/edit`);
    return { message: `Successfully updated "${wordData.transliteration}".`, success: true };
  } catch (e) {
    console.error("Database error updating word:", e);
    return { message: 'Database error.', success: false };
  }
}

export async function addWordAction(
  prevState: WordFormState,
  formData: FormData
): Promise<WordFormState> {
  const validatedFields = submissionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.errors, message: 'Validation failed.', success: false };
  }

  try {
    const { exampleTamil, exampleEnglish, tamilWord, ...rest } = validatedFields.data;
    const wordData = {
        ...rest,
        tamil: tamilWord,
        example: {
            tamil: exampleTamil,
            english: exampleEnglish
        },
        status: 'published',
        isFlagged: false,
        createdAt: new Date(),
    };
    await addDoc(collection(db, 'words'), wordData);
    revalidatePath('/admin/words');
    revalidatePath('/');
    return { message: `Successfully added "${validatedFields.data.transliteration}".`, success: true };
  } catch (e) {
    console.error("Database error adding word:", e);
    return { message: 'Database error.', success: false };
  }
}
