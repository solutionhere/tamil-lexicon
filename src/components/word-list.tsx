"use client";
import type { Word } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WordListItem } from './word-list-item';
import { Skeleton } from './ui/skeleton';

interface WordListProps {
  words: Word[];
  selectedWord: Word | null;
  onWordSelect: (word: Word) => void;
  isLoading?: boolean;
}

export function WordList({ words, selectedWord, onWordSelect, isLoading = false }: WordListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {isLoading ? (
          <div className="space-y-1">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-[76px] w-full rounded-lg" />
            ))}
          </div>
        ) : words.length > 0 ? (
          <ul className="space-y-1">
            {words.map(word => (
              <li key={word.id}>
                <WordListItem
                  word={word}
                  isSelected={selectedWord?.id === word.id}
                  onClick={() => onWordSelect(word)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No words found. Try a different search or filter.
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
