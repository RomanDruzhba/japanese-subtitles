import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import { isAdmin, logout } from '../../server/routes/auth';

interface AdminVideo {
  id: number;
  animeTitle: string;
  episodeTitle: string;
  videoUrl: string;
  subtitles: {
    lang: string;
    url: string;
  }[];
}

const STORAGE_KEY = 'admin_videos';
const SERVER_URL = 'http://localhost:3000';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [allVideos, setAllVideos] = useState<AdminVideo[]>([]);
  const [expandedAnime, setExpandedAnime] = useState<string | null>(null);

  const [animeTitle, setAnimeTitle] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subs, setSubs] = useState([{ lang: 'ru', file: null as File | null }, { lang: 'jp', file: null as File | null }]);
  const [filter, setFilter] = useState('');

  const refreshAllVideos = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/videos`);
      setAllVideos(res.data as AdminVideo[]);
    } catch (err) {
      console.error('Ошибка при загрузке всех эпизодов:', err);
    }
  };

  useEffect(() => {
    // if (!isAdmin()) {
    //   navigate('/');
    //   return;
    // }
  
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setVideos(JSON.parse(saved) as AdminVideo[]);
  
    refreshAllVideos();
  }, []);

  
  

  const saveToStorage = (updated: AdminVideo[]) => {
    setVideos(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

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
  
    await axios.post(`${SERVER_URL}/upload`, formData, {
      headers
    });
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
  
      // Загружаем видео, если выбран
      if (videoFile) {
        await uploadFile(videoFile, 'video');
      }
  
      // Загружаем только те субтитры, что выбраны
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
  
      const updated = [...videos, newVideo];
      saveToStorage(updated);
      await refreshAllVideos();
  
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

  const handleDelete = async (video: AdminVideo, fromAll: boolean) => {
    try {
      const safeAnime = video.animeTitle.trim().replace(/\s+/g, '_');
      const safeEpisode = video.episodeTitle.trim().replace(/\s+/g, '_');
  
      await axios.delete(`${SERVER_URL}/delete`, {
        headers: { 'Content-Type': 'application/json' },
        data: {
          animeTitle: safeAnime,
          episodeTitle: safeEpisode,
        },
      } as any);
  
      if (!fromAll) {
        const updated = videos.filter(v => v.id !== video.id);
        saveToStorage(updated);
      }
  
      // Обновление списка всех видео после удаления
      await refreshAllVideos();
  
    } catch (err) {
      console.error('Ошибка при удалении:', err);
      alert('Ошибка при удалении!');
    }
  };

const normalize = (str: string) => str.toLowerCase().replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

const normalizedFilter = normalize(filter);

const grouped = videos
  .filter(v => {
    const anime = normalize(v.animeTitle);
    const episode = normalize(v.episodeTitle);
    return anime.includes(normalizedFilter) || episode.includes(normalizedFilter);
  })
  .reduce((acc, video) => {
    if (!acc[video.animeTitle]) acc[video.animeTitle] = [];
    acc[video.animeTitle].push(video);
    return acc;
  }, {} as Record<string, AdminVideo[]>);

const groupedAll = allVideos
  .filter(v => {
    const anime = normalize(v.animeTitle);
    const episode = normalize(v.episodeTitle);
    return anime.includes(normalizedFilter) || episode.includes(normalizedFilter);
  })
  .reduce((acc, v) => {
    if (!acc[v.animeTitle]) acc[v.animeTitle] = [];
    acc[v.animeTitle].push(v);
    return acc;
  }, {} as Record<string, AdminVideo[]>);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Панель администратора</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
        <input value={animeTitle} onChange={(e) => setAnimeTitle(e.target.value)} placeholder="Название аниме" required />
        <input value={episodeTitle} onChange={(e) => setEpisodeTitle(e.target.value)} placeholder="Название эпизода" required />
        <input type="file" accept=".webm,.mp4" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />

        <h4>Субтитры</h4>
        {subs.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
            <input value={s.lang} onChange={(e) => {
              const newSubs = [...subs];
              newSubs[idx].lang = e.target.value;
              setSubs(newSubs);
            }} placeholder="Язык (ru/jp)" required />
            <input type="file" accept=".vtt" onChange={(e) => {
              const newSubs = [...subs];
              newSubs[idx].file = e.target.files?.[0] || null;
              setSubs(newSubs);
            }} />
          </div>
        ))}
        <button type="submit">Добавить</button>
      </form>

      <hr />
      <h3>Загруженные эпизоды</h3>
      <input type="text" placeholder="Поиск по названию аниме" value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginBottom: '1rem' }} />

      {Object.keys(grouped).length === 0 && <p>Нет эпизодов</p>}
      {Object.entries(grouped).map(([title, episodes]) => (
        <div key={title} style={{ marginBottom: '1rem' }}>
          <h4>{title}</h4>
          <ul>
            {episodes.map((v) => (
              <li key={v.id}>
                <strong>{v.episodeTitle}</strong> — {v.videoUrl}
                <ul>
                  {v.subtitles.map((s, i) => (
                    <li key={i}>{s.lang}: {s.url}</li>
                  ))}
                </ul>
                <button onClick={() => handleDelete(v, false)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <hr />
      <h3>Все эпизоды</h3>
      {Object.keys(groupedAll).length === 0 && <p>Нет эпизодов на сервере</p>}
      {Object.entries(groupedAll).map(([title, episodes]) => (
        <div key={title} style={{ marginBottom: '1rem' }}>
          <h4
            style={{ cursor: 'pointer', color: 'blue' }}
            onClick={() => setExpandedAnime(expandedAnime === title ? null : title)}
          >
            {title}
          </h4>
          {expandedAnime === title && (
            <ul>
              {episodes.map((v, i) => (
                <li key={i}>
                  <strong>{v.episodeTitle}</strong> — {v.videoUrl}
                  <ul>
                    {v.subtitles.map((s, j) => (
                      <li key={j}>{s.lang}: {s.url}</li>
                    ))}
                  </ul>
                  <button onClick={() => handleDelete(v, true)}>Удалить</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* <button onClick={() => { logout(); navigate('/login'); }} style={{ marginTop: '1rem' }}>
        Выйти
      </button> */}
    </div>
  );
};

export default AdminPage;


