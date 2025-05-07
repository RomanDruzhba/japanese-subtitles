import React, { useState } from 'react';
import axios from 'axios';
import { AdminVideo } from '../types';

const SERVER_URL = 'http://localhost:3000';

interface UploadFormProps {
  onUpload: (newVideo: AdminVideo) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [activeTab, setActiveTab] = useState<'episode' | 'description'>('episode');

  const [animeTitle, setAnimeTitle] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subs, setSubs] = useState([
    { lang: 'ru', file: null as File | null },
    { lang: 'jp', file: null as File | null },
  ]);
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState<File | null>(null);

  const uploadFile = async (file: File, type: 'video' | 'subtitle' | 'poster', episode?: string) => {
    const formData = new FormData();
    formData.append('file', file);

    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const headers: Record<string, string> = {
      'x-anime-title': safeAnime,
      'x-type': type,
    };

    formData.append('animeTitle', safeAnime);
    formData.append('type', type);
    if (type === 'poster') {
      formData.append('description', description);
    }
    if (episode) headers['x-episode-title'] = episode;

    await axios.post(`${SERVER_URL}/upload`, formData, { headers });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const safeEpisode = episodeTitle.trim().replace(/\s+/g, '_');

    try {
      if (activeTab === 'description') {
        if (!animeTitle.trim()) return alert('Введите название аниме');
        if (!poster) return alert('Добавьте обложку');
        await uploadFile(poster, 'poster');
        alert('Описание успешно добавлено!');
      } else {
        if (!animeTitle.trim() || !episodeTitle.trim()) return alert('Введите название аниме и эпизода');

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

        const newVideo: AdminVideo = {
          id: Date.now(),
          animeTitle: safeAnime,
          episodeTitle: safeEpisode,
          videoUrl: videoFile ? `${safeAnime}/${safeEpisode}.webm` : '---',
          subtitles: subtitlePaths,
        };

        onUpload(newVideo);
        alert('Эпизод успешно загружен!');
      }

      // reset
      setAnimeTitle('');
      setEpisodeTitle('');
      setVideoFile(null);
      setSubs([{ lang: 'ru', file: null }, { lang: 'jp', file: null }]);
      setDescription('');
      setPoster(null);
    } catch (err) {
      console.error(err);
      alert('Ошибка при загрузке!');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('episode')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'episode' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Загрузка нового эпизода
        </button>
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Добавление описания
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Название аниме</label>
          <input
            value={animeTitle}
            onChange={(e) => setAnimeTitle(e.target.value)}
            required
            className="w-full p-2 border rounded-md shadow-sm"
          />
        </div>

        {activeTab === 'episode' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Название эпизода</label>
              <input
                value={episodeTitle}
                onChange={(e) => setEpisodeTitle(e.target.value)}
                required
                className="w-full p-2 border rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Видео (.webm/.mp4)</label>
              <input
                type="file"
                accept=".webm,.mp4"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Субтитры</h4>
              {subs.map((s, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <input
                    value={s.lang}
                    onChange={(e) => {
                      const updated = [...subs];
                      updated[idx].lang = e.target.value;
                      setSubs(updated);
                    }}
                    placeholder="Язык"
                    className="w-1/3 p-2 border rounded-md"
                  />
                  <input
                    type="file"
                    accept=".vtt"
                    onChange={(e) => {
                      const updated = [...subs];
                      updated[idx].file = e.target.files?.[0] || null;
                      setSubs(updated);
                    }}
                    className="w-2/3 text-sm"
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Описание</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-2 border rounded-md shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Обложка</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPoster(e.target.files?.[0] || null)}
              />
            </div>
          </>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">
          {activeTab === 'episode' ? 'Добавить эпизод' : 'Добавить описание'}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;
