import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import type { BlogPost } from '@/lib/types';

// Required for static export
export const dynamicParams = false;

async function getPost(slug: string): Promise<BlogPost | null> {
    const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        // Convert Firestore Timestamp to string
        publishedAt: data.publishedAt.toDate().toISOString(),
    } as BlogPost;
}


function stripHtml(html: string){
    if (typeof window === 'undefined') {
        // Simple server-side stripping
        return html.replace(/<[^>]*>?/gm, '');
    }
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: 'Post not found - Tamil Lexicon Blog' };
  }

  const description = stripHtml(post.content).substring(0, 160);

  return {
    title: `${post.title} - Tamil Lexicon Blog`,
    description: description,
    openGraph: {
        title: post.title,
        description: description,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
        
        <article>
            <header className="mb-8 border-b pb-4">
                <h1 className="font-headline text-3xl font-bold text-primary md:text-4xl">{post.title}</h1>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                            {post.author.avatarUrl && <AvatarImage src={post.author.avatarUrl} alt={post.author.name} />}
                            <AvatarFallback>
                                <UserCircle className="h-5 w-5" />
                            </AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                    </div>
                    <span>•</span>
                    <time dateTime={post.publishedAt}>
                        {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                    </time>
                </div>
            </header>
            
            <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />
        </article>
      </div>
    </div>
  );
}
