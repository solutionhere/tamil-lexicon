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
  slug: string;
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
  createdAt: Timestamp | string; // Can be string on client
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
    scheduledFor?: Timestamp;
};

export type QuizScore = {
    id: string;
    quizId: string;
    userId: string;
    userName: string;
    score: number;
    createdAt: Timestamp | string; // Can be string on client
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  publishedAt: Timestamp | string; // Can be string on client, Timestamp from server
  status?: 'published' | 'draft';
  author: {
    name: string;
    avatarUrl?: string;
  };
};

export type UserRole = 'user' | 'admin' | 'superadmin';

export type UserProfile = {
    role: UserRole;
};
