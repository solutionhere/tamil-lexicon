import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { blogPosts } from '@/lib/data';
import { ArrowLeft, UserCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface BlogPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return blogPosts.map(post => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);

  if (!post) {
    return {
      title: 'Post not found - Tamil Lexicon Blog',
    };
  }

  return {
    title: `${post.title} - Tamil Lexicon Blog`,
    description: post.content.substring(0, 160),
    openGraph: {
        title: post.title,
        description: post.content.substring(0, 160),
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [post.author.name],
    }
  };
}

export default function BlogPostPage({ params }: BlogPageProps) {
  const post = blogPosts.find(p => p.slug === params.slug);

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
            
            <div className="text-lg leading-relaxed whitespace-pre-line space-y-6">
                {post.content}
            </div>
        </article>
      </div>
    </div>
  );
}
