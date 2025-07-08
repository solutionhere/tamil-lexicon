'use client';

import React, { useEffect, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { submissionSchema, submitWord, suggestTransliteration } from '@/app/submit/actions';
import type { Category, Location } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Wand2, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SubmissionFormProps {
  categories: Category[];
  locations: Location[];
}

type FormData = z.infer<typeof submissionSchema>;

export function SubmissionForm({ categories, locations }: SubmissionFormProps) {
  const { toast } = useToast();
  const [isAiPending, startAiTransition] = useTransition();
  const [isFormPending, startFormTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      tamilWord: '',
      transliteration: '',
      definition: '',
      exampleTamil: '',
      exampleEnglish: '',
      category: '',
      location: '',
    },
  });

  const tamilWordValue = form.watch('tamilWord');

  const handleSuggestTransliteration = () => {
    startAiTransition(async () => {
      const result = await suggestTransliteration(tamilWordValue);
      if (result.transliteration) {
        form.setValue('transliteration', result.transliteration, { shouldValidate: true });
        toast({ title: 'Suggestion applied!', description: `Set transliteration to "${result.transliteration}".` });
      } else {
        toast({ title: 'Suggestion failed', description: 'Could not generate a transliteration.', variant: 'destructive' });
      }
    });
  };

  const onSubmit = (data: FormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => formData.append(key, value as string));

    startFormTransition(async () => {
      const result = await submitWord({ success: false }, formData);
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          action: <CheckCircle className="text-green-500" />,
        });
        form.reset();
      } else {
        toast({
          title: "Error submitting form",
          description: result.message || "Please check your input for errors.",
          variant: "destructive",
        });
        result.errors?.forEach(error => {
            form.setError(error.path[0] as keyof FormData, { message: error.message });
        });
      }
    });
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="tamilWord"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tamil Word (in தமிழ் script)</FormLabel>
                    <FormControl>
                      <Input placeholder="எ.கா: மச்சி" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transliteration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Transliteration</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input placeholder="e.g., Machi" {...field} />
                      </FormControl>
                      <Button type="button" variant="outline" size="icon" onClick={handleSuggestTransliteration} disabled={!tamilWordValue || isAiPending} aria-label="Suggest transliteration">
                        {isAiPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="definition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Definition</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Explain the meaning of the word..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="exampleTamil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example (Tamil)</FormLabel>
                    <FormControl>
                      <Input placeholder="என்ன மச்சி, எப்படி இருக்க?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exampleEnglish"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example (English)</FormLabel>
                    <FormControl>
                      <Input placeholder="Hey dude, how are you?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a category" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Region / Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select a region" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isFormPending}>
              {isFormPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit for Review
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
