// // src/pages/HomePage.tsx

// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';

// interface AdminVideo {
//   id: number;
//   animeTitle: string;
//   episodeTitle: string;
//   videoUrl: string;
//   subtitles: {
//     lang: string;
//     url: string;
//   }[];
// }

// const SERVER_URL = 'http://localhost:3000';

// const HomePage: React.FC = () => {
//   const [videos, setVideos] = useState<AdminVideo[]>([]);

//   useEffect(() => {
//     fetch(`${SERVER_URL}/api/videos`)
//       .then(response => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then(data => setVideos(data))
//       .catch(error => console.error('Ошибка при загрузке видео:', error));
//   }, []);

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h1 style={{ textAlign: 'center' }}>Каталог видео</h1>
//       <div style={styles.grid}>
//         {videos.map((video) => (
//           <Link to={`/video?vid=${encodeURIComponent(video.id)}`} key={video.id} style={styles.cardLink}>
//             <div style={styles.card}>
//               <h3>{video.animeTitle} / {video.episodeTitle}</h3>
//               <video
//                 src={`${SERVER_URL}${video.videoUrl}`}
//                 width="100%"
//                 controls
//                 style={{ borderRadius: '6px', marginBottom: '0.5rem' }}
//               />
//               <div style={{ fontSize: '0.9rem' }}>
//                 Субтитры: {video.subtitles.map((s) => s.lang.toUpperCase()).join(', ')}
//               </div>
//               <button style={styles.button}>Смотреть</button>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// const styles: { [key: string]: React.CSSProperties } = {
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
//     gap: '1.5rem',
//   },
//   cardLink: {
//     textDecoration: 'none',
//     color: 'inherit',
//   },
//   card: {
//     border: '1px solid #ccc',
//     padding: '1rem',
//     borderRadius: '8px',
//     backgroundColor: '#fefefe',
//     boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
//     transition: 'transform 0.2s ease',
//   },
//   button: {
//     marginTop: '0.5rem',
//     padding: '0.5rem 1rem',
//     fontSize: '1rem',
//     cursor: 'pointer',
//     backgroundColor: '#4caf50',
//     color: 'white',
//     border: 'none',
//     borderRadius: '4px',
//   }
// };

// export default HomePage;


// src/pages/HomePage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SERVER_URL = 'http://localhost:3000';

interface Anime {
  id: number;
  title: string;
  description: string;
  poster: string;
  rating: number;
  genres?: { name: string }[];
  tags?: { name: string }[];
}

interface Episode {
  id: number;
  title: string;
  videoUrl: string;
  subtitles: { lang: string; url: string }[];
}

const HomePage: React.FC = () => {
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/animes`)
      .then(res => res.json())
      .then(data => setAnimes(data))
      .catch(err => console.error('Ошибка при загрузке аниме:', err));
  }, []);

  const handleAnimeClick = async (anime: Anime) => {
    setSelectedAnime(anime);
    try {
      const res = await fetch(`${SERVER_URL}/api/animes/${anime.id}/episodes`);
      const data = await res.json();
      setEpisodes(data);
    } catch (error) {
      console.error('Ошибка при загрузке эпизодов:', error);
    }
  };

  return (
    <div className='p-2'>
      {!selectedAnime ? (
        <>
          <h1 style={{ textAlign: 'center' }}>Аниме-каталог</h1>
          <div style={styles.grid}>
            {animes.map(anime => (
              <div key={anime.id} style={styles.card} onClick={() => handleAnimeClick(anime)}>
                <img src={`${SERVER_URL}/${anime.poster}`} alt={anime.title} style={{ width: '100%', borderRadius: '6px' }} />
                <h3>{anime.title}</h3>
                <p>{anime.description?.slice(0, 80)}...</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSelectedAnime(null)} style={styles.backButton}>Назад</button>
          <div style={{ marginBottom: '2rem' }}>
            <h2>{selectedAnime.title}</h2>
            <p>{selectedAnime.description}</p>
          </div>
          <div style={styles.grid}>
            {episodes.map(ep => (
              <Link to={`/video?vid=${ep.id}`} key={ep.id} style={styles.cardLink}>
                <div style={styles.card}>
                  <h4>{ep.title}</h4>
                  <video className=''
                    src={`${SERVER_URL}${ep.videoUrl}`}
                    width="100%"
                    controls
                    style={{ borderRadius: '6px' }}
                  />
                  <div style={{ fontSize: '0.9rem' }}>
                    Субтитры: {ep.subtitles?.map((s) => s.lang.toUpperCase()).join(', ')}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    backgroundColor: '#fefefe',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit',
  },
  backButton: {
    marginBottom: '1rem',
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    cursor: 'pointer',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
  },
};

export default HomePage;
