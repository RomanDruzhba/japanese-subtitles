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

const ProfilePage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
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

    // Загружаем карту видео
    fetch('http://localhost:3000/api/videos')
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
    fetch(`http://localhost:3000/api/users/${user.id}/profile`)
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
      const response = await fetch(`http://localhost:3000/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, avatarUrl }),
      });

      if (response.ok) {
        const updatedUser = { ...user, nickname, avatarUrl };
        saveCurrentUser(updatedUser);
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
      const response = await fetch(`http://localhost:3000/api/watched-episodes/${episodeId}`, {
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

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Перенаправляем на страницу логина после выхода
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
        <img src={avatarUrl || '/default-avatar.png'} alt="Аватар" style={styles.avatar} />
        <input
          type="text"
          placeholder="Никнейм"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          style={styles.input}
        />
        <input
          type="text"
          placeholder="URL аватара"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
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
                    {episodeComments.map(comment => (
                      <div key={comment.id} style={styles.comment}>
                        <p>{comment.text}</p>
                        <Link
                          to={`/video?vid=${encodeURIComponent(comment.videoId)}`}
                          style={{ ...styles.button, display: 'inline-block', marginTop: '0.5rem' }}
                        >
                          Перейти к видео
                        </Link>
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
