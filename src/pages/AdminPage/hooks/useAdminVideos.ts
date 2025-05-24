import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminVideo } from '../types/types';

// const SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const useAdminVideos = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);

  const refreshAllVideos = async () => {
    try {
      const res = await axios.get<AdminVideo[]>(`${API_BASE_URL}/api/videos`);
      setVideos(res.data);
    } catch (err) {
      console.error('Ошибка при загрузке всех эпизодов:', err);
    }
  };

  useEffect(() => {
    refreshAllVideos();
  }, []);

  const deleteVideo = async (video: AdminVideo) => {
    const safeAnime = video.animeTitle.trim().replace(/\s+/g, '_');
    const safeEpisode = video.episodeTitle.trim().replace(/\s+/g, '_');

    try {
      await axios.request({
        method: 'DELETE',
        url: `${API_BASE_URL}/delete`,
        headers: { 'Content-Type': 'application/json' },
        data: { animeTitle: safeAnime, episodeTitle: safeEpisode },
      });

      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch (err) {
      console.error('Ошибка при удалении:', err);
    }
  };

  return { videos, refreshAllVideos, deleteVideo };
};