"use server";

import { z } from 'zod';
import { suggestTransliteration as suggestTransliterationFlow } from '@/ai/flows/suggest-transliteration';

export const submissionSchema = z.object({
  tamilWord: z.string().min(1, 'Tamil word is required.'),
  transliteration: z.string().min(1, 'Transliteration is required.'),
  definition: z.string().min(10, 'Definition must be at least 10 characters.'),
  exampleTamil: z.string().min(1, 'Tamil example is required.'),
  exampleEnglish: z.string().min(1, 'English example is required.'),
  category: z.string().min(1, 'Please select a category.'),
  location: z.string().min(1, 'Please select a location.'),
});

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

export async function suggestTransliteration(tamilWord: string) {
    if (!tamilWord) return { transliteration: '' };
    try {
        const result = await suggestTransliterationFlow({ tamilWord });
        return { transliteration: result.transliteration };
    } catch (error) {
        console.error("Transliteration failed:", error);
        return { transliteration: '' };
    }
}
