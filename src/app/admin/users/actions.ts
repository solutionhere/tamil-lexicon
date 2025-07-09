"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

type ActionState = {
  message: string;
  success: boolean;
};

const uidSchema = z.string().min(1, 'User ID cannot be empty.');

export async function addAdminAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const uid = formData.get("uid") as string;
  const validation = uidSchema.safeParse(uid);
  
  if (!validation.success) {
    return { message: "Validation failed: User ID cannot be empty.", success: false };
  }

  try {
    await setDoc(doc(db, "users", uid), { role: "admin" }, { merge: true });
    revalidatePath('/admin/users');
    return { message: `Successfully added admin: ${uid}.`, success: true };
  } catch (e) {
    console.error("Database error adding admin:", e);
    return { message: "Database error.", success: false };
  }
}

export async function removeAdminAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const uid = formData.get("uid") as string;
  const validation = uidSchema.safeParse(uid);

  if (!validation.success) {
    return { message: "Validation failed: User ID is missing.", success: false };
  }
  
  try {
    // Setting role to 'user' instead of deleting, to preserve other potential user data
    await setDoc(doc(db, "users", uid), { role: "user" }, { merge: true });
    revalidatePath('/admin/users');
    return { message: `Successfully removed admin role from: ${uid}.`, success: true };
  } catch(e) {
    console.error("Database error removing admin:", e);
    return { message: "Database error.", success: false };
  }
}
