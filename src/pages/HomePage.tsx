// import React from 'react';
// import { Link } from 'react-router-dom';
// import { videoList } from '../data/videos';

// const HomePage: React.FC = () => {
//   return (
//     <div>
//       <h1>Видео на японском</h1>
//       <div style={styles.grid}>
//         {videoList.map((video) => (
//           <div key={video.id} style={styles.card}>
//             <img src={video.thumbnail} alt={video.title} style={styles.thumbnail} />
//             <h3>{video.title}</h3>
//             <p>{video.description}</p>
//             <Link to={video.path}>
//               <button style={styles.button}>Смотреть</button>
//             </Link>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
//     gap: '1.5rem',
//   },
//   card: {
//     border: '1px solid #ccc',
//     borderRadius: '8px',
//     padding: '1rem',
//     textAlign: 'center',
//     backgroundColor: '#f9f9f9',
//   },
//   thumbnail: {
//     width: '100%',
//     borderRadius: '4px',
//     marginBottom: '1rem',
//   },
//   button: {
//     marginTop: '0.5rem',
//     padding: '0.5rem 1rem',
//     cursor: 'pointer',
//   },
// };

// export default HomePage;

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

const HomePage: React.FC = () => {
  const [videos, setVideos] = useState<AdminVideo[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem('admin_videos');
    if (raw) {
      setVideos(JSON.parse(raw));
    }
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Каталог видео</h1>
      <div style={styles.grid}>
        {videos.map((video) => (
          <Link to={`/video?vid=${video.id}`} key={video.id} style={styles.cardLink}>
            <div style={styles.card}>
              <h3>{video.animeTitle} / {video.episodeTitle}</h3>
              <video
                src={`../../public/mock/${video.videoUrl}`}
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
