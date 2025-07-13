import { BlogPageClient } from '@/components/blog-page-client';

// This function is required by Next.js for static exports with dynamic routes.
// We return an empty array because we are rendering the pages on the client-side.
export async function generateStaticParams() {
  return [];
}

export default function BlogPostPage() {
  return <BlogPageClient />;
}
