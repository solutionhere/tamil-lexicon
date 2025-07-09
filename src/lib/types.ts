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
