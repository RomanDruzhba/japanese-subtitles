import React, { useEffect, useState } from 'react';
import { getCurrentUser, saveCurrentUser, logout } from '../../auth';
import ProfileInfo from './ProfileInfo';
import ProfileComments from './ProfileComments';
import ProfileWatchedEpisodes from './ProfileWatchedEpisodes';
import LogoutButton from './LogoutButton';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState(() => getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState([]);
  const [videoMap, setVideoMap] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) return;

    fetch(`${API_BASE_URL}/api/videos`)
      .then(res => res.json())
      .then(data => {
        const map: any = {};
        data.forEach((video: any) => {
          map[video.id] = { animeTitle: video.animeTitle, episodeTitle: video.episodeTitle };
        });
        setVideoMap(map);
      });

    fetch(`${API_BASE_URL}/api/users/${user.id}/profile`)
      .then(res => res.json())
      .then(data => {
        setComments(data.comments || []);
        setWatchedEpisodes(data.watchedEpisodes || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Ошибка загрузки профиля', err);
        setLoading(false);
      });
  }, []);

  if (!user) return <p className="text-center mt-10">Вы не авторизованы</p>;
  if (loading) return <p className="text-center mt-10">Загрузка профиля...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl font-bold text-center">Профиль пользователя</h2>
      <ProfileInfo user={user} setUser={setUser} message={message} setMessage={setMessage} />
      <ProfileComments comments={comments} videoMap={videoMap} />
      <ProfileWatchedEpisodes episodes={watchedEpisodes} setEpisodes={setWatchedEpisodes} />
      <LogoutButton />
    </div>
  );
};

export default ProfilePage;
