import { z } from 'zod';

export const submissionSchema = z.object({
  tamilWord: z.string().min(1, 'Tamil word is required.'),
  transliteration: z.string().min(1, 'Transliteration is required.'),
  definition: z.string().min(10, 'Definition must be at least 10 characters.'),
  exampleTamil: z.string().min(1, 'Tamil example is required.'),
  exampleEnglish: z.string().min(1, 'English example is required.'),
  category: z.string().min(1, 'Please select a category.'),
  location: z.string().min(1, 'Please select a location.'),
  userId: z.string().optional(),
});

export const wordUpdateSchema = submissionSchema.extend({
  wordId: z.string().min(1, 'Word ID is required.'),
});

// New schemas for quiz creation
export const quizQuestionSchema = z.object({
  text: z.string().min(5, 'Question text must be at least 5 characters long.'),
  options: z.array(z.string().min(1, 'Option cannot be empty.'))
    .length(4, 'There must be exactly 4 options.'),
  // We coerce to number as it comes from a string value in the radio group
  correctAnswerIndex: z.coerce.number({ invalid_type_error: 'You must select a correct answer.' }).min(0, {message: 'You must select a correct answer.'}).max(3),
  timeLimitSeconds: z.coerce.number({invalid_type_error: 'Time limit is required.'}).min(5, 'Time limit must be at least 5 seconds.').max(60, 'Time limit cannot exceed 60 seconds.'),
});

export const quizCreationSchema = z.object({
  title: z.string().min(3, 'Quiz title must be at least 3 characters long.'),
  questions: z.array(quizQuestionSchema).min(1, 'A quiz must have at least one question.'),
});

export const quizUpdateSchema = quizCreationSchema.extend({
    quizId: z.string().min(1, 'Quiz ID is required.'),
});


// New schema for blog post creation
export const blogPostSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  slug: z.string().min(5, 'Slug must be at least 5 characters.').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens.'),
  content: z.string().min(100, 'Content must be at least 100 characters.'),
});

export const blogPostUpdateSchema = blogPostSchema.extend({
    postId: z.string().min(1, 'Post ID is required.'),
});