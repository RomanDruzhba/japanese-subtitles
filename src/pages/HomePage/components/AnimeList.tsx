/* components/AnimeList.tsx */
import React from 'react';
import { Anime } from '../types/types';
import AnimeCard from './AnimeCard';

interface Props {
  animes: Anime[];
  onAnimeClick: (anime: Anime) => void;
  onTagClick: (tag: string) => void;
}

const AnimeList: React.FC<Props> = ({ animes, onAnimeClick, onTagClick }) => (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
    {animes.map(anime => (
      <AnimeCard
        key={anime.id}
        anime={anime}
        onClick={onAnimeClick}
        onTagClick={onTagClick}
      />
    ))}
  </div>
);

export default AnimeList;