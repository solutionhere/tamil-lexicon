"use server";

import { revalidatePath } from "next/cache";

// In a real app, this would come from a database.
import { words } from "@/lib/data";

export async function flagWordAction(
  prevState: { message: string },
  formData: FormData
): Promise<{ message: string }> {
  const wordId = formData.get("wordId") as string;
  
  if (!wordId) {
    return { message: "Error: Word ID is missing." };
  }

  // In a real app, you would update the word in the database.
  // For demonstration, we'll just log it. The data is static, so we can't
  // actually update the `isFlagged` property permanently.
  const word = words.find(w => w.id === wordId);
  if (word) {
    console.log(`Word "${word.tamil}" (ID: ${wordId}) has been flagged for review.`);
    // In a real DB: await db.word.update({ where: { id: wordId }, data: { isFlagged: true } });
  } else {
     console.log(`Could not find word with ID ${wordId} to flag.`);
     return { message: `Error: Could not find word with ID ${wordId}.` };
  }

  // Revalidate paths to reflect changes if data were dynamic.
  revalidatePath("/");
  revalidatePath("/admin");

  return { message: `The word "${word.transliteration}" has been reported. Thank you!` };
}
