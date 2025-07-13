"use server";

import { revalidatePath } from "next/cache";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function flagWordAction(
  prevState: { message: string },
  formData: FormData
): Promise<{ message:string }> {
  const wordId = formData.get("wordId") as string;
  
  if (!wordId) {
    return { message: "Error: Word ID is missing." };
  }

  try {
    const wordRef = doc(db, 'words', wordId);
    const wordDoc = await getDoc(wordRef);

    if (wordDoc.exists()) {
      await updateDoc(wordRef, { isFlagged: true });
      const wordData = wordDoc.data();
      revalidatePath("/");
      revalidatePath(`/word/${wordData.slug}`);
      revalidatePath("/admin/words");
      return { message: `The word "${wordData.transliteration}" has been reported. Thank you!` };
    } else {
      return { message: `Error: Could not find word with ID ${wordId}.` };
    }
  } catch (error) {
    console.error("Error flagging word:", error);
    return { message: "An error occurred while flagging the word." };
  }
}
