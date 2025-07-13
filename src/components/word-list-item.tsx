"use client"
import Link from 'next/link';
import type { Word } from '@/lib/types';
import { cn } from '@/lib/utils';

interface WordListItemProps {
  word: Word;
  isSelected: boolean;
  onClick: () => void;
}

export function WordListItem({ word, isSelected, onClick }: WordListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'h-auto w-full flex-col items-start justify-start rounded-lg p-4 text-left cursor-pointer',
        'hover:bg-muted/50',
        isSelected && 'bg-primary/10'
      )}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            onClick();
        }
      }}
    >
       {word.slug ? (
            <Link href={`/word/${word.slug}`} onClick={(e) => e.stopPropagation()} className="group hover:no-underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
                <div className="flex w-full items-baseline justify-between">
                    <h3 className="font-headline text-lg font-semibold text-primary group-hover:underline">{word.tamil}</h3>
                    <p className="text-sm text-muted-foreground">{word.transliteration}</p>
                </div>
            </Link>
       ) : (
            <div className="flex w-full items-baseline justify-between">
                <h3 className="font-headline text-lg font-semibold text-primary">{word.tamil}</h3>
                <p className="text-sm text-muted-foreground">{word.transliteration}</p>
            </div>
       )}
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground pointer-events-none">
        {word.definition}
      </p>
    </div>
  );
}
