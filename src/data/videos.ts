export interface VideoItem {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    path: string;
  }
  
  export const videoList: VideoItem[] = [
    {
      id: 'video1',
      title: 'Boku dake ga Inai Machi 01',
      description: 'Первый эпизод аниме "Город, в котором меня нет".',
      thumbnail: 'https://i.imgur.com/Qj3oFfM.jpg',
      path: '/video?vid=1',
    },
    {
      id: 'video2',
      title: 'Demo Video 02',
      description: 'Второй демонстрационный ролик.',
      thumbnail: 'https://i.imgur.com/g1Xd8Nl.jpg',
      path: '/video?vid=2',
    },
  ];
  