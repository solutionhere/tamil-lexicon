import { z } from 'zod';

export const submissionSchema = z.object({
  tamilWord: z.string().min(1, 'Tamil word is required.'),
  transliteration: z.string().min(1, 'Transliteration is required.'),
  definition: z.string().min(10, 'Definition must be at least 10 characters.'),
  exampleTamil: z.string().min(1, 'Tamil example is required.'),
  exampleEnglish: z.string().min(1, 'English example is required.'),
  category: z.string().min(1, 'Please select a category.'),
  location: z.string().min(1, 'Please select a location.'),
});
