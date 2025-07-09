'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { quizCreationSchema } from '@/lib/schemas';

export type QuizCreationData = z.infer<typeof quizCreationSchema>;

export type QuizFormState = {
  message?: string;
  errors?: {
    [key: string]: any;
  };
  success: boolean;
};

// In a real app, this would save the quiz to a database.
export async function createQuizAction(
  data: QuizCreationData
): Promise<QuizFormState> {
  const validatedFields = quizCreationSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }
  
  // In a real app, you would save this to a database with a 'draft' status
  console.log(`SIMULATION: Creating new quiz with title: "${validatedFields.data.title}"`);
  console.log({ ...validatedFields.data, id: `quiz-${Date.now()}`, status: 'draft' });

  revalidatePath('/admin/quizzes');
  
  return {
    message: `Successfully simulated creating quiz: "${validatedFields.data.title}".`,
    success: true,
  };
}
