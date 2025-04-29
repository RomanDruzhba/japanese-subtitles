// src/pages/HomePage.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface AdminVideo {
  id: number;
  animeTitle: string;
  episodeTitle: string;
  videoUrl: string;
  subtitles: {
    lang: string;
    url: string;
  }[];
}

const SERVER_URL = 'http://localhost:3000';

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/videos`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setVideos(data))
      .catch(error => console.error('Ошибка при загрузке видео:', error));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Каталог видео</h1>
      <div style={styles.grid}>
        {videos.map((video) => (
          <Link to={`/video?vid=${encodeURIComponent(video.id)}`} key={video.id} style={styles.cardLink}>
            <div style={styles.card}>
              <h3>{video.animeTitle} / {video.episodeTitle}</h3>
              <video
                src={`${SERVER_URL}${video.videoUrl}`}
                width="100%"
                controls
                style={{ borderRadius: '6px', marginBottom: '0.5rem' }}
              />
              <div style={{ fontSize: '0.9rem' }}>
                Субтитры: {video.subtitles.map((s) => s.lang.toUpperCase()).join(', ')}
              </div>
              <button style={styles.button}>Смотреть</button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fefefe',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s ease',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  }
};

export default HomePage;


