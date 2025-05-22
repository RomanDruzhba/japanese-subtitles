import React, { useEffect, useState } from 'react';

const API = import.meta.env.VITE_API_BASE_URL || '';

interface Anime {
  id: number;
  title: string;
}

interface Episode {
  id: number;
  title: string;
}

interface WatchedEpisodesFormProps {
  userId: number;
}

const WatchedEpisodesForm: React.FC<WatchedEpisodesFormProps> = ({ userId }) => {
  const [animeSearch, setAnimeSearch] = useState('');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [filteredAnimes, setFilteredAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<Set<number>>(new Set());
  const [showWatched, setShowWatched] = useState(false);
  const [watchedAnimeMap, setWatchedAnimeMap] = useState<Record<number, Episode[]>>({});

  useEffect(() => {
    fetch(`${API}/api/watched`)
      .then(res => res.json())
      .then((data: Anime[]) => setAnimeList(data));
  }, []);

  useEffect(() => {
    const searchNormalized = animeSearch.toLowerCase().replace(/ /g, '_');
    setFilteredAnimes(
      animeList.filter(anime =>
        anime.title.toLowerCase().includes(searchNormalized)
      )
    );
  }, [animeSearch, animeList]);

  const handleAnimeSelect = async (anime: Anime) => {
    setSelectedAnime(anime);
    setAnimeSearch(anime.title.replace(/_/g, ' '));
    const res = await fetch(`${API}/api/watched/${anime.id}/episodes`);
    const eps: Episode[] = await res.json();
    setEpisodes(eps);

    const watchedRes = await fetch(`${API}/api/watched/${userId}/watched?animeId=${anime.id}`);
    const watched: { episodeId: number }[] = await watchedRes.json();
    setWatchedEpisodes(new Set(watched.map(w => w.episodeId)));
  };

  const toggleEpisode = async (episodeId: number) => {
    if (!selectedAnime) return;

    const isWatched = watchedEpisodes.has(episodeId);
    const method = isWatched ? 'DELETE' : 'POST';

    const res = await fetch(`${API}/api/watched/watched-episodes`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        animeId: selectedAnime.id,
        episodeId,
      }),
    });

    if (res.ok) {
      const newSet = new Set(watchedEpisodes);
      if (isWatched) newSet.delete(episodeId);
      else newSet.add(episodeId);
      setWatchedEpisodes(newSet);
    }
  };

  const loadAllWatchedAnime = async () => {
    setShowWatched(true);
    const result: Record<number, Episode[]> = {};

    for (const anime of animeList) {
      const watchedRes = await fetch(`${API}/api/watched/${userId}/watched?animeId=${anime.id}`);
      const watched: { episodeId: number }[] = await watchedRes.json();
      if (watched.length > 0) {
        const epsRes = await fetch(`${API}/api/watched/${anime.id}/episodes`);
        const eps: Episode[] = await epsRes.json();
        result[anime.id] = eps;
      }
    }

    setWatchedAnimeMap(result);
  };

  return (
    <div className="p-6 bg-white rounded shadow">
      <h3 className="text-xl mb-4">Добавить просмотренные эпизоды</h3>

      <input
        className="border p-2 w-full mb-2"
        type="text"
        placeholder="Введите название аниме..."
        value={animeSearch}
        onChange={(e) => {
          setAnimeSearch(e.target.value);
          setSelectedAnime(null);
          setEpisodes([]);
          setShowWatched(false);
        }}
      />

      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={loadAllWatchedAnime}
      >
        Показать просмотренные аниме
      </button>

      {!selectedAnime && animeSearch.trim().length > 0 && (
        <div className="border rounded bg-gray-100 max-h-40 overflow-y-auto">
          {filteredAnimes.map((anime) => (
            <div
              key={anime.id}
              onClick={() => handleAnimeSelect(anime)}
              className="p-2 hover:bg-gray-200 cursor-pointer"
            >
              {anime.title.replace(/_/g, ' ')}
            </div>
          ))}
        </div>
      )}

      {selectedAnime && (
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Эпизоды {selectedAnime.title.replace(/_/g, ' ')}</h4>
          <div className="grid gap-2">
            {episodes.map((ep) => (
              <label key={ep.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={watchedEpisodes.has(ep.id)}
                  onChange={() => toggleEpisode(ep.id)}
                />
                {ep.title}
              </label>
            ))}
          </div>
        </div>
      )}

      {showWatched && (
        <div className="mt-6">
          <h4 className="text-lg font-bold mb-2">Просмотренные аниме:</h4>
          {Object.entries(watchedAnimeMap).map(([animeId, eps]) => {
            const anime = animeList.find(a => a.id === parseInt(animeId));
            if (!anime) return null;
            return (
              <div key={anime.id} className="mb-4">
                <h5 className="font-semibold">{anime.title.replace(/_/g, ' ')}</h5>
                <ul className="list-disc pl-6">
                  {eps.map(ep => (
                    <li key={ep.id}>{ep.title}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchedEpisodesForm;
