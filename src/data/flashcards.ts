export interface Flashcard {
    id: number;
    front: string;
    back: string;
  }
  
  export const flashcards: Flashcard[] = [
    { id: 1, front: '学校', back: 'школа' },
    { id: 2, front: '先生', back: 'учитель' },
    { id: 3, front: '学生', back: 'ученик' },
    { id: 4, front: '日本語', back: 'японский язык' },
    { id: 5, front: '勉強', back: 'учёба' },
  ];
  
  export type FlashcardStatus = 'known' | 'unknown';
  