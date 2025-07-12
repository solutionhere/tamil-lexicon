import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, 'blogPosts'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
  }));
}
