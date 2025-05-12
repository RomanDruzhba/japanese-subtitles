import React, { useState, useMemo } from 'react';
import { AdminVideo } from '../types';
import axios from 'axios';

interface UploadedListProps {
  videos: AdminVideo[];
  onDelete: (video: AdminVideo) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const normalize = (str: string) => str.replace(/_/g, ' ').toLowerCase();

const UploadedList: React.FC<UploadedListProps> = ({ videos, onDelete }) => {
  const [filter, setFilter] = useState('');
  const [expandedAnime, setExpandedAnime] = useState<string | null>(null);
  const [expandedEpisode, setExpandedEpisode] = useState<number | null>(null);

  const handleArchiveAnime = async (animeTitle: string) => {
    try {
      await axios.post(`${API_BASE_URL}/api/admin/archive-anime/${encodeURIComponent(animeTitle)}`);
      alert(`Аниме "${animeTitle}" архивировано`);
    } catch (err) {
      alert(`Ошибка архивирования аниме: ${err}`);
    }
  };

  const handleArchiveEpisode = async (episodeId: number) => {
    try {
      await axios.post(`${API_BASE_URL}/api/admin/archive-episode/${episodeId}`);
      alert(`Эпизод ID ${episodeId} архивирован`);
    } catch (err) {
      alert(`Ошибка архивирования эпизода: ${err}`);
    }
  };

  const handleDeleteFile = async (filePath: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/delete-file`, {
        data: { filePath }
      } as any);
      alert('Файл удалён');
    } catch (err: any) {
      alert(`Ошибка удаления файла: ${err?.response?.data?.error || err.message}`);
    }
  };

  const grouped = useMemo(() => {
    const search = normalize(filter);
    return videos
      .filter((v) => {
        const combined = normalize(`${v.animeTitle} ${v.episodeTitle}`);
        return combined.includes(search);
      })
      .reduce<Record<string, AdminVideo[]>>((acc, video) => {
        if (!acc[video.animeTitle]) acc[video.animeTitle] = [];
        acc[video.animeTitle].push(video);
        return acc;
      }, {});
  }, [videos, filter]);

  return (
    <div className="p-4">
      <h3 className="text-2xl font-semibold mb-4">Загруженные эпизоды</h3>

      <input
        type="text"
        placeholder="Поиск по названию или номеру"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 p-2 w-full border rounded-md shadow-sm"
      />

      {Object.keys(grouped).length === 0 && (
        <p className="text-gray-500">Нет эпизодов</p>
      )}

      <div className="space-y-4">
        {Object.entries(grouped).map(([animeTitle, episodes]) => (
          <div key={animeTitle} className="bg-white rounded-xl shadow p-4">
            <h4
              onClick={() =>
                setExpandedAnime(expandedAnime === animeTitle ? null : animeTitle)
              }
              className="text-lg font-semibold text-blue-600 cursor-pointer"
            >
              {animeTitle.replace(/_/g, ' ')}
            </h4>
            <button
              onClick={() => handleArchiveAnime(animeTitle)}
              className="mt-1 ml-2 px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              Архивировать аниме
            </button>

            {expandedAnime === animeTitle && (
              <ul className="mt-2 space-y-3">
                {episodes.map((video) => (
                  <li key={video.id} className="border rounded-lg p-3">
                    <div
                      onClick={() =>
                        setExpandedEpisode(
                          expandedEpisode === video.id ? null : video.id
                        )
                      }
                      className="text-green-700 font-medium cursor-pointer"
                    >
                      {video.episodeTitle.replace(/_/g, ' ')}
                    </div>

                    {expandedEpisode === video.id && (
                      <div className="mt-2 text-sm text-gray-800 space-y-2">
                        <p>
                          <strong>Видео:</strong>{' '}
                          <span className="break-all">{video.videoUrl}</span>{' '}
                          <button
                            onClick={() => handleDeleteFile(video.videoUrl)}
                            className="ml-2 px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Удалить видео
                          </button>
                        </p>
                        <ul className="ml-4 list-disc">
                          {video.subtitles.map((sub, index) => (
                            <li key={index}>
                              {sub.lang}:{' '}
                              <span className="break-all">{sub.url}</span>{' '}
                              <button
                                onClick={() => handleDeleteFile(sub.url)}
                                className="ml-2 px-2 py-1 text-sm bg-red-400 text-white rounded hover:bg-red-500"
                              >
                                Удалить сабы
                              </button>
                            </li>
                          ))}
                        </ul>
                        <button
                          onClick={() => onDelete(video)}
                          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Удалить эпизод полностью
                        </button>

                        <button
                          onClick={() => handleArchiveEpisode(video.id)}
                          className="ml-2 px-2 py-1 text-sm bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Архивировать эпизод
                        </button>
                      </div>
                      
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadedList;
