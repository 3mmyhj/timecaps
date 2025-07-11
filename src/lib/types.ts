export type JournalEntry = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imageHint?: string;
  unlockDate: Date;
  createdAt: Date;
};
