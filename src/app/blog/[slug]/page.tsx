import { BlogPageClient } from '@/components/blog-page-client';

// This function is required for static export of dynamic routes.
// We return an empty array because we want all rendering to happen on the client.
export async function generateStaticParams() {
  return [];
}

// These settings are required to make dynamic routes work with `output: 'export'`
// when you want them to be client-side rendered.
export const dynamicParams = true;
export const dynamic = 'force-dynamic';

export default function BlogPostPage() {
  return <BlogPageClient />;
}
