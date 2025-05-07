import React, { useState } from 'react';
import axios from 'axios';
import { AdminVideo } from '../types';

const SERVER_URL = 'http://localhost:3000';

interface UploadFormProps {
  onUpload: (newVideo: AdminVideo) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [animeTitle, setAnimeTitle] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subs, setSubs] = useState([
    { lang: 'ru', file: null as File | null },
    { lang: 'jp', file: null as File | null },
  ]);

  const uploadFile = async (file: File, type: 'video' | 'subtitle', episode?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const headers: Record<string, string> = {
      'x-anime-title': safeAnime,
      'x-type': type,
    };

    if (type === 'subtitle' && episode) {
      headers['x-episode-title'] = episode;
    }

    await axios.post(`${SERVER_URL}/upload`, formData, { headers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!animeTitle.trim() || !episodeTitle.trim()) {
      return alert('Введите название аниме и эпизода');
    }

    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const safeEpisode = episodeTitle.trim().replace(/\s+/g, '_');

    try {
      const subtitlePaths: AdminVideo['subtitles'] = [];

      if (videoFile) {
        await uploadFile(videoFile, 'video');
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

      const newVideo: AdminVideo = {
        id: Date.now(),
        animeTitle: safeAnime,
        episodeTitle: safeEpisode,
        videoUrl: videoFile ? `${safeAnime}/${safeEpisode}.webm` : '---',
        subtitles: subtitlePaths,
      };

      onUpload(newVideo);

      setAnimeTitle('');
      setEpisodeTitle('');
      setVideoFile(null);
      setSubs([{ lang: 'ru', file: null }, { lang: 'jp', file: null }]);

      alert('Файлы успешно загружены!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке файлов!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">Загрузка нового эпизода</h3>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Название аниме</label>
        <input
          value={animeTitle}
          onChange={(e) => setAnimeTitle(e.target.value)}
          placeholder="Пример: Naruto"
          required
          className="w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Название эпизода</label>
        <input
          value={episodeTitle}
          onChange={(e) => setEpisodeTitle(e.target.value)}
          placeholder="Пример: Эпизод 1"
          required
          className="w-full p-2 border rounded-md shadow-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Файл видео (.webm, .mp4)</label>
        <input
          type="file"
          accept=".webm,.mp4"
          onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-gray-500"
        />
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Субтитры</h4>
        <div className="space-y-3">
          {subs.map((s, idx) => (
            <div key={idx} className="flex gap-2">
              <input
                value={s.lang}
                onChange={(e) => {
                  const newSubs = [...subs];
                  newSubs[idx].lang = e.target.value;
                  setSubs(newSubs);
                }}
                placeholder="Язык (ru, jp)"
                required
                className="w-1/3 p-2 border rounded-md"
              />
              <input
                type="file"
                accept=".vtt"
                onChange={(e) => {
                  const newSubs = [...subs];
                  newSubs[idx].file = e.target.files?.[0] || null;
                  setSubs(newSubs);
                }}
                className="w-2/3 text-sm text-gray-500"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Добавить эпизод
      </button>
    </form>
  );
};

export default UploadForm;