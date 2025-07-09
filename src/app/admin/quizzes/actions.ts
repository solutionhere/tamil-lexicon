'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { quizCreationSchema, quizUpdateSchema } from '@/lib/schemas';

export type QuizCreationData = z.infer<typeof quizCreationSchema>;
export type QuizUpdateData = z.infer<typeof quizUpdateSchema>;


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


export async function updateQuizAction(
  data: QuizUpdateData
): Promise<QuizFormState> {
  const validatedFields = quizUpdateSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed. Please check the fields.',
      success: false,
    };
  }
  
  const { quizId, ...quizData } = validatedFields.data;

  // In a real app, you would save this to a database
  console.log(`SIMULATION: Updating quiz with ID: ${quizId}`);
  console.log('Updated data:', quizData);

  revalidatePath('/admin/quizzes');
  revalidatePath(`/admin/quizzes/${quizId}/edit`);
  
  return {
    message: `Successfully simulated updating quiz: "${quizData.title}".`,
    success: true,
  };
}

type ActionState = {
  message?: string;
  success: boolean;
};

export async function deleteQuizAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const quizId = formData.get('quizId') as string;
  const validation = z.string().min(1).safeParse(quizId);

  if (!validation.success) {
    return {
      message: 'Validation failed: Quiz ID cannot be empty.',
      success: false,
    };
  }

  console.log(`SIMULATION: Deleting quiz with ID: ${quizId}`);
  
  revalidatePath('/admin/quizzes');
  
  return {
    message: 'Successfully simulated deleting quiz.',
    success: true,
  };
}
