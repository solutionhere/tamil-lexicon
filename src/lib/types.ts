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
  status: 'published' | 'pending';
  isFlagged?: boolean;
  submittedBy?: string; // User ID of the submitter
};

// New Types for Quiz feature
export type QuizQuestion = {
    id: string;
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
};
