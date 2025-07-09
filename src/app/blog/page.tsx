import Link from 'next/link';
import { blogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  const sortedPosts = blogPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lexicon
            </Link>
          </Button>
        </div>
        <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold text-primary">Lexicon Blog</h1>
            <p className="mt-2 text-muted-foreground">Thoughts, articles, and updates from the team.</p>
        </div>

        <div className="space-y-8">
            {sortedPosts.map(post => (
                <Card key={post.id} className="flex flex-col">
                    <CardHeader>
                        <Link href={`/blog/${post.slug}`} className="group">
                            <CardTitle className="group-hover:text-primary group-hover:underline">{post.title}</CardTitle>
                        </Link>
                        <CardDescription>
                            Posted by {post.author.name} on {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="line-clamp-3 text-muted-foreground">
                            {post.content}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="link" className="p-0">
                            <Link href={`/blog/${post.slug}`}>
                                Read More
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
