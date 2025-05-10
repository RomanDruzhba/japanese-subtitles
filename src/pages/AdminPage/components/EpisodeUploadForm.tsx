import React, { useState } from 'react';
import axios from 'axios';
import { AdminVideo } from '../types';

// const SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Props {
  onUpload: (newVideo: AdminVideo) => void;
}

const EpisodeUploadForm: React.FC<Props> = ({ onUpload }) => {
  const [animeTitle, setAnimeTitle] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subs, setSubs] = useState([
    { lang: 'ru', file: null as File | null },
    { lang: 'jp', file: null as File | null },
  ]);

  const uploadFile = async (file: File, type: 'video' | 'subtitle', episode?: string) => {
    const formData = new FormData();
    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const headers: Record<string, string> = {
      'x-anime-title': safeAnime,
      'x-type': type,
    };

    formData.append('file', file);
    formData.append('animeTitle', safeAnime);
    formData.append('type', type);

    if (episode) headers['x-episode-title'] = episode;

    await axios.post(`${API_BASE_URL}/upload`, formData, { headers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const safeEpisode = episodeTitle.trim().replace(/\s+/g, '_');

    try {
      if (!animeTitle || !episodeTitle) return alert('Введите название аниме и эпизода');

      const subtitlePaths: AdminVideo['subtitles'] = [];

      if (videoFile) {
        await uploadFile(videoFile, 'video', safeEpisode);
      }

      for (const s of subs) {
        if (s.file) {
          await uploadFile(s.file, 'subtitle', safeEpisode);

          const ext = s.file.name.split('.').pop();
          const rawName = s.file.name.replace(/\.[^/.]+$/, '');
          const safeName = rawName.trim().replace(/\s+/g, '_');

          subtitlePaths.push({
            lang: s.lang,
            url: `${safeAnime}/subs/${safeEpisode}/${safeName}.${ext}`,
          });
        }
      }

      onUpload({
        id: Date.now(),
        animeTitle: safeAnime,
        episodeTitle: safeEpisode,
        videoUrl: videoFile ? `${safeAnime}/${safeEpisode}.webm` : '---',
        subtitles: subtitlePaths,
      });

      alert('Эпизод успешно загружен!');
      setAnimeTitle('');
      setEpisodeTitle('');
      setVideoFile(null);
      setSubs([{ lang: 'ru', file: null }, { lang: 'jp', file: null }]);
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Название аниме</label>
      <input className="w-full border p-2 rounded" value={animeTitle} onChange={(e) => setAnimeTitle(e.target.value)} />

      <label>Название эпизода</label>
      <input className="w-full border p-2 rounded" value={episodeTitle} onChange={(e) => setEpisodeTitle(e.target.value)} />

      <label>Видео (.webm/.mp4)</label>
      <input type="file" accept=".webm,.mp4" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />

      <label>Субтитры</label>
      {subs.map((s, idx) => (
        <div key={idx} className="flex gap-2 mb-2">
          <input
            className="w-1/3 p-2 border rounded"
            value={s.lang}
            onChange={(e) => {
              const updated = [...subs];
              updated[idx].lang = e.target.value;
              setSubs(updated);
            }}
          />
          <input
            className="w-2/3"
            type="file"
            accept=".vtt"
            onChange={(e) => {
              const updated = [...subs];
              updated[idx].file = e.target.files?.[0] || null;
              setSubs(updated);
            }}
          />
        </div>
      ))}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Добавить эпизод</button>
    </form>
  );
};

export default EpisodeUploadForm;
