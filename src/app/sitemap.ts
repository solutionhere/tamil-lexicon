/**
 * @fileoverview Generates a sitemap.xml for the website.
 * This script is intended to be run after the Next.js build process.
 */

import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { Word, BlogPost } from '@/lib/types';
import fs from 'fs';
import path from 'path';

// This needs to be your production URL
// In a real project, this should come from an environment variable
const BASE_URL = 'https://solutionhere.github.io/tamil-lexicon';

async function generateSitemap() {
  console.log('Generating sitemap...');

  const wordsQuery = query(collection(db, 'words'), where('status', '==', 'published'));
  const postsQuery = query(collection(db, 'blogPosts'));
  
  const [wordsSnapshot, postsSnapshot] = await Promise.all([
    getDocs(wordsQuery),
    getDocs(postsQuery)
  ]);

  const words = wordsSnapshot.docs.map(doc => doc.data() as Word);
  const posts = postsSnapshot.docs.map(doc => doc.data() as BlogPost);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${BASE_URL}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.00</priority>
  </url>
  <url>
    <loc>${BASE_URL}/blog/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  ${words.map(word => `
  <url>
    <loc>${`${BASE_URL}/word/${encodeURIComponent(word.transliteration)}/`}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>0.80</priority>
  </url>
  `).join('')}
  ${posts.map(post => `
  <url>
    <loc>${`${BASE_URL}/blog/${post.slug}/`}</loc>
    <lastmod>${new Date(post.publishedAt).toISOString()}</lastmod>
    <priority>0.64</priority>
  </url>
  `).join('')}
</urlset>
`;

  const sitemapPath = path.join(process.cwd(), 'out', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated successfully at ${sitemapPath}`);

  // Need to exit the process because Firestore connection keeps it alive
  process.exit(0);
}

generateSitemap().catch(error => {
    console.error('Error generating sitemap:', error);
    process.exit(1);
});
