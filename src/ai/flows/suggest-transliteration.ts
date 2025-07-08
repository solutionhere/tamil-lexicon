// src/ai/flows/suggest-transliteration.ts
'use server';

/**
 * @fileOverview Suggests a possible English transliteration from Tamil script.
 *
 * - suggestTransliteration - A function that handles the transliteration suggestion process.
 * - SuggestTransliterationInput - The input type for the suggestTransliteration function.
 * - SuggestTransliterationOutput - The return type for the suggestTransliteration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTransliterationInputSchema = z.object({
  tamilWord: z
    .string()
    .describe('The Tamil word to transliterate to English.'),
});
export type SuggestTransliterationInput = z.infer<typeof SuggestTransliterationInputSchema>;

const SuggestTransliterationOutputSchema = z.object({
  transliteration: z.string().describe('The suggested English transliteration of the Tamil word.'),
});
export type SuggestTransliterationOutput = z.infer<typeof SuggestTransliterationOutputSchema>;

export async function suggestTransliteration(input: SuggestTransliterationInput): Promise<SuggestTransliterationOutput> {
  return suggestTransliterationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTransliterationPrompt',
  input: {schema: SuggestTransliterationInputSchema},
  output: {schema: SuggestTransliterationOutputSchema},
  prompt: `You are a transliteration expert specializing in converting Tamil script to English.

  Provide the most likely English transliteration of the following Tamil word:
  {{tamilWord}}`,
});

const suggestTransliterationFlow = ai.defineFlow(
  {
    name: 'suggestTransliterationFlow',
    inputSchema: SuggestTransliterationInputSchema,
    outputSchema: SuggestTransliterationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
