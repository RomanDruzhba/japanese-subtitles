import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnimeList from './components/AnimeList';
import AnimeDetail from './components/AnimeDetail';
import FiltersSidebar from './components/FiltersSidebar';
import { getCurrentUser } from '../../auth';
import { Anime, Episode } from './types/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const HomePage: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const currentUser = getCurrentUser();

  const [genres, setGenres] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [openFilter, setOpenFilter] = useState<'genres' | 'tags' | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/animes`)
      .then(res => res.json())
      .then(data => {
        setAnimes(data);
        const uniqueGenres = new Set<string>();
        const uniqueTags = new Set<string>();
        data.forEach((anime: Anime) => {
          anime.genres?.forEach(g => uniqueGenres.add(g.name));
          anime.tags?.forEach(t => uniqueTags.add(t.name));
        });
        setGenres(Array.from(uniqueGenres));
        setTags(Array.from(uniqueTags));
      })
      .catch(err => console.error('Ошибка при загрузке аниме:', err));

    const genresFromParams = searchParams.getAll('genres');
    const tagsFromParams = searchParams.getAll('tags');
    setSelectedGenres(genresFromParams);
    setSelectedTags(tagsFromParams);
  }, []);

  useEffect(() => {
    if (!selectedAnime) return;
    fetch(`${API_BASE_URL}/api/animes/${selectedAnime.id}/rating?userId=${currentUser?.id}`)
      .then(res => res.json())
      .then(({ average, user }) => {
        setAverageRating(average);
        setUserRating(user);
      });
  }, [selectedAnime]);

  const handleGenreChange = (genre: string) => {
    const updatedGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter(g => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(updatedGenres);
    searchParams.delete('genres');
    updatedGenres.forEach(g => searchParams.append('genres', g));
    setSearchParams(searchParams);
  };

  const handleTagChange = (tag: string) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    searchParams.delete('tags');
    updatedTags.forEach(t => searchParams.append('tags', t));
    setSearchParams(searchParams);
  };

  const resetFilters = () => {
    setSelectedGenres([]);
    setSelectedTags([]);
    searchParams.delete('genres');
    searchParams.delete('tags');
    setSearchParams(searchParams);
  };

  const handleAnimeClick = async (anime: Anime) => {
    setSelectedAnime(anime);
    try {
      const res = await fetch(`${API_BASE_URL}/api/animes/${anime.id}/episodes`);
      const data = await res.json();
      const episodesWithRatings = await Promise.all(
        data.map(async (ep: Episode) => {
          const res = await fetch(`${API_BASE_URL}/api/episodes/${ep.id}/rating`);
          const { average } = await res.json();
          return { ...ep, rating: average };
        })
      );
      setEpisodes(episodesWithRatings);
    } catch (err) {
      console.error('Ошибка при загрузке эпизодов:', err);
    }
  };

  const handleSetAnimeRating = async (rating: number) => {
    if (!currentUser || !selectedAnime) return alert('Войдите, чтобы поставить оценку');
    await fetch(`${API_BASE_URL}/api/animes/${selectedAnime.id}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, rating }),
      credentials: 'include',
    });
    setUserRating(rating);
    const res = await fetch(`${API_BASE_URL}/api/animes/${selectedAnime.id}/rating`);
    const { average } = await res.json();
    setAverageRating(average);

    setAnimes(prev => prev.map(a => a.id === selectedAnime.id ? { ...a, rating: average } : a));
    setSelectedAnime(prev => prev ? { ...prev, rating: average } : null);
  };

  const filteredAnimes = animes.filter(anime => {
    const matchGenre = selectedGenres.length === 0 || anime.genres?.some(g => selectedGenres.includes(g.name));
    const matchTag = selectedTags.length === 0 || anime.tags?.some(t => selectedTags.includes(t.name));
    return matchGenre && matchTag;
  });

  return (
    <div className="flex">
      <FiltersSidebar
        genres={genres}
        tags={tags}
        selectedGenres={selectedGenres}
        selectedTags={selectedTags}
        openFilter={openFilter}
        setOpenFilter={setOpenFilter}
        onGenreChange={handleGenreChange}
        onTagChange={handleTagChange}
        onReset={resetFilters}
      />
      <main className="flex-1 p-4">
        {!selectedAnime ? (
          <AnimeList
            animes={filteredAnimes.slice(0, 8)}
            onAnimeClick={handleAnimeClick}
            onTagClick={(tag: string) => setSelectedTags([tag])}
          />
        ) : (
          <AnimeDetail
            anime={selectedAnime}
            episodes={episodes}
            onBack={() => setSelectedAnime(null)}
            currentUser={currentUser}
            userRating={userRating}
            averageRating={averageRating}
            onRate={handleSetAnimeRating}
          />
        )}
      </main>
    </div>
  );
};

export default HomePage;