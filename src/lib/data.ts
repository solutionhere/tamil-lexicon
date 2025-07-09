import type { Category, Location, Word, Quiz, QuizScore, BlogPost } from '@/lib/types';

export const categories: Category[] = [
  { id: 'college', name: 'College Slang', icon: 'GraduationCap' },
  { id: 'chennai', name: 'Chennai Slang', icon: 'Building' },
  { id: 'general', name: 'General', icon: 'MessageCircle' },
];

export const locations: Location[] = [
  { id: 'india', name: 'India' },
  { id: 'tn', name: 'Tamil Nadu', parent: 'india' },
  { id: 'chennai', name: 'Chennai', parent: 'tn' },
  { id: 'coimbatore', name: 'Coimbatore', parent: 'tn' },
  { id: 'sri-lanka', name: 'Sri Lanka' },
  { id: 'jaffna', name: 'Jaffna', parent: 'sri-lanka' },
];

export const words: Word[] = [
  {
    id: '1',
    tamil: 'மச்சி',
    transliteration: 'Machi',
    definition: 'A friendly term for a friend, similar to "dude" or "bro".',
    example: {
      tamil: 'என்ன மச்சி, எப்படி இருக்க?',
      english: 'Hey dude, how are you?',
    },
    pronunciation: '/mətʃi/',
    category: 'general',
    location: 'tn',
    status: 'published',
    isFlagged: false,
  },
  {
    id: '2',
    tamil: 'கலாய்',
    transliteration: 'Kalaai',
    definition: 'To tease or make fun of someone, usually in a light-hearted way.',
    example: {
      tamil: 'அவன் நண்பனை கலாய்த்தான்.',
      english: 'He teased his friend.',
    },
    pronunciation: '/kəlaɪ/',
    category: 'college',
    location: 'chennai',
    status: 'published',
    isFlagged: false,
    submittedBy: 'SAMPLE_USER_ID',
  },
  {
    id: '3',
    tamil: 'கேவலம்',
    transliteration: 'Kevalam',
    definition: 'Something that is awful, disgusting, or of very poor quality.',
    example: {
      tamil: 'அந்த படம் ரொம்ப கேவலமா இருந்தது.',
      english: 'That movie was terrible.',
    },
    pronunciation: '/keːvələm/',
    category: 'general',
    location: 'tn',
    status: 'published',
    isFlagged: true,
  },
  {
    id: '4',
    tamil: 'மொக்கை',
    transliteration: 'Mokkai',
    definition: 'A term for a bad joke or a boring/lame thing.',
    example: {
      tamil: 'அவன் சொன்னது மொக்கை ஜோக்.',
      english: 'What he said was a lame joke.',
    },
    pronunciation: '/mo̞kːaɪ/',
    category: 'college',
    location: 'coimbatore',
    status: 'published',
    isFlagged: false,
  },
    {
    id: '5',
    tamil: 'பேஜார்',
    transliteration: 'Bejaar',
    definition: 'To cause trouble or annoyance.',
    example: {
      tamil: 'அவன் எனக்கு ரொம்ப பேஜார் பண்ணிட்டான்.',
      english: 'He caused me a lot of trouble.',
    },
    pronunciation: '/beːdʒaːr/',
    category: 'chennai',
    location: 'chennai',
    status: 'pending',
    isFlagged: false,
    submittedBy: 'SAMPLE_USER_ID',
  },
];

export const quizzes: Quiz[] = [
    {
        id: 'quiz-1',
        title: 'Chennai Slang Challenge',
        status: 'live',
        questions: [
            {
                id: 'q1',
                text: 'What does the word "Machi" mean?',
                options: ['Enemy', 'Friend/Dude', 'Teacher', 'Food'],
                correctAnswerIndex: 1,
                timeLimitSeconds: 15,
            },
            {
                id: 'q2',
                text: 'If someone is "Kalaai"-ing you, what are they doing?',
                options: ['Praising you', 'Ignoring you', 'Teasing you', 'Helping you'],
                correctAnswerIndex: 2,
                timeLimitSeconds: 15,
            },
            {
                id: 'q3',
                text: 'A "Mokkai" joke is...',
                options: ['A very clever joke', 'A political joke', 'An old joke', 'A lame joke'],
                correctAnswerIndex: 3,
                timeLimitSeconds: 15,
            },
        ],
    },
    {
        id: 'quiz-2',
        title: 'General Knowledge Quiz',
        status: 'draft',
        questions: [],
    }
];

export const quizScores: QuizScore[] = [
    { id: 's1', quizId: 'quiz-1', userId: 'user1', userName: 'SuperPlayer', score: 3 },
    { id: 's2', quizId: 'quiz-1', userId: 'user2', userName: 'QuizMaster', score: 2 },
    { id: 's3', quizId: 'quiz-1', userId: 'user3', userName: 'Newbie', score: 1 },
    { id: 's4', quizId: 'quiz-1', userId: 'user4', userName: 'ProGamer', score: 3 },
    { id: 's5', quizId: 'quiz-1', userId: 'user5', userName: 'LingoFan', score: 2 },
    { id: 's6', quizId: 'quiz-1', userId: 'user6', userName: 'WordSmith', score: 1 },
    { id: 's7', quizId: 'quiz-1', userId: 'user7', userName: 'SlangKing', score: 3 },
    { id: 's8', quizId: 'quiz-1', userId: 'user8', userName: 'Lexi', score: 2 },
    { id: 's9', quizId: 'quiz-1', userId: 'user9', userName: 'Raja', score: 1 },
    { id: 's10', quizId: 'quiz-1', userId: 'user10', userName: 'Rani', score: 3 },
    { id: 's11', quizId: 'quiz-1', userId: 'user11', userName: 'Player11', score: 0 },
    { id: 's12', quizId: 'quiz-1', userId: 'user12', userName: 'Player12', score: 2 },
];

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'why-tamil-slang-is-awesome',
    title: 'Why Tamil Slang is Awesome and Worth Documenting',
    content: `Tamil, one of the world's oldest living languages, has a rich and vibrant tapestry of slang that evolves with every generation. From the bustling streets of Chennai to the college campuses of Coimbatore, colloquialisms add color, humor, and a unique identity to everyday conversations.\n\nThis lexicon is our attempt to capture this dynamic part of our culture. Slang isn't just "improper" language; it's a living record of our times, reflecting our social dynamics, pop culture, and shared experiences.\n\nBy documenting these words, we preserve a piece of our identity for future generations. So next time you hear someone say "Machi," you'll know you're part of a rich linguistic tradition.`,
    publishedAt: '2024-07-20T10:00:00Z',
    author: {
      name: 'The Lexicon Team',
    },
  },
  {
    id: 'post-2',
    slug: 'top-5-chennai-slang-words',
    title: 'Top 5 Chennai Slang Words You Should Know',
    content: `Heading to Chennai? Get ready to immerse yourself in a unique linguistic landscape. Here are five essential slang words to get you started:\n\n1.  **Machi**: The quintessential term for a friend. Use it liberally!\n2.  **Kalaai**: Light-hearted teasing among friends. A cornerstone of friendly banter.\n3.  **Bejaar**: When something is extremely annoying or troublesome.\n4.  **Gethu**: Means "style" or "swag." Used to describe something cool or impressive.\n5.  **Vetti**: Refers to being idle or doing nothing productive.\n\nMaster these, and you'll be speaking like a local in no time!`,
    publishedAt: '2024-07-15T12:30:00Z',
    author: {
      name: 'The Lexicon Team',
    },
  },
];
