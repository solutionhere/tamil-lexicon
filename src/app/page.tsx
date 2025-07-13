import { LexiconShell } from '@/components/lexicon-shell';
import type { Word, Category, Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, orderBy, type Timestamp } from 'firebase/firestore';

async function getLexiconData() {
  const wordsQuery = query(collection(db, 'words'), where('status', '==', 'published'));
  const categoriesQuery = query(collection(db, 'categories'));
  const locationsQuery = query(collection(db, 'locations'));

  const [wordsSnapshot, categoriesSnapshot, locationsSnapshot] = await Promise.all([
    getDocs(wordsQuery),
    getDocs(categoriesQuery),
    getDocs(locationsQuery),
  ]);

  const words = wordsSnapshot.docs.map(doc => {
    const data = doc.data();
    // Convert Firestore Timestamp to a serializable string
    const createdAt = (data.createdAt as Timestamp)?.toDate ? (data.createdAt as Timestamp).toDate().toISOString() : new Date().toISOString();
    return { 
        id: doc.id, 
        ...data,
        createdAt,
    } as Word;
  });
  const categories = categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
  const locations = locationsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Location[];

  return { words, categories, locations };
}


export default async function Home() {
  const { words, categories, locations } = await getLexiconData();

  return (
    <LexiconShell
      words={words}
      categories={categories}
      locations={locations}
    />
  );
}
