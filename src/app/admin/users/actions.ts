"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionState = {
  message: string;
  success: boolean;
};

const uidSchema = z.string().min(1, 'User ID cannot be empty.');

// In a real app, these actions would interact with a database
// to add or remove a user's admin role. Here, we'll just log
// the action to the console for demonstration purposes.

export async function addAdminAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const uid = formData.get("uid") as string;
  const validation = uidSchema.safeParse(uid);
  
  if (!validation.success) {
    return { message: "Validation failed: User ID cannot be empty.", success: false };
  }

  console.log(`SIMULATION: Adding admin with UID: ${uid}`);
  // In a real DB: await db.user.update({ where: { id: uid }, data: { role: 'admin' } });

  revalidatePath('/admin/users');
  return { message: `Successfully simulated adding admin: ${uid}.`, success: true };
}

export async function removeAdminAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const uid = formData.get("uid") as string;
  const validation = uidSchema.safeParse(uid);

  if (!validation.success) {
    return { message: "Validation failed: User ID is missing.", success: false };
  }

  console.log(`SIMULATION: Removing admin with UID: ${uid}`);
  // In a real DB: await db.user.update({ where: { id: uid }, data: { role: 'user' } });

  revalidatePath('/admin/users');
  return { message: `Successfully simulated removing admin: ${uid}.`, success: true };
}
