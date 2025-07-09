'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { locationSchema } from '@/lib/schemas';
import { db } from '@/lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { slugify } from '@/lib/utils';
import type { Location } from '@/lib/types';

type ActionState = {
  message: string;
  success: boolean;
};

export async function addLocationAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const data = {
    name: formData.get('name'),
    parent: formData.get('parent') || undefined,
  };
  const validatedFields = locationSchema.safeParse(data);

  if (!validatedFields.success) {
    return { message: 'Validation failed: ' + validatedFields.error.errors.map(e => e.message).join(', '), success: false };
  }
  
  const { name, parent } = validatedFields.data;
  const id = slugify(name);

  const locationData: Omit<Location, 'parent'> & { parent?: string } = { id, name };
    if (parent) {
        locationData.parent = parent;
    }

  try {
    await setDoc(doc(db, 'locations', id), locationData);
    revalidatePath('/admin/locations');
    revalidatePath('/submit');
    revalidatePath('/admin/words/add');
    return { message: `Successfully added location: ${name}`, success: true };
  } catch (error) {
    console.error("Database error adding location:", error);
    return { message: 'A location with this name may already exist. Please use a different name.', success: false };
  }
}

export async function deleteLocationAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    const id = formData.get('id') as string;
    const validation = z.string().min(1).safeParse(id);

    if (!validation.success) {
        return { message: 'Validation failed: Location ID is missing.', success: false };
    }

    try {
        // In a real app, you'd check if any words or child locations are using this before deleting.
        await deleteDoc(doc(db, 'locations', id));
        revalidatePath('/admin/locations');
        revalidatePath('/submit');
        revalidatePath('/admin/words/add');
        return { message: 'Successfully deleted location.', success: true };
    } catch (error) {
        console.error("Database error deleting location:", error);
        return { message: 'Database error.', success: false };
    }
}
