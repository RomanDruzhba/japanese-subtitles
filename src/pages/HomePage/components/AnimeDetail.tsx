/* components/AnimeDetail.tsx */
import React from 'react';
import StarRating from '../../../components/StarRating';
import EpisodeList from './EpisodeList';
import { Anime, Episode } from '../types/types';

interface Props {
  anime: Anime;
  episodes: Episode[];
  userRating: number;
  averageRating: number | null;
  currentUser: any;
  onBack: () => void;
  onRate: (rating: number) => void;
}

const AnimeDetail: React.FC<Props> = ({ anime, episodes, userRating, averageRating, currentUser, onBack, onRate }) => (
  <div className="mb-6">
    <button
      onClick={onBack}
      className="mb-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
    >
      Назад
    </button>
    <h2 className="text-2xl font-bold mb-2">{anime.title.replace(/_/g, ' ')}</h2>
    <p className="text-gray-700">{anime.description}</p>
    <div className="mb-4">
      {currentUser && (
        <div className="flex items-center gap-2 mb-2">
          <span className="font-medium">Ваша оценка:</span>
          <StarRating value={userRating} onChange={onRate} />
        </div>
      )}
      {averageRating !== null && (
        <p className="text-gray-700">Общая оценка: {averageRating.toFixed(1)} ★</p>
      )}

      <h3 className="text-xl font-semibold mb-2">Серии:</h3>
      <EpisodeList episodes={episodes} />
    </div>
  </div>
);

export default AnimeDetail;