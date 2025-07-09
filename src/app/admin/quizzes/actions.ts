'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { quizCreationSchema, quizUpdateSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';


export type QuizCreationData = z.infer<typeof quizCreationSchema>;
export type QuizUpdateData = z.infer<typeof quizUpdateSchema>;


export type QuizFormState = {
  message?: string;
  errors?: {
    [key: string]: any;
  };
  success: boolean;
};

export async function createQuizAction(
  data: QuizCreationData
): Promise<QuizFormState> {
  const validatedFields = quizCreationSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.', success: false };
  }
  
  try {
    await addDoc(collection(db, 'quizzes'), { ...validatedFields.data, status: 'draft' });
    revalidatePath('/admin/quizzes');
    return { message: `Successfully created quiz: "${validatedFields.data.title}".`, success: true };
  } catch (error) {
    return { message: 'Database error.', success: false };
  }
}


export async function updateQuizAction(
  data: QuizUpdateData
): Promise<QuizFormState> {
  const validatedFields = quizUpdateSchema.safeParse(data);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Validation failed.', success: false };
  }
  
  const { quizId, ...quizData } = validatedFields.data;

  try {
    await updateDoc(doc(db, 'quizzes', quizId), quizData);
    revalidatePath('/admin/quizzes');
    revalidatePath(`/admin/quizzes/${quizId}/edit`);
    return { message: `Successfully updated quiz: "${quizData.title}".`, success: true };
  } catch (error) {
    return { message: 'Database error.', success: false };
  }
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
    return { message: 'Validation failed: Quiz ID cannot be empty.', success: false };
  }

  try {
    await deleteDoc(doc(db, 'quizzes', quizId));
    revalidatePath('/admin/quizzes');
    return { message: 'Successfully deleted quiz.', success: true };
  } catch (error) {
    return { message: 'Database error.', success: false };
  }
}
