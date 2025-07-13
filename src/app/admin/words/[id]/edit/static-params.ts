import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function generateStaticParams() {
  const snapshot = await getDocs(collection(db, 'words'));
  return snapshot.docs.map(doc => ({
    id: doc.id,
  }));
}
