'use client';

import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { Word, Category, Location } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Volume2, BookOpen, MapPin, Flag, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { flagWordAction } from '@/app/words/actions';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Component for the submit button to show a pending state
function FlagButton({ isFlagged }: { isFlagged?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button variant="outline" size="sm" type="submit" disabled={pending || isFlagged}>
      {pending ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Flag className="mr-2 h-4 w-4" />
      )}
      {isFlagged ? 'Already Flagged' : 'Flag for Correction'}
    </Button>
  );
}

interface WordDetailProps {
  word: Word | null;
  categories: Category[];
  locations: Location[];
}

export function WordDetail({ word, categories, locations }: WordDetailProps) {
  const { toast } = useToast();
  
  const [state, formAction] = useActionState(flagWordAction, { message: '' });

  React.useEffect(() => {
    if (state.message) {
      if (state.message.startsWith('Error:')) {
         toast({
          title: 'Error',
          description: state.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Success',
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  if (!word) {
    return (
      <div className="flex h-full items-center justify-center bg-card p-8">
        <div className="text-center">
          <h2 className="font-headline text-2xl font-semibold">Welcome to Tamil Lexicon</h2>
          <p className="mt-2 text-muted-foreground">Select a word from the list to see its details.</p>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === word.category);
  const location = locations.find(l => l.id === word.location);

  return (
    <ScrollArea className="h-full bg-card">
      <div className="p-6 lg:p-8">
        {word.isFlagged && (
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Flagged for Review</AlertTitle>
                <AlertDescription>
                    This entry has been flagged by the community and is pending review by moderators.
                </AlertDescription>
            </Alert>
        )}
        <Card className="border-none shadow-none">
          <CardHeader className="px-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <CardTitle className="font-headline text-4xl text-primary">{word.tamil}</CardTitle>
                <CardDescription className="mt-1 text-xl">{word.transliteration}</CardDescription>
              </div>
              <div className="flex shrink-0 gap-2">
                {category && <Badge variant="secondary">{category.name}</Badge>}
                {location && <Badge variant="secondary" className="flex items-center gap-1"><MapPin size={14} /> {location.name}</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 px-0">
            <p className="text-base leading-relaxed md:text-lg">{word.definition}</p>
            <Separator />
            <div>
              <h4 className="mb-2 font-headline text-lg font-semibold">Example Usage</h4>
              <blockquote className="border-l-4 border-primary pl-4 italic">
                <p className="text-lg">{word.example.tamil}</p>
                <p className="mt-1 text-muted-foreground">{word.example.english}</p>
              </blockquote>
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Volume2 size={20} />
                  <span className="font-headline font-semibold">Pronunciation</span>
                </div>
                <p className="font-mono text-lg">{word.pronunciation}</p>
              </div>
               <div className="flex items-start gap-4">
                <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
                  <BookOpen size={20} />
                   <span className="font-headline font-semibold">Origin/Context</span>
                </div>
                <p className="text-base md:text-lg">This term is commonly used in {location?.name}.</p>
              </div>
            </div>
             <Separator />
             <div className="pt-2">
                <form action={formAction}>
                    <input type="hidden" name="wordId" value={word.id} />
                    <FlagButton isFlagged={word.isFlagged}/>
                </form>
             </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
