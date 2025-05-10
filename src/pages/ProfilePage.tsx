// ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { getCurrentUser, saveCurrentUser, logout } from '../auth';
import { Link } from 'react-router-dom';

interface Comment {
  id: number;
  text: string;
  videoId: string;
}

interface WatchedEpisode {
  id: number;
  animeTitle: string;
  episodeTitle: string;
  watched: boolean;
}

const SERVER_URL = 'http://localhost:3000';

const ProfilePage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [watchedEpisodes, setWatchedEpisodes] = useState<WatchedEpisode[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [videoMap, setVideoMap] = useState<Record<string, { animeTitle: string; episodeTitle: string }>>({});
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    if (!user) return;

    setNickname(user.nickname || '');
    setAvatarUrl(user.avatarUrl || '');

    fetch(`${SERVER_URL}/api/users/${user.id}/avatar`)
      .then(res => res.blob())
      .then(imageBlob => setAvatarUrl(URL.createObjectURL(imageBlob)))
      .catch(err => console.error('Ошибка загрузки аватара', err));

    fetch(`${SERVER_URL}/api/videos`)
      .then(res => res.json())
      .then(data => {
        const map: Record<string, { animeTitle: string; episodeTitle: string }> = {};
        data.forEach((video: any) => {
          map[video.id] = { animeTitle: video.animeTitle, episodeTitle: video.episodeTitle };
        });
        setVideoMap(map);
      });

    fetch(`${SERVER_URL}/api/users/${user.id}/profile`)
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

  const handleSave = async () => {
    if (!user) return;
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      if (selectedFile) formData.append('avatar', selectedFile);

      const response = await fetch(`${SERVER_URL}/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedUser = { ...user, nickname, avatarUrl: result.avatarUrl };
        saveCurrentUser(updatedUser);
        setAvatarUrl(result.avatarUrl);
        setMessage('Профиль обновлен успешно!');
      } else {
        setMessage('Ошибка обновления профиля');
      }
    } catch (err) {
      console.error('Ошибка сохранения профиля', err);
      setMessage('Ошибка подключения к серверу');
    }
  };

  const handleEpisodeToggle = async (episodeId: number, currentStatus: boolean) => {
    if (!user) return;

    try {
      const response = await fetch(`${SERVER_URL}/api/watched-episodes/${episodeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ watched: !currentStatus }),
      });

      if (response.ok) {
        setWatchedEpisodes(prev =>
          prev.map(episode =>
            episode.id === episodeId ? { ...episode, watched: !currentStatus } : episode
          )
        );
      }
    } catch (err) {
      console.error('Ошибка обновления статуса эпизода', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${SERVER_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }

    logout();
    window.location.href = '/login';
  };

  if (!user) return <p className="text-center text-lg mt-10">Вы не авторизованы</p>;
  if (loading) return <p className="text-center text-lg mt-10">Загрузка профиля...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h2 className="text-3xl font-bold text-center">Профиль пользователя</h2>

      <div className="bg-white rounded-xl shadow p-6 text-center space-y-4">
        <img
          src={avatarUrl || '/default-avatar.jpg'}
          alt="Аватар"
          className="w-28 h-28 rounded-full mx-auto object-cover"
        />
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Никнейм"
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
        <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Сохранить изменения
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Мои комментарии</h3>
        {comments.length === 0 ? (
          <p>Комментариев пока нет.</p>
        ) : (
          Object.entries(
            comments.reduce((acc, comment) => {
              const meta = videoMap[comment.videoId];
              if (!meta) return acc;
              const { animeTitle, episodeTitle } = meta;
              if (!acc[animeTitle]) acc[animeTitle] = {};
              if (!acc[animeTitle][episodeTitle]) acc[animeTitle][episodeTitle] = [];
              acc[animeTitle][episodeTitle].push(comment);
              return acc;
            }, {} as Record<string, Record<string, Comment[]>>)
          ).map(([animeTitle, episodes]) => (
            <div key={animeTitle} className="mb-4">
              <details className="mb-2">
                <summary className="cursor-pointer font-semibold">{animeTitle}</summary>
                {Object.entries(episodes).map(([episodeTitle, episodeComments]) => (
                  <details key={episodeTitle} className="ml-4 mt-2">
                    <summary className="cursor-pointer">{episodeTitle}</summary>
                    <Link
                      to={`/video?vid=${encodeURIComponent(episodeComments[0].videoId)}`}
                      className="inline-block text-blue-600 underline mt-2 mb-1"
                    >
                      Перейти к видео
                    </Link>
                    {episodeComments.map(comment => (
                      <div key={comment.id} className="border-b py-2 text-gray-700">{comment.text}</div>
                    ))}
                  </details>
                ))}
              </details>
            </div>
          ))
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Просмотренные эпизоды</h3>
        {watchedEpisodes.length === 0 ? (
          <p>Вы ещё ничего не посмотрели.</p>
        ) : (
          watchedEpisodes.map(episode => (
            <div key={episode.id} className="border-b py-4">
              <p><strong>Аниме:</strong> {episode.animeTitle}</p>
              <p><strong>Эпизод:</strong> {episode.episodeTitle}</p>
              <button
                onClick={() => handleEpisodeToggle(episode.id, episode.watched)}
                className={`mt-2 px-4 py-2 rounded text-white ${
                  episode.watched ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {episode.watched ? 'Отметить как не просмотренный' : 'Отметить как просмотренный'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="text-center">
        <button
          onClick={handleLogout}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
        >
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
