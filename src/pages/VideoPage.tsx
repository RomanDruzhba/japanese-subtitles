import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { JapaneseVideoPlayer } from '../japanese_video_player';
import CommentsSection from '../components/comments/CommentsSection';
import { Subtitle, DictionaryEntry } from '../types';
import DictionaryModal from '../components/DictionaryModal';
import StarRating from '../components/StarRating';
import { getCurrentUser } from '../auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const DICTIONARY_FILES_COUNT = 24; // Количество файлов словарей

const VideoPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get('vid');

  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);

  const [allEpisodes, setAllEpisodes] = useState<any[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<any | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const currentUser = getCurrentUser(); // получение текущего пользователя
  const userId = currentUser?.id;
  const navigate = useNavigate();

  const [truncationMessage, setTruncationMessage] = useState<string>('');
  const dictionaryRef = useRef<DictionaryEntry[]>([]);

  useEffect(() => {
    // console.log('searchParams изменились:', searchParams.toString());
    const vid = searchParams.get('vid');
    if (!vid) return;

    const loadAll = async () => {
      setIsLoading(true);
      setLoadingProgress(0);
      try {

        // 1. Загружаем данные видео
        const videosRes = await fetch(`${API_BASE_URL}/api/videos`);
        const videos = await videosRes.json();

        const video = videos.find((v: any) => v.id === videoId);
        if (!video) {
          console.warn('Видео не найдено по id:', videoId);
          setIsLoading(false);
          return;
        }

        setAllEpisodes(videos);
        setCurrentEpisode(video);

        // Получаем рейтинг
        const ratingRes = await fetch(`${API_BASE_URL}/api/episodes/${video.id}/rating?userId=${userId}`);
        const { average, user } = await ratingRes.json();
        setAverageRating(average);
        setUserRating(user);

        // console.log('Список видео с сервера:', videos);
        // console.log('Ищу videoId:', videoId);

        // 2. Загружаем все словари
        const dictionaryPromises = [];

        for (let i = 1; i <= DICTIONARY_FILES_COUNT; i++) {
          dictionaryPromises.push(
            fetch(`${API_BASE_URL}/mock/term_bank_${i}.json`)
              .then(res => res.json())
              .then(data => {
                setLoadingProgress(Math.round((i / DICTIONARY_FILES_COUNT) * 100));
                return data;
              })
          );
        }

        const dicts = await Promise.all(dictionaryPromises);
        const combinedDictionary = dicts.flat();
        dictionaryRef.current = combinedDictionary;
        // console.log(`Загружено ${combinedDictionary.length} словарных записей из ${DICTIONARY_FILES_COUNT} файлов`);

        // 3. Инициализируем видеоплеер
        const player = document.createElement('japanese-video-player') as JapaneseVideoPlayer;

        player.src = `${API_BASE_URL}${video.videoUrl}`;
        player.subtitles = video.subtitles.map((sub: any): Subtitle => ({
          src: `${API_BASE_URL}${sub.url}`,
          srclang: sub.lang,
          label: sub.lang.toUpperCase(),
        }));

        player.handleTokenClick = (token: string) => {
          const currentDict = dictionaryRef.current;

          if (!currentDict.length) {
            return;
          }

          // Функция для поиска в словаре
          const searchInDictionary = (searchToken: string) => {
            return currentDict
              .map(entry => {
                const [term, reading] = entry;
                let score = 0;
                if (term === searchToken) score = 100;
                else if (reading === searchToken) score = 80;
                else if (/[\u3400-\u9FBF]/.test(searchToken) && term.includes(searchToken)) score = 60;
                else if (reading.includes(searchToken)) score = 40;
                return { entry, score };
              })
              .filter(item => item.score > 0)
              .sort((a, b) => b.score - a.score)
              .map(item => item.entry);
          };

          // Сохраняем оригинальный токен
          const originalToken = token;
          let results: any[] = [];
          let currentToken = token;
          let foundWithTruncation = false;
          let truncatedToken = '';

          // Последовательно усекаем токен, пока не найдем совпадения или не останется 1 символ
          while (currentToken.length > 0) {
            results = searchInDictionary(currentToken);

            if (results.length > 0) {
              // Если нашли совпадения после усечения
              if (currentToken !== originalToken) {
                foundWithTruncation = true;
                truncatedToken = currentToken;
              }
              break;
            }

            // Прекращаем, если остался 1 символ
            if (currentToken.length === 1) {
              break;
            }

            // Усекаем последний символ
            currentToken = currentToken.slice(0, -1);
          }

          // Обработка результатов
          if (results.length) {
            setSelectedWord(originalToken);
            setEntries(results.slice(0, 50));

            // Устанавливаем сообщение об усечении, если оно было
            if (foundWithTruncation) {
              setTruncationMessage(`Для "${originalToken}" не найдено совпадений. Показаны результаты для "${truncatedToken}"`);
            } else {
              setTruncationMessage(''); // Сбрасываем сообщение
            }
          } else {
            alert(`Слово "${originalToken}" не найдено в словаре`);
          }
        };

        // Вставляем плеер в DOM

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(player);
        }

        // console.log('Плеер вставлен:', player);
      } catch (err) {
        // console.error('Ошибка загрузки:', err);
      }
    };

    loadAll();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [searchParams]);

  const handleSetRating = async (rating: number) => {
    if (!currentEpisode || !userId) {
      alert('Вы должны войти, чтобы поставить оценку');
      return;
    }

    await fetch(`${API_BASE_URL}/api/episodes/${currentEpisode.id}/rating`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, rating }),
      credentials: 'include',
    });

    setUserRating(rating);

    const ratingRes = await fetch(`${API_BASE_URL}/api/episodes/${currentEpisode.id}/rating`);
    const { average } = await ratingRes.json();
    setAverageRating(average);
  };

  const sameAnimeEpisodes = allEpisodes.filter(
    ep => ep.animeTitle === currentEpisode?.animeTitle
  );
  const currentIndex = sameAnimeEpisodes.findIndex(
    ep => ep.id === currentEpisode?.id
  );

  const handleNext = () => {
    if (currentIndex === -1 || currentIndex >= sameAnimeEpisodes.length - 1) return;
    const nextEpisode = sameAnimeEpisodes[currentIndex + 1];
    navigate(`/video?vid=${nextEpisode.id}`);
  };

  const handlePrev = () => {
    if (currentIndex <= 0) return;
    const prevEpisode = sameAnimeEpisodes[currentIndex - 1];
    navigate(`/video?vid=${prevEpisode.id}`);
  };



  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">Просмотр видео</h2>

      <div ref={containerRef} className="rounded overflow-hidden shadow-lg border mb-6" />

      <div className="flex justify-center gap-4 mb-4">
        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            ⬅ Предыдущая серия
          </button>
        )}
        {currentIndex < sameAnimeEpisodes.length - 1 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Следующая серия ➡
          </button>
        )}
      </div>

      {currentUser && (
        <div className="flex items-center gap-2 mb-4">
          <span className="font-medium">Ваша оценка:</span>
          <StarRating value={userRating} onChange={handleSetRating} />
        </div>
      )}

      {averageRating !== null && (
        <p className="mb-6 text-gray-700">Общая оценка: {averageRating.toFixed(1)} ★</p>
      )}

      {videoId && (
        <div className="mb-8">
          <CommentsSection key={videoId} videoId={videoId} />
        </div>
      )}

      {selectedWord && (
        <DictionaryModal
          word={selectedWord}
          entries={entries}
          truncationMessage={truncationMessage} // Передаем сообщение в модалку
          onClose={() => {
            setSelectedWord(null);
            setTruncationMessage(''); // Сбрасываем сообщение при закрытии
          }}
        />
      )}
    </div>
  );
};

export default VideoPage;

