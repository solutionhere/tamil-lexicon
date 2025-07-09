'use client';

import Link from 'next/link';
import type { BlogPost } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, PlusCircle, Edit, Trash2, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useActionState, useEffect, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { deletePostAction } from './actions';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button variant="ghost" size="icon" type="submit" disabled={pending} title="Delete Post">
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      <span className="sr-only">Delete Post</span>
    </Button>
  );
}

const PostActionCell = ({ postId, onActionComplete }: { postId: string, onActionComplete: () => void }) => {
  const { toast } = useToast();
  
  const handleAction = async (actionFn: (prevState: any, formData: FormData) => Promise<any>, formData: FormData) => {
    const result = await actionFn({ success: false, message: '' }, formData);
    toast({
        title: result.success ? 'Success' : 'Error',
        description: result.message,
        variant: result.success ? 'default' : 'destructive',
    });
    if (result.success) {
        onActionComplete();
    }
  };

  const [deleteState, deleteFormAction] = useActionState(async (p,f) => handleAction(deletePostAction, f), null);

  return (
    <div className="flex items-center justify-end gap-1">
      <Button variant="ghost" size="icon" asChild title="Edit Post"><Link href={`/admin/blog/${postId}/edit`}><Edit className="h-4 w-4" /><span className="sr-only">Edit Post</span></Link></Button>
      <form action={deleteFormAction}><input type="hidden" name="postId" value={postId} /><DeleteButton /></form>
    </div>
  );
};


export default function AdminBlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const fetchPosts = React.useCallback(() => {
    startTransition(async () => {
      setLoading(true);
      const q = query(collection(db, 'blogPosts'), orderBy('publishedAt', 'desc'));
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore Timestamp to string
          publishedAt: data.publishedAt.toDate().toISOString(),
        } as BlogPost;
      });
      setBlogPosts(posts);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-4 flex justify-between items-center"><Button variant="ghost" asChild><Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />Back to Admin</Link></Button><Button variant="default" asChild><Link href="/admin/blog/create"><PlusCircle className="mr-2 h-4 w-4" />Create Post</Link></Button></div>
        <Card>
          <CardHeader><CardTitle>Manage Blog Posts</CardTitle><CardDescription>Create, edit, and manage blog posts for the community.</CardDescription></CardHeader>
          <CardContent>
            {loading || isPending ? <p>Loading posts...</p> : blogPosts.length > 0 ? (
              <Table>
                <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead>Published</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader>
                <TableBody>
                  {blogPosts.map(post => (
                      <TableRow key={post.id}><TableCell className="font-semibold">{post.title}</TableCell><TableCell className="font-mono text-muted-foreground">/blog/{post.slug}</TableCell><TableCell>{format(new Date(post.publishedAt), 'MMM d, yyyy')}</TableCell><TableCell className="text-right"><PostActionCell postId={post.id} onActionComplete={fetchPosts} /></TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10"><h3 className="text-lg font-semibold">No Blog Posts Found</h3><p className="mt-2 text-muted-foreground">Get started by creating a new post.</p><Button asChild className="mt-4"><Link href="/admin/blog/create">Create Post</Link></Button></div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
