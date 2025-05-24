export interface AdminVideo {
    id: number;
    animeTitle: string;
    episodeTitle: string;
    videoUrl: string;
    subtitles: {
      lang: string;
      url: string;
    }[];
    }