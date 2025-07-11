import type { Timestamp } from 'firebase/firestore';

export type Category = {
  id: string;
  name: string;
  icon?: string;
};

export type Location = {
  id:string;
  name: string;
  parent?: string;
};

export type Word = {
  id: string;
  tamil: string;
  transliteration: string;
  definition: string;
  example: {
    tamil: string;
    english: string;
  };
  pronunciation: string;
  category: string; // category id
  location: string; // location id
  tags?: string[]; // New field for tags
  status: 'published' | 'pending';
  isFlagged?: boolean;
  userId?: string;
  createdAt: Timestamp | Date;
};

export type QuizQuestion = {
    text: string;
    options: string[];
    correctAnswerIndex: number;
    timeLimitSeconds: number;
};

export type Quiz = {
    id: string;
    title: string;
    questions: QuizQuestion[];
    status: 'draft' | 'live' | 'completed';
    scheduledFor?: Date;
};

export type QuizScore = {
    id: string;
    quizId: string;
    userId: string;
    userName: string;
    score: number;
    createdAt: Timestamp | Date;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: string; // ISO date string, but from Firestore Timestamp
  author: {
    name: string;
    avatarUrl?: string;
  };
};

export type UserRole = 'user' | 'admin' | 'superadmin';

export type UserProfile = {
    role: UserRole;
};
