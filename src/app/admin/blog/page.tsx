'use client';

import Link from 'next/link';
import { blogPosts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminBlogPage() {

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-4 flex justify-between items-center">
          <Button variant="ghost" asChild>
            <Link href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin
            </Link>
          </Button>
           <Button variant="default" asChild>
            <Link href="/admin/blog/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Link>
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Manage Blog Posts</CardTitle>
            <CardDescription>
              Create, edit, and manage blog posts for the community.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {blogPosts.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead><span className="sr-only">Actions</span></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {blogPosts.map(post => (
                      <TableRow key={post.id}>
                        <TableCell className="font-semibold">{post.title}</TableCell>
                        <TableCell className="font-mono text-muted-foreground">/blog/{post.slug}</TableCell>
                        <TableCell>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</TableCell>
                        <TableCell className="text-right">
                           <Button variant="ghost" size="icon" disabled>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit Post (coming soon)</span>
                            </Button>
                            <Button variant="ghost" size="icon" disabled>
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete Post (coming soon)</span>
                            </Button>
                        </TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10">
                <h3 className="text-lg font-semibold">No Blog Posts Found</h3>
                <p className="mt-2 text-muted-foreground">Get started by creating a new post.</p>
                 <Button asChild className="mt-4">
                    <Link href="/admin/blog/create">Create Post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
