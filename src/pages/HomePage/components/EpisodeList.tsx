/* components/EpisodeList.tsx */
import React from 'react';
import { Episode } from '../types/types';
import EpisodeCard from './EpisodeCard';

const EpisodeList: React.FC<{ episodes: Episode[] }> = ({ episodes }) => (
  <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    {episodes.map(ep => (
      <EpisodeCard key={ep.id} episode={ep} />
    ))}
  </div>
);

export default EpisodeList;