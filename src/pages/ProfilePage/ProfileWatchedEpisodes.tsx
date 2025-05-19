import React from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const ProfileWatchedEpisodes = ({ episodes, setEpisodes }: any) => {
  const handleToggle = async (episodeId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/watched-episodes/${episodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: !currentStatus }),
      });

      if (res.ok) {
        setEpisodes((prev: any[]) =>
          prev.map(ep => ep.id === episodeId ? { ...ep, watched: !currentStatus } : ep)
        );
      }
    } catch (err) {
      console.error('Ошибка обновления статуса эпизода', err);
    }

  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Просмотренные эпизоды</h3>
      {episodes.length === 0 ? (
        <p>Вы ещё ничего не посмотрели.</p>
      ) : (
        episodes.map((episode: any) => (
          <div key={episode.id} className="border-b py-4">
            <p><strong>Аниме:</strong> {episode.animeTitle}</p>
            <p><strong>Эпизод:</strong> {episode.episodeTitle}</p>
            <button
              onClick={() => handleToggle(episode.id, episode.watched)}
              className={`mt-2 px-4 py-2 rounded text-white ${ episode.watched ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700' }`}
            >
              {episode.watched ? 'Отметить как не просмотренный' : 'Отметить как просмотренный'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ProfileWatchedEpisodes;