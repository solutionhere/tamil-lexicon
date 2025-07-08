import { LexiconShell } from '@/components/lexicon-shell';
import { categories, locations, words } from '@/lib/data';

export default function Home() {
  const publishedWords = words.filter((word) => word.status === 'published');
  return (
    <LexiconShell
      words={publishedWords}
      categories={categories}
      locations={locations}
    />
  );
}
