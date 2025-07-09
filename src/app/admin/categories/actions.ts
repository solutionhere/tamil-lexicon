'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { categorySchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { slugify } from '@/lib/utils';

type ActionState = {
  message: string;
  success: boolean;
};

export async function addCategoryAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const validatedFields = categorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { message: 'Validation failed: ' + validatedFields.error.errors.map(e => e.message).join(', '), success: false };
  }
  
  const { name } = validatedFields.data;
  const id = slugify(name);

  try {
    const categoryRef = doc(db, 'categories', id);
    await setDoc(categoryRef, { id, name });
    revalidatePath('/admin/categories');
    revalidatePath('/submit');
    revalidatePath('/admin/words/add');
    return { message: `Successfully added category: ${name}`, success: true };
  } catch (error) {
    console.error("Database error adding category:", error);
    return { message: 'A category with this name may already exist. Please use a different name.', success: false };
  }
}

export async function deleteCategoryAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id') as string;
    const validation = z.string().min(1).safeParse(id);

    if (!validation.success) {
        return { message: 'Validation failed: Category ID is missing.', success: false };
    }

    try {
        // In a real app, you'd check if any words are using this category before deleting.
        await deleteDoc(doc(db, 'categories', id));
        revalidatePath('/admin/categories');
        revalidatePath('/submit');
        revalidatePath('/admin/words/add');
        return { message: 'Successfully deleted category.', success: true };
    } catch (error) {
        console.error("Database error deleting category:", error);
        return { message: 'Database error.', success: false };
    }
}
