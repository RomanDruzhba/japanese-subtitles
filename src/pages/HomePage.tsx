import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// const SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Anime {
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

interface Episode {
  id: number;
  title: string;
  videoUrl: string;
  subtitles: { lang: string; url: string }[];
}

const HomePage: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/animes`)
      .then(res => res.json())
      .then(data => setAnimes(data))
      .catch(err => console.error('Ошибка при загрузке аниме:', err));
  }, []);

  const handleAnimeClick = async (anime: Anime) => {
    setSelectedAnime(anime);
    try {
      const res = await fetch(`${API_BASE_URL}/api/animes/${anime.id}/episodes`);
      const data = await res.json();
      setEpisodes(data);
    } catch (error) {
      console.error('Ошибка при загрузке эпизодов:', error);
    }
  };

  const filteredAnimes = selectedTag
    ? animes.filter(a => a.tags?.some(tag => tag.name === selectedTag))
    : animes;

  const displayedAnimes = filteredAnimes.slice(0, 8);

  return (
    <div className="p-4">
      {!selectedAnime ? (
        <>
          <h1 className="text-center text-3xl font-bold mb-6">Аниме-каталог</h1>
          {selectedTag && (
            <div className="mb-4 text-center">
              <span className="mr-2 text-blue-700 font-semibold">Фильтр по тегу: {selectedTag}</span>
              <button
                onClick={() => setSelectedTag(null)}
                className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Сбросить фильтр
              </button>
            </div>
          )}
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {displayedAnimes.map(anime => (
              <div
                key={anime.id}
                onClick={() => handleAnimeClick(anime)}
                className="cursor-pointer border border-gray-200 rounded-xl bg-white shadow-md p-4 hover:shadow-lg transition"
              >
                {anime.poster && (
                  <img
                    src={anime.poster}
                    alt={anime.title}
                    className="w-full h-48 object-cover rounded-md mb-3"
                  />
                )}
                <h3 className="text-lg font-semibold mb-1">{anime.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{anime.description?.slice(0, 80)}...</p>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Дата выхода:</span>{' '}
                  {anime.released ? new Date(anime.released).toLocaleDateString() : 'Неизвестна'}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Завершено:</span>{' '}
                  {anime.finished ? 'Да' : 'Нет'}
                </p>
                <div className="text-sm text-gray-600 flex flex-wrap gap-1 mb-1">
                  {anime.genres?.map((genre, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-xs">{genre.name}</span>
                  ))}
                </div>
                <div className="text-sm text-gray-600 flex flex-wrap gap-1">
                  {anime.tags?.map((tag, i) => (
                    <button
                      key={i}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTag(tag.name);
                      }}
                      className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs hover:bg-blue-200"
                    >
                      #{tag.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => setSelectedAnime(null)}
            className="mb-4 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Назад
          </button>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{selectedAnime.title}</h2>
            <p className="text-gray-700">{selectedAnime.description}</p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {episodes.map(ep => (
              <Link to={`/video?vid=${ep.id}`} key={ep.id} className="text-inherit no-underline">
                <div className="border border-gray-200 rounded-xl bg-white shadow p-4 hover:shadow-md transition">
                  <h4 className="text-lg font-medium mb-2">{ep.title}</h4>
                  <video
                    src={`${API_BASE_URL}${ep.videoUrl}`}
                    controls
                    className="w-full rounded-md mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    Субтитры: {ep.subtitles?.map(s => s.lang.toUpperCase()).join(', ')}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;