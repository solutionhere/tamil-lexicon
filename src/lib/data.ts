import type { Category, Location, Word } from '@/lib/types';

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
