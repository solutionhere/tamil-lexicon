"use client"
import type { Word } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface WordListItemProps {
  word: Word;
  isSelected: boolean;
  onClick: () => void;
}

export function WordListItem({ word, isSelected, onClick }: WordListItemProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        'h-auto w-full flex-col items-start justify-start rounded-lg p-4 text-left',
        isSelected && 'bg-primary/10'
      )}
    >
      <div className="flex w-full items-baseline justify-between">
        <h3 className="font-headline text-lg font-semibold text-primary">{word.tamil}</h3>
        <p className="text-sm text-muted-foreground">{word.transliteration}</p>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {word.definition}
      </p>
    </Button>
  );
}
