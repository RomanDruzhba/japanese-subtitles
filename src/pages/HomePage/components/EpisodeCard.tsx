/* components/EpisodeCard.tsx */
import React from 'react';
import { Link } from 'react-router-dom';
import { Episode } from '../types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const EpisodeCard: React.FC<{ episode: Episode }> = ({ episode }) => (
  <Link to={`/video?vid=${episode.id}`} className="text-inherit no-underline">
    <div className="border border-gray-200 rounded-xl bg-white shadow p-4 hover:shadow-md transition">
      <h4 className="text-lg font-medium mb-2">{episode.title}</h4>
      <p className="text-sm text-gray-700 mb-1">
        Субтитры: {episode.subtitles?.map(s => s.lang.toUpperCase()).join(', ') || 'нет'}
      </p>
      <video
        src={`${API_BASE_URL}${episode.videoUrl}#t=15`}
        className="w-full h-48 object-cover rounded-md mb-2"
        onError={(e) => console.error('Ошибка загрузки видео:', e)}
      />
      {episode.rating !== undefined && (
        <p className="text-sm text-yellow-600 font-medium mb-1">★ {episode.rating.toFixed(1)}</p>
      )}
    </div>
  </Link>
);

export default EpisodeCard;