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
import type { Timestamp } from 'firebase/firestore';

// Let Next.js know about all the possible blog posts at build time
export async function generateStaticParams() {
    const snapshot = await getDocs(query(collection(db, 'blogPosts'), where('status', '==', 'published')));
    return snapshot.docs.map(doc => ({
        slug: doc.data().slug,
    }));
}

async function getPost(slug: string): Promise<BlogPost | null> {
    const q = query(collection(db, 'blogPosts'), where('slug', '==', slug), where('status', '==', 'published'), limit(1));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
        return null;
    }
    const doc = snapshot.docs[0];
    const data = doc.data();
    // Ensure timestamp is converted to a serializable format (ISO string)
    const publishedAt = (data.publishedAt as Timestamp).toDate().toISOString();

    return {
        id: doc.id,
        ...data,
        publishedAt: publishedAt,
    } as BlogPost;
}


function stripHtml(html: string){
    if (!html) return '';
    // This simple regex is safe for server-side execution.
    return html.replace(/<[^>]*>?/gm, '');
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
        publishedTime: post.publishedAt as string,
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
                    <time dateTime={post.publishedAt as string}>
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
