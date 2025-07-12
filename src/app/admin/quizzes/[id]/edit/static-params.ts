import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Quiz } from '@/lib/types';

export async function generateStaticParams() {
  const quizzesCollection = collection(db, 'quizzes');
  const q = query(quizzesCollection);
  const querySnapshot = await getDocs(q);

  const quizzes: Quiz[] = [];
  querySnapshot.forEach((doc) => {
    quizzes.push({ id: doc.id, ...doc.data() } as Quiz);
  });

  return quizzes.map((quiz) => ({
    id: quiz.id,
  }));
}
