/* components/AnimeCard.tsx */
import React from 'react';
import { Anime } from '../types/types';

interface AnimeCardProps {
  anime: Anime;
  onClick: (anime: Anime) => void;
  onTagClick: (tag: string) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, onClick, onTagClick }) => (
  <div
    className="cursor-pointer border border-gray-200 rounded-xl bg-white shadow-md p-4 hover:shadow-lg transition"
    onClick={() => onClick(anime)}
  >
    {anime.poster && (
      <img
        src={anime.poster}
        alt={anime.title}
        className="w-full h-48 object-cover rounded-md mb-3"
      />
    )}
    <h3 className="text-lg font-semibold mb-1">{anime.title.replace(/_/g, ' ')}</h3>
    <p className="text-sm text-gray-600 mb-2">{anime.description?.slice(0, 80)}...</p>
    <p className="text-sm text-gray-700">
      <span className="font-semibold">Дата выхода:</span>{' '}
      {anime.released ? new Date(anime.released).toLocaleDateString() : 'Неизвестна'}
    </p>
    <p className="text-sm text-gray-700 mb-2">
      <span className="font-semibold">Завершено:</span> {anime.finished ? 'Да' : 'Нет'}
    </p>
    <div className="text-sm text-gray-600 flex flex-wrap gap-1 mb-1">
      {anime.genres?.map((genre, i) => (
        <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">
          {genre.name}
        </span>
      ))}
    </div>
    <div className="text-sm text-gray-600 flex flex-wrap gap-1">
      {anime.tags?.map((tag, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            onTagClick(tag.name);
          }}
          className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-blue-200"
        >
          #{tag.name}
        </button>
      ))}
    </div>
    {anime.rating !== null && (
      <p className="text-sm text-yellow-600 font-medium">★ {anime.rating.toFixed(1)}</p>
    )}
  </div>
);

export default AnimeCard;