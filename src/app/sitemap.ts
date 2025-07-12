import { MetadataRoute } from 'next';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Word, BlogPost } from '@/lib/types';
import type { Timestamp } from 'firebase/firestore';

// This needs to be your production URL
// In a real project, this should come from an environment variable
const BASE_URL = 'https://solutionhere.github.io/tamil-lexicon';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const wordsQuery = query(collection(db, 'words'), where('status', '==', 'published'));
  const postsQuery = query(collection(db, 'blogPosts'), where('status', '==', 'published'));

  const [wordsSnapshot, postsSnapshot] = await Promise.all([
    getDocs(wordsQuery),
    getDocs(postsQuery),
  ]);

  const words = wordsSnapshot.docs.map(doc => doc.data() as Word);
  const posts = postsSnapshot.docs.map(doc => doc.data() as BlogPost);

  const wordUrls: MetadataRoute.Sitemap = words.map(word => ({
    url: `${BASE_URL}/word/${encodeURIComponent(word.transliteration)}/`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  const postUrls: MetadataRoute.Sitemap = posts.map(post => {
    // Safely handle both Timestamp and string formats for publishedAt
    let lastModifiedDate: Date;
    if (typeof post.publishedAt === 'string') {
        lastModifiedDate = new Date(post.publishedAt);
    } else if (post.publishedAt && 'toDate' in post.publishedAt) {
        lastModifiedDate = (post.publishedAt as Timestamp).toDate();
    } else {
        lastModifiedDate = new Date(); // Fallback
    }
    
    return {
        url: `${BASE_URL}/blog/${post.slug}/`,
        lastModified: lastModifiedDate,
        priority: 0.7,
    }
  });

  return [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog/`,
      lastModified: new Date(),
      priority: 0.9,
    },
    ...wordUrls,
    ...postUrls,
  ];
}
