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

const processTags = (tagsString?: string): string[] => {
  if (!tagsString) return [];
  return tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

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
    const { exampleTamil, exampleEnglish, tamilWord, tags, ...rest } = validatedFields.data;
    const wordData = {
        ...rest,
        tamil: tamilWord,
        example: {
            tamil: exampleTamil,
            english: exampleEnglish
        },
        tags: processTags(tags),
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
