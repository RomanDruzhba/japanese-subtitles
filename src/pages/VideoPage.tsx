import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { JapaneseVideoPlayer } from '../japanese_video_player';
import CommentsSection from '../components/comments/CommentsSection';
import { Subtitle, DictionaryEntry } from '../types';
import DictionaryModal from '../DictionaryModal';

const SERVER_URL = 'http://localhost:3000';

const VideoPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('vid');

  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);

  const dictionaryRef = useRef<DictionaryEntry[]>([]);

  useEffect(() => {
    if (!videoId) return;

    const loadAll = async () => {
      try {
        const [videosRes, dictRes] = await Promise.all([
          fetch(`${SERVER_URL}/api/videos`),
          fetch(`${SERVER_URL}/mock/term_bank_1.json`),
        ]);

        const [videos, dict] = await Promise.all([
          videosRes.json(),
          dictRes.json(),
        ]);

        setDictionary(dict);
        dictionaryRef.current = dict;
        console.log('Загружен словарь:', dict);
        console.log('Тип первой записи:', Array.isArray(dict[0]), dict[0]);

        const video = videos.find((v: any) => v.id === videoId);
        if (!video) {
          console.warn('Видео не найдено по id:', videoId);
          return;
        }

        const player = document.createElement('japanese-video-player') as JapaneseVideoPlayer;

        player.src = `${SERVER_URL}${video.videoUrl}`;
        player.subtitles = video.subtitles.map((sub: any): Subtitle => ({
          src: `${SERVER_URL}${sub.url}`,
          srclang: sub.lang,
          label: sub.lang.toUpperCase(),
        }));

        player.handleTokenClick = (token: string) => {
          const currentDict = dictionaryRef.current;
          console.log('Обработчик токена срабатывает по:', token);
          console.log('dictionary сейчас:', currentDict);
          if (!currentDict.length) {
          console.warn('Словарь ещё не загружен');
          return;
          }
          
          const results = currentDict
          .map(entry => {
          const [term, reading] = entry;
          let score = 0;
          
            if (term === token) score = 100;
            else if (reading === token) score = 80;
            else if (/[\u3400-\u9FBF]/.test(token) && term.includes(token)) score = 60;
            else if (reading.includes(token)) score = 40;
          
            return { entry, score };
          })
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(item => item.entry);
          
          if (results.length) {
          setSelectedWord(token);
          setEntries(results);
          } else {
          alert(`Слово ${token} не найдено в словаре`);
          }
        };

        // Вставляем плеер в DOM

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(player);
        }

        console.log('Плеер вставлен:', player);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
      }
    };

    loadAll();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [videoId]);

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

