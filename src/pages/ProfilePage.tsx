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
  const [expandedAnime, setExpandedAnime] = useState<string | null>(null);
  const [videoMap, setVideoMap] = useState<Record<string, { animeTitle: string; episodeTitle: string }>>({});
  const [expandedEpisode, setExpandedEpisode] = useState<string | null>(null);
  const [user, setUser] = useState(() => getCurrentUser());

  useEffect(() => {
    if (!user) return;

    setNickname(user.nickname || '');
    setAvatarUrl(user.avatarUrl || '');

    // Загружаем аватар с сервера
    fetch(`${SERVER_URL}/api/users/${user.id}/avatar`)
      .then(res => res.blob())
      .then(imageBlob => {
        const imageObjectUrl = URL.createObjectURL(imageBlob);
        setAvatarUrl(imageObjectUrl);
      })
      .catch(err => console.error('Ошибка загрузки аватара', err));

    // Загружаем карту видео
    fetch(`${SERVER_URL}/api/videos`)
      .then(res => res.json())
      .then(data => {
        const map: Record<string, { animeTitle: string; episodeTitle: string }> = {};
        data.forEach((video: any) => {
          map[video.id] = { animeTitle: video.animeTitle, episodeTitle: video.episodeTitle };
        });
        setVideoMap(map);
      })
      .catch(err => console.error('Ошибка загрузки видео карты', err));


    // Загружаем комментарии и просмотренные серии
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
      if (selectedFile) {
        formData.append('avatar', selectedFile);
      }
  
      const response = await fetch(`${SERVER_URL}/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json(); // result.avatarUrl должен быть URL нового файла
        const updatedUser = { ...user, nickname, avatarUrl: result.avatarUrl };
        saveCurrentUser(updatedUser);
        setAvatarUrl(result.avatarUrl); // обновим аватар
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
  
    logout(); // Удаляем localStorage
    window.location.href = '/login';
  };

  const toggleAnime = (anime: string) => {
    setExpandedAnime(prev => (prev === anime ? null : anime));
    setExpandedEpisode(null);
  };

  const toggleEpisode = (episode: string) => {
    setExpandedEpisode(prev => (prev === episode ? null : episode));
  };

  const groupedComments = comments.reduce((acc, comment) => {
    const [anime, episode] = comment.videoId.split('/');
    if (!acc[anime]) acc[anime] = {};
    if (!acc[anime][episode]) acc[anime][episode] = [];
    acc[anime][episode].push(comment);
    return acc;
  }, {} as Record<string, Record<string, Comment[]>>);

  if (!user) return <p>Вы не авторизованы</p>;

  if (loading) return <p>Загрузка профиля...</p>;

  return (
    <div style={styles.container}>
      <h2>Профиль пользователя</h2>
      <div style={styles.profileSection}>
        <img src={avatarUrl || '/default-avatar.jpg'} alt="Аватар" style={styles.avatar} />
        <input
          type="text"
          placeholder="Никнейм"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          style={styles.input}
        />
        <button onClick={handleSave} style={styles.button}>Сохранить изменения</button>
        {message && <p>{message}</p>}
      </div>

      <div style={styles.section}>
        <h3>Мои комментарии</h3>
        {comments.length === 0 ? (
          <p>Комментариев пока нет.</p>
        ) : (
          Object.entries(
            comments.reduce((acc, comment) => {
              const meta = videoMap[comment.videoId];
              if (!meta) return acc; // Пропускаем, если видео не найдено

              const { animeTitle, episodeTitle } = meta;
              if (!acc[animeTitle]) acc[animeTitle] = {};
              if (!acc[animeTitle][episodeTitle]) acc[animeTitle][episodeTitle] = [];

              acc[animeTitle][episodeTitle].push(comment);
              return acc;
            }, {} as Record<string, Record<string, Comment[]>>)
          ).map(([animeTitle, episodes]) => (
            <div key={animeTitle} style={{ marginBottom: '1rem' }}>
              <details>
                <summary style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{animeTitle}</summary>
                {Object.entries(episodes).map(([episodeTitle, episodeComments]) => (
                  <details key={episodeTitle} style={{ marginLeft: '1rem' }}>
                    <summary>{episodeTitle}</summary>
                    {/* Кнопка перехода к видео — используем videoId первого комментария */}
                    {episodeComments.length > 0 && (
                      <Link
                        to={`/video?vid=${encodeURIComponent(episodeComments[0].videoId)}`}
                        style={{ ...styles.button, display: 'inline-block', marginBottom: '0.5rem' }}
                      >
                        Перейти к видео
                      </Link>
                    )}
                    {/* Список комментариев */}
                    {episodeComments.map(comment => (
                      <div key={comment.id} style={styles.comment}>
                        <p>{comment.text}</p>
                      </div>
                    ))}
                  </details>
                ))}
              </details>
            </div>
          ))
        )}
      </div>

      <div style={styles.section}>
        <h3>Просмотренные эпизоды</h3>
        {watchedEpisodes.length === 0 ? (
          <p>Вы ещё ничего не посмотрели.</p>
        ) : (
          watchedEpisodes.map(episode => (
            <div key={episode.id} style={styles.comment}>
              <p><strong>Аниме:</strong> {episode.animeTitle}</p>
              <p><strong>Эпизод:</strong> {episode.episodeTitle}</p>
              <button
                onClick={() => handleEpisodeToggle(episode.id, episode.watched)}
                style={{ ...styles.button, backgroundColor: episode.watched ? 'red' : 'green' }}
              >
                {episode.watched ? 'Отметить как не просмотренный' : 'Отметить как просмотренный'}
              </button>
            </div>
          ))
        )}
      </div>

      <button onClick={handleLogout} style={styles.button}>Выйти</button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
  },
  profileSection: {
    marginBottom: '2rem',
    textAlign: 'center',
  },
  avatar: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    marginBottom: '1rem',
    objectFit: 'cover',
  },
  input: {
    width: '100%',
    padding: '0.5rem',
    margin: '0.5rem 0',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    margin: '0.5rem 0',
  },
  section: {
    marginTop: '2rem',
  },
  comment: {
    borderBottom: '1px solid #ccc',
    padding: '1rem 0',
  },
};

export default ProfilePage;
