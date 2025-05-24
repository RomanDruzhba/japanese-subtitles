// src/types/types.ts

export interface Genre {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}


export interface Anime {
  id: number;
  title: string;
  description: string;
  poster: string | null;
  rating: number;
  released?: string;
  finished?: boolean;
  genres?: { name: string }[];
  tags?: { name: string }[];
}

export interface Episode {
  id: number;
  title: string;
  videoUrl: string;
  subtitles: { lang: string; url: string }[];
  rating?: number;
}