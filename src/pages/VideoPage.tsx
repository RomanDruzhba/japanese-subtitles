
// import React, { useEffect, useRef } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import { baseUrl } from '../data';
// import { JapaneseVideoPlayer } from '../japanese_video_player';
// import CommentsSection from '../components/comments/CommentsSection';
// import { Subtitle } from '../types';

// const VideoPage: React.FC = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const [searchParams] = useSearchParams();
//   const videoId = searchParams.get('vid');

//   useEffect(() => {
//     const videosRaw = localStorage.getItem('admin_videos');
//     if (!videoId || !videosRaw) return;

//     const videos = JSON.parse(videosRaw);
//     const video = videos.find((v: any) => v.id.toString() === videoId);
//     if (!video) return;

//     const player = document.createElement('japanese-video-player') as JapaneseVideoPlayer;

//     player.src = `../../public/mock/${video.videoUrl}`;
//     player.subtitles = video.subtitles.map((sub: any): Subtitle => ({
//       src: `../../public/mock/${sub.url}`,
//       srclang: sub.lang,
//       label: sub.lang.toUpperCase(),
//     }));
//     player.handleTokenClick = (token: string) => {
//       alert(`Вы кликнули на: ${token}`);
//     };

//     if (containerRef.current) {
//       containerRef.current.innerHTML = '';
//     }
//     containerRef.current?.appendChild(player);

//     return () => {
//       player.remove();
//     };
//   }, [searchParams]);

//   return (
//     <div>
//       <h2>Просмотр видео</h2>
//       <div ref={containerRef} />
//       {videoId && <CommentsSection videoId={videoId} />}
//     </div>
//   );
// };

// export default VideoPage;


import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { baseUrl } from '../data';
import { JapaneseVideoPlayer } from '../japanese_video_player';
import CommentsSection from '../components/comments/CommentsSection';
import { Subtitle, DictionaryEntry } from '../types';
import DictionaryModal from '../DictionaryModal';

const VideoPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('vid');

  const [dictionary, setDictionary] = useState<Record<string, DictionaryEntry[]>>({});
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);

  useEffect(() => {
    // Загружаем словарь один раз
    fetch('../../public/mock/warodai_parsed.json')
      .then(res => res.json())
      .then(data => setDictionary(data))
      .catch(err => console.error('Ошибка загрузки словаря:', err));
  }, []);

  useEffect(() => {
    const videosRaw = localStorage.getItem('admin_videos');
    if (!videoId || !videosRaw) return;

    const videos = JSON.parse(videosRaw);
    const video = videos.find((v: any) => v.id.toString() === videoId);
    if (!video) return;

    const player = document.createElement('japanese-video-player') as JapaneseVideoPlayer;

    player.src = `../../public/mock/${video.videoUrl}`;
    player.subtitles = video.subtitles.map((sub: any): Subtitle => ({
      src: `../../public/mock/${sub.url}`,
      srclang: sub.lang,
      label: sub.lang.toUpperCase(),
    }));

    player.handleTokenClick = (token: string) => {
      const result = dictionary[token];
      if (result) {
        setSelectedWord(token);
        setEntries(result);
      } else {
        alert(`Нет информации о: ${token}`);
      }
    };

    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(player);
    }

    return () => {
      player.remove();
    };
  }, [searchParams, dictionary]);

  return (
    <div>
      <h2>Просмотр видео</h2>
      <div ref={containerRef} />
      {videoId && <CommentsSection videoId={videoId} />}
      {selectedWord && (
        <DictionaryModal
          word={selectedWord}
          entries={entries}
          onClose={() => setSelectedWord(null)}
        />
      )}
    </div>
  );
};

export default VideoPage;
