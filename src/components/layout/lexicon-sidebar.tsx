"use client";

import React from 'react';
import { Logo } from '@/components/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type { Category, Location } from '@/lib/types';
import { MapPin, X } from 'lucide-react';

interface LexiconSidebarProps {
  categories: Category[];
  locations: Location[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  selectedLocation: string | null;
  onLocationChange: (locationId: string | null) => void;
}

export function LexiconSidebar({
  categories,
  locations,
  selectedCategories,
  onCategoryToggle,
  selectedLocation,
  onLocationChange,
}: LexiconSidebarProps) {
  return (
    <div className="flex h-full flex-col bg-card">
      <div className="flex h-16 items-center border-b px-4">
        <Logo />
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-6 p-4">
          <div>
            <h3 className="mb-3 font-headline text-sm font-semibold text-muted-foreground">CATEGORY</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => onCategoryToggle(category.id)}
                    aria-labelledby={`label-cat-${category.id}`}
                  />
                  <Label id={`label-cat-${category.id}`} htmlFor={`cat-${category.id}`} className="flex-1 cursor-pointer font-normal">
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-3 font-headline text-sm font-semibold text-muted-foreground">REGION</h3>
            <div className="space-y-1">
              {locations.filter(l => !l.parent).map(parentLocation => (
                <div key={parentLocation.id}>
                  <Button
                    variant="ghost"
                    className={`h-auto w-full justify-start px-2 py-1.5 ${selectedLocation === parentLocation.id ? 'bg-accent/20' : ''}`}
                    onClick={() => onLocationChange(parentLocation.id)}
                  >
                    <MapPin className="mr-2 h-4 w-4" /> {parentLocation.name}
                  </Button>
                  <div className="pl-4">
                  {locations.filter(l => l.parent === parentLocation.id).map(childLocation => (
                    <Button
                      key={childLocation.id}
                      variant="ghost"
                      className={`h-auto w-full justify-start px-2 py-1.5 text-muted-foreground hover:text-foreground ${selectedLocation === childLocation.id ? 'bg-accent/20 text-accent-foreground' : ''}`}
                      onClick={() => onLocationChange(childLocation.id)}
                    >
                      <span className="mr-2 h-4 w-4 rounded-bl-md border-b border-l border-muted-foreground/50"></span>
                      {childLocation.name}
                    </Button>
                  ))}
                  </div>
                </div>
              ))}
            </div>
            {selectedLocation && (
              <Button variant="ghost" size="sm" onClick={() => onLocationChange(null)} className="mt-2 w-full text-muted-foreground">
                <X className="mr-2 h-4 w-4" />
                Clear selection
              </Button>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
