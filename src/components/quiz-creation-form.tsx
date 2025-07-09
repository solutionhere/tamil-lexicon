'use client';

import React, { useState, useTransition } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { z } from 'zod';
import { quizCreationSchema } from '@/lib/schemas';
import type { QuizFormState, QuizCreationData } from '@/app/admin/quizzes/actions';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2, PlusCircle, Trash2, CheckCircle } from 'lucide-react';

interface QuizCreationFormProps {
  formAction: (data: QuizCreationData) => Promise<QuizFormState>;
}

type FormData = z.infer<typeof quizCreationSchema>;

const defaultQuestion = {
    text: '',
    options: ['', '', '', ''],
    correctAnswerIndex: -1,
    timeLimitSeconds: 15
};

export function QuizCreationForm({ formAction }: QuizCreationFormProps) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      title: '',
      questions: [defaultQuestion],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });
  
  const onSubmit = (data: FormData) => {
    startTransition(async () => {
      const result = await formAction(data);
      if (result.success) {
        toast({
          title: "Success!",
          description: result.message,
          action: <CheckCircle className="text-green-500" />,
        });
        form.reset();
        // Reset field array to one default question
        form.setValue('questions', [defaultQuestion]);
      } else {
        toast({
          title: "Error submitting form",
          description: result.message || "Please check your input for errors.",
          variant: "destructive",
        });
        // We can manually set errors if needed from result.errors
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Details</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quiz Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Chennai Slang Challenge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {fields.map((field, index) => (
          <Card key={field.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Question {index + 1}</CardTitle>
                <CardDescription>Configure this question and its answers.</CardDescription>
              </div>
              {fields.length > 1 && (
                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove Question</span>
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name={`questions.${index}.text`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Input placeholder="What does 'Machi' mean?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                 <Label>Answer Options & Correct Answer</Label>
                 <RadioGroup 
                    onValueChange={(value) => form.setValue(`questions.${index}.correctAnswerIndex`, parseInt(value, 10))} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                   {[0, 1, 2, 3].map((optionIndex) => (
                      <FormField
                          key={optionIndex}
                          control={form.control}
                          name={`questions.${index}.options.${optionIndex}`}
                          render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                  <FormControl>
                                    <div className="flex items-center gap-2">
                                      <RadioGroupItem value={String(optionIndex)} id={`q${index}-o${optionIndex}`} />
                                      <Label htmlFor={`q${index}-o${optionIndex}`} className="sr-only">Set option {optionIndex+1} as correct</Label>
                                      <Input placeholder={`Option ${optionIndex + 1}`} {...field} />
                                    </div>
                                  </FormControl>
                              </FormItem>
                          )}
                      />
                   ))}
                  </RadioGroup>
                  <FormMessage>{form.formState.errors.questions?.[index]?.correctAnswerIndex?.message}</FormMessage>
              </div>

               <FormField
                control={form.control}
                name={`questions.${index}.timeLimitSeconds`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" min="5" max="60" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

            </CardContent>
          </Card>
        ))}
        
        <div className="flex flex-col gap-4 md:flex-row md:justify-between">
            <Button type="button" variant="outline" onClick={() => append(defaultQuestion)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Another Question
            </Button>
            <Button type="submit" disabled={isPending} className="w-full md:w-auto">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Quiz
            </Button>
        </div>
      </form>
    </Form>
  );
}
