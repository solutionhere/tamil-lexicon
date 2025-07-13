
import { WordPageClient } from '@/components/word-page-client';

export const dynamic = 'force-static';
export const dynamicParams = false;

// This function is required for static export of dynamic routes.
// We return an empty array because we want all rendering to happen on the client.
export async function generateStaticParams() {
  return [];
}

export default function WordPage() {
    return <WordPageClient />;
}
