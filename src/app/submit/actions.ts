"use server";

import { z } from 'zod';
import { submissionSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

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
  
  try {
    const { exampleTamil, exampleEnglish, ...rest } = validatedFields.data;
    const wordData = {
        ...rest,
        example: {
            tamil: exampleTamil,
            english: exampleEnglish
        },
        status: 'pending',
        isFlagged: false,
        createdAt: new Date(),
    };
    await addDoc(collection(db, 'words'), wordData);
  } catch (error) {
    console.error("Error submitting word to Firestore:", error);
    return {
      message: 'An error occurred while submitting your word. Please try again.',
      success: false,
    };
  }

  return {
    message: 'Thank you! Your suggestion has been submitted for review.',
    success: true,
  };
}

// NOTE: The AI-powered transliteration functions are not modified as they don't interact with the DB.
// You could replace the rule-based ones with a Genkit flow for better accuracy.
export { suggestTransliteration, suggestTamilWord } from './ai-actions';
