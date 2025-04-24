// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getCurrentUser, isAdmin, logout } from '../auth';

// interface AdminVideo {
//   id: number;
//   title: string;
//   videoUrl: string;
//   subtitles: {
//     lang: string;
//     url: string;
//   }[];
// }

// const STORAGE_KEY = 'admin_videos';

// const AdminPage: React.FC = () => {
//   const navigate = useNavigate();
//   const [videos, setVideos] = useState<AdminVideo[]>([]);
//   const [title, setTitle] = useState('');
//   const [videoUrl, setVideoUrl] = useState('');
//   const [subs, setSubs] = useState([{ lang: 'ru', url: '' }, { lang: 'jp', url: '' }]);

//   useEffect(() => {
//     if (!isAdmin()) {
//       navigate('/');
//     }

//     const saved = localStorage.getItem(STORAGE_KEY);
//     if (saved) setVideos(JSON.parse(saved));
//   }, []);

//   const saveToStorage = (updated: AdminVideo[]) => {
//     setVideos(updated);
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     const newVideo: AdminVideo = {
//       id: Date.now(),
//       title,
//       videoUrl,
//       subtitles: [...subs],
//     };

//     const updated = [...videos, newVideo];
//     saveToStorage(updated);

//     setTitle('');
//     setVideoUrl('');
//     setSubs([{ lang: 'ru', url: '' }, { lang: 'jp', url: '' }]);
//   };

//   return (
//     <div style={{ padding: '1rem' }}>
//       <h2>Панель администратора</h2>
//       <p>Добавление видео из папки <code>/mock/</code></p>

//       <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
//         <input
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//           placeholder="Название видео"
//           required
//         />
//         <input
//           value={videoUrl}
//           onChange={(e) => setVideoUrl(e.target.value)}
//           placeholder="Имя видеофайла (пример: Boku dake ga Inai Machi 01.webm)"
//           required
//         />

//         <h4>Субтитры (в /mock/)</h4>
//         {subs.map((s, idx) => (
//           <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
//             <input
//               value={s.lang}
//               onChange={(e) => {
//                 const newSubs = [...subs];
//                 newSubs[idx].lang = e.target.value;
//                 setSubs(newSubs);
//               }}
//               placeholder="Язык (ru/jp)"
//               required
//             />
//             <input
//               value={s.url}
//               onChange={(e) => {
//                 const newSubs = [...subs];
//                 newSubs[idx].url = e.target.value;
//                 setSubs(newSubs);
//               }}
//               placeholder="Имя файла субтитров (пример: video_subs_ru.vtt)"
//               required
//             />
//           </div>
//         ))}

//         <button type="submit">Добавить видео</button>
//       </form>

//       <hr />
//       <h3>Список добавленных видео</h3>
//       <ul>
//         {videos.map((v) => (
//           <li key={v.id}>
//             <strong>{v.title}</strong> — {v.videoUrl}
//             <ul>
//               {v.subtitles.map((s, i) => (
//                 <li key={i}>{s.lang}: {s.url}</li>
//               ))}
//             </ul>
//           </li>
//         ))}
//       </ul>

//       <button onClick={() => { logout(); navigate('/login'); }} style={{ marginTop: '1rem' }}>
//         Выйти
//       </button>
//     </div>
//   );
// };

// export default AdminPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAdmin, logout } from '../auth';


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
const SERVER_URL = 'http://localhost:5000';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<AdminVideo[]>([]);
  const [animeTitle, setAnimeTitle] = useState('');
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subs, setSubs] = useState([{ lang: 'ru', file: null as File | null }, { lang: 'jp', file: null as File | null }]);

  useEffect(() => {
    if (!isAdmin()) {
      navigate('/');
    }

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setVideos(JSON.parse(saved));
  }, []);

  const saveToStorage = (updated: AdminVideo[]) => {
    setVideos(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const uploadFile = async (file: File, type: 'video' | 'subtitle') => {
    const formData = new FormData();
    formData.append('file', file);

    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');

    await axios.post(`${SERVER_URL}/upload`, formData, {
      headers: {
        'x-anime-title': safeAnime,
        'x-type': type
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) return alert('Выберите видеофайл');

    const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
    const safeEpisode = episodeTitle.trim().replace(/\s+/g, '_');
    const videoPath = `${safeAnime}/${safeEpisode}.webm`;

    try {
      await uploadFile(videoFile, 'video');

      const subtitlePaths = [];
      for (const s of subs) {
        if (s.file) {
          await uploadFile(s.file, 'subtitle');

          // Получаем имя так же, как multer создаст на диске
          const ext = s.file.name.split('.').pop();
          const rawName = s.file.name.replace(/\.[^/.]+$/, '');
          const safeName = rawName.trim().replace(/\s+/g, '_');

          subtitlePaths.push({
            lang: s.lang,
            url: `${safeAnime}/subs/${safeName}.${ext}`,
          });
        }
      }

      const newVideo: AdminVideo = {
        id: Date.now(),
        animeTitle: safeAnime,
        episodeTitle: safeEpisode,
        videoUrl: videoPath,
        subtitles: subtitlePaths,
      };

      const updated = [...videos, newVideo];
      saveToStorage(updated);

      // сброс
      setAnimeTitle('');
      setEpisodeTitle('');
      setVideoFile(null);
      setSubs([{ lang: 'ru', file: null }, { lang: 'jp', file: null }]);

      alert('Видео и субтитры успешно загружены!');
    } catch (err) {
      alert('Ошибка при загрузке файлов!');
    }
  };

  const handleDelete = async (video: AdminVideo) => {
    try {
      const safeAnime = video.animeTitle.trim().replace(/\s+/g, '_');
      const safeEpisode = video.episodeTitle.trim().replace(/\s+/g, '_');

      // Удаление видео
      await axios.delete(`${SERVER_URL}/delete`, {
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          animeTitle: safeAnime,
          filename: `${safeEpisode}.webm`,
          type: 'video',
        },
      } as any);

      // Удаление субтитров
      for (const s of video.subtitles) {
        const rawName = s.url.split('/').pop(); // достаём имя файла
        if (!rawName) continue;
      
        const nameOnly = rawName.trim().replace(/\s+/g, '_');
      
        await axios.delete(`${SERVER_URL}/delete`, {
          headers: {
            'Content-Type': 'application/json',
          },
          data: {
            animeTitle: safeAnime,
            filename: nameOnly,
            type: 'subtitle',
          },
        } as any);
      }

      const updated = videos.filter(v => v.id !== video.id);
      saveToStorage(updated);

    } catch (err) {
      console.error('❌ Ошибка при удалении:', err);
      alert('Ошибка при удалении!');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Панель администратора</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
        <input
          value={animeTitle}
          onChange={(e) => setAnimeTitle(e.target.value)}
          placeholder="Название аниме"
          required
        />
        <input
          value={episodeTitle}
          onChange={(e) => setEpisodeTitle(e.target.value)}
          placeholder="Название эпизода"
          required
        />
        <input type="file" accept=".webm,.mp4" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} required />

        <h4>Субтитры</h4>
        {subs.map((s, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={s.lang}
              onChange={(e) => {
                const newSubs = [...subs];
                newSubs[idx].lang = e.target.value;
                setSubs(newSubs);
              }}
              placeholder="Язык (ru/jp)"
              required
            />
            <input
              type="file"
              accept=".vtt"
              onChange={(e) => {
                const newSubs = [...subs];
                newSubs[idx].file = e.target.files?.[0] || null;
                setSubs(newSubs);
              }}
              required
            />
          </div>
        ))}

        <button type="submit">Добавить</button>
      </form>

      <hr />
      <h3>Загруженные эпизоды</h3>
      <ul>
        {videos.map((v) => (
          <li key={v.id}>
            <strong>{v.animeTitle} / {v.episodeTitle}</strong> — {v.videoUrl}
            <ul>
              {v.subtitles.map((s, i) => (
                <li key={i}>{s.lang}: {s.url}</li>
              ))}
            </ul>
            <button onClick={() => handleDelete(v)}>Удалить</button>
          </li>
        ))}
      </ul>

      <button onClick={() => { logout(); navigate('/login'); }} style={{ marginTop: '1rem' }}>
        Выйти
      </button>
    </div>
  );
};

export default AdminPage;

