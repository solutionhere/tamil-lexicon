"use server";

import { z } from 'zod';
import { transliterate, reverseTransliterate } from '@/lib/transliteration';
import { submissionSchema } from '@/lib/schemas';

export type SubmissionState = {
  message?: string;
  errors?: z.ZodIssue[];
  success: boolean;
};

export async function submitWord(
  prevState: SubmissionState,
  formData: FormData
): Promise<SubmissionState> {
  const validatedFields = submissionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.errors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }

  // In a real app, you would save this to a database with a 'pending' status.
  console.log('New submission received:', validatedFields.data);

  return {
    message: 'Thank you! Your suggestion has been submitted for review.',
    success: true,
  };
}

export async function suggestTransliteration(tamilWord: string): Promise<{ transliteration: string }> {
    if (!tamilWord) return { transliteration: '' };
    
    const transliteration = transliterate(tamilWord);
    
    return { transliteration };
}

export async function suggestTamilWord(englishWord: string): Promise<{ tamilWord: string }> {
    if (!englishWord) return { tamilWord: '' };

    const tamilWord = reverseTransliterate(englishWord);

    return { tamilWord };
}
