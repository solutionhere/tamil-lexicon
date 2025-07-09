import { LexiconShell } from '@/components/lexicon-shell';
import type { Word, Category, Location } from '@/lib/types';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

async function getLexiconData() {
  const wordsQuery = query(collection(db, 'words'), where('status', '==', 'published'));
  const categoriesQuery = collection(db, 'categories');
  const locationsQuery = collection(db, 'locations');

  const [wordsSnapshot, categoriesSnapshot, locationsSnapshot] = await Promise.all([
    getDocs(wordsQuery),
    getDocs(categoriesQuery),
    getDocs(locationsQuery),
  ]);

  const words = wordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Word[];
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
