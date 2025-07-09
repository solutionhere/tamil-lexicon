import { words, categories, locations } from '@/lib/data';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Edit, Shield, ClipboardList } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function AdminPage() {
  const flaggedWords = words.filter(word => word.isFlagged);

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
        
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Admin Dashboard</CardTitle>
                    <CardDescription>
                    Manage lexicon content and application features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Shield className="h-5 w-5" />
                                Flagged Words
                            </CardTitle>
                            <CardDescription>Review words flagged by the community.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-4xl font-bold">{flaggedWords.length}</p>
                        </CardContent>
                        <CardFooter>
                             <Button asChild><Link href="#flagged-words">View Flagged Words</Link></Button>
                        </CardFooter>
                    </Card>
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ClipboardList className="h-5 w-5" />
                                Manage Quizzes
                            </CardTitle>
                            <CardDescription>Create and schedule live quizzes for users.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                             <p className="text-muted-foreground">View all quizzes and create new ones.</p>
                        </CardContent>
                        <CardFooter>
                             <Button asChild><Link href="/admin/quizzes">Manage Quizzes</Link></Button>
                        </CardFooter>
                    </Card>
                </CardContent>
            </Card>

            <Card id="flagged-words">
            <CardHeader>
                <CardTitle>Flagged Words for Review</CardTitle>
                <CardDescription>
                The following words have been flagged by the community for review.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {flaggedWords.length > 0 ? (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Tamil Word</TableHead>
                        <TableHead>Transliteration</TableHead>
                        <TableHead>Definition</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead><span className="sr-only">Actions</span></TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {flaggedWords.map(word => {
                        const category = categories.find(c => c.id === word.category);
                        const location = locations.find(l => l.id === word.location);
                        return (
                        <TableRow key={word.id}>
                            <TableCell className="font-semibold">{word.tamil}</TableCell>
                            <TableCell>{word.transliteration}</TableCell>
                            <TableCell className="max-w-xs truncate">{word.definition}</TableCell>
                            <TableCell>
                            {category && <Badge variant="outline">{category.name}</Badge>}
                            </TableCell>
                             <TableCell>
                              {location && <Badge variant="outline">{location.name}</Badge>}
                            </TableCell>
                            <TableCell>
                               <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                    <span className="sr-only">Edit Word</span>
                                </Button>
                            </TableCell>
                        </TableRow>
                        );
                    })}
                    </TableBody>
                </Table>
                ) : (
                <p className="text-center text-muted-foreground">No words have been flagged.</p>
                )}
            </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
