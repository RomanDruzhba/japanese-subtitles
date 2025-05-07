import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminVideo } from '../types';

const SERVER_URL = 'http://localhost:3000';

export const useAdminVideos = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);

  const refreshAllVideos = async () => {
    try {
      const res = await axios.get<AdminVideo[]>(`${SERVER_URL}/api/videos`);
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
        url: `${SERVER_URL}/delete`,
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