import React, { useState, useEffect } from 'react';
import axios from 'axios';

type GenreOrTag = {
  id: string;
  name: string;
};

// const SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const DescriptionUploadForm: React.FC = () => {
  const [animeTitle, setAnimeTitle] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState<File | null>(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [genres, setGenres] = useState<GenreOrTag[]>([]);
  const [tags, setTags] = useState<GenreOrTag[]>([]);
  const [released, setReleased] = useState('');
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    axios.get<GenreOrTag[]>(`${API_BASE_URL}/genres`).then((res) => setGenres(res.data));
    axios.get<GenreOrTag[]>(`${API_BASE_URL}/tags`).then((res) => setTags(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeTitle) return alert('Введите название');

    

    const formData = new FormData();
    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');

    if (poster instanceof File) {
      formData.append('file', poster);
    }

    formData.append('animeTitle', safeAnime);
    formData.append('type', 'poster');
    formData.append('description', description);
    formData.append('genres', JSON.stringify(selectedGenres));
    formData.append('tags', JSON.stringify(selectedTags));
    formData.append('released', released);
    formData.append('finished', String(finished));

    try {
      await axios.post(`${API_BASE_URL}/upload/description`, formData, {
        headers: {
          'x-anime-title': safeAnime,
          'x-type': 'poster',
        },
      });

      alert('Описание успешно добавлено!');
      setAnimeTitle('');
      setDescription('');
      setPoster(null);
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Название аниме</label>
      <input className="w-full border p-2 rounded" value={animeTitle} onChange={(e) => setAnimeTitle(e.target.value)} />

      <label>Описание</label>
      <textarea className="w-full border p-2 rounded" rows={4} value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Жанры</label>
      <select multiple value={selectedGenres} onChange={(e) => setSelectedGenres(Array.from(e.target.selectedOptions, o => o.value))} className="w-full border p-2 rounded">
        {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
      </select>

      <label>Теги</label>
      <select multiple value={selectedTags} onChange={(e) => setSelectedTags(Array.from(e.target.selectedOptions, o => o.value))} className="w-full border p-2 rounded">
        {tags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>

      <label>Дата выхода</label>
      <input
        type="date"
        className="w-full border p-2 rounded"
        value={released}
        onChange={(e) => setReleased(e.target.value)}
      />

      <label>Завершено</label>
      <input
        type="checkbox"
        checked={finished}
        onChange={(e) => setFinished(e.target.checked)}
      />

      <label>Обложка</label>
      <input type="file" accept="image/*" onChange={(e) => setPoster(e.target.files?.[0] || null)} />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Добавить описание</button>
    </form>
  );
};

export default DescriptionUploadForm;
