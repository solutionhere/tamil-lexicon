"use client";
import type { Word } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WordListItem } from './word-list-item';

interface WordListProps {
  words: Word[];
  selectedWord: Word | null;
  onWordSelect: (word: Word) => void;
}

export function WordList({ words, selectedWord, onWordSelect }: WordListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {words.length > 0 ? (
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
