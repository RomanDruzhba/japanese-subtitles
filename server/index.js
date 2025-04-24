// import express from 'express';
// import cors from 'cors';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url); 
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors({
//   origin: 'http://localhost:3000', // или '*', но менее безопасно
//   methods: 'GET',
//   allowedHeaders: ['Content-Type'],
// }));
// app.use(express.json());

// const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const anime = req.headers['x-anime-title'];
//     const type = req.headers['x-type'];

//     if (!anime || !type) return cb(new Error('Missing headers'), '');

//     const safeAnime = anime.toString().trim().replace(/\s+/g, '_');

//     const uploadPath = type === 'subtitle'
//       ? path.join(BASE_DIR, safeAnime, 'subs')
//       : path.join(BASE_DIR, safeAnime);

//     fs.mkdirSync(uploadPath, { recursive: true });
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).trim();
//     const rawName = path.basename(file.originalname, ext);
//     const safeName = rawName.trim().replace(/\s+/g, '_');
//     cb(null, `${safeName}${ext}`);
//   }
// });

// app.get('/api/videos', (req, res) => {
//   const videoList = [];

//   fs.readdirSync(BASE_DIR, { withFileTypes: true }).forEach((animeDir) => {
//     if (!animeDir.isDirectory()) return;

//     const animeTitle = animeDir.name;
//     const animePath = path.join(BASE_DIR, animeTitle);

//     fs.readdirSync(animePath, { withFileTypes: true }).forEach((file) => {
//       if (file.isFile() && /\.(webm|mp4)$/i.test(file.name)) {
//         const episodeTitle = path.basename(file.name, path.extname(file.name)); // без расширения
//         const subsEpisodeDir = path.join(animePath, 'subs', episodeTitle);
//         let subtitles = [];

//         if (fs.existsSync(subsEpisodeDir)) {
//           subtitles = fs.readdirSync(subsEpisodeDir)
//             .filter(sub => /\.vtt$/i.test(sub))
//             .map(sub => {
//               const match = sub.match(/_([a-z]{2})\d*\.vtt$/i); // video_subs_jp.vtt или video_subs_ru2.vtt
//               return {
//                 lang: match ? match[1] : 'unknown',
//                 url: `/mock/${animeTitle}/subs/${episodeTitle}/${sub}`,
//               };
//             });
//         }

//         videoList.push({
//           id: `${episodeTitle}`, // уникальный ID
//           animeTitle,
//           episodeTitle,
//           videoUrl: `/mock/${animeTitle}/${file.name}`,
//           subtitles,
//         });
//       }
//     });
//   });

//   res.json(videoList);
// });

// app.use('/mock', (req, res, next) => {
//   if (req.url.endsWith('.vtt')) {
//     res.setHeader('Content-Type', 'text/vtt');
//   }
//   next();
// });

// // Разрешаем CORS для /mock
// app.use('/mock', (req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
//   next();
// }, express.static(path.join(__dirname, '../public/mock')));


// const upload = multer({ storage });

// app.post('/upload', upload.single('file'), (req, res) => {
//   res.json({ message: 'Файл загружен' });
// });

// app.delete('/delete', (req, res) => {
//   const { animeTitle, filename, type } = req.body;

//   console.log('Пришло на удаление:', req.body);

//   if (!animeTitle || !filename || !type) {
//     console.error('Недостаточно данных:', req.body);
//     return res.status(400).json({ error: 'Недостаточно данных' });
//   }

//   const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
//   const safeFilename = filename.trim().replace(/\s+/g, '_');

//   const filePath = type === 'subtitle'
//     ? path.join(BASE_DIR, safeAnime, 'subs', safeFilename)
//     : path.join(BASE_DIR, safeAnime, safeFilename);

//   console.log('Удаление файла:', filePath);

//   if (!fs.existsSync(filePath)) {
//     console.warn('Файл не существует, пропускаем:', filePath);
//     return res.json({ message: 'Файл уже отсутствует, пропущен' });
//   }

//   fs.unlink(filePath, (err) => {
//     if (err) {
//       console.error('Ошибка unlink:', err.message);
//       return res.status(500).json({ error: 'Ошибка при удалении файла', details: err.message });
//     }
//     console.log('Удалено:', filePath);
//     res.json({ message: 'Файл удалён' });
//   });
// });

// app.listen(5000, () => {
//   console.log('Сервер запущен на http://localhost:5000');
// });


import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const anime = req.headers['x-anime-title'];
    const type = req.headers['x-type'];
    if (!anime || !type) return cb(new Error('Missing headers'), '');

    const safeAnime = anime.toString().trim().replace(/\s+/g, '_');
    const uploadPath = type === 'subtitle'
      ? path.join(BASE_DIR, safeAnime, 'subs')
      : path.join(BASE_DIR, safeAnime);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).trim();
    const rawName = path.basename(file.originalname, ext);
    const safeName = rawName.trim().replace(/\s+/g, '_');
    cb(null, `${safeName}${ext}`);
  }
});

const upload = multer({ storage });

app.get('/api/videos', (req, res) => {
  const videoList = [];
  fs.readdirSync(BASE_DIR, { withFileTypes: true }).forEach((animeDir) => {
    if (!animeDir.isDirectory()) return;

    const animeTitle = animeDir.name;
    const animePath = path.join(BASE_DIR, animeTitle);

    fs.readdirSync(animePath, { withFileTypes: true }).forEach((file) => {
      if (file.isFile() && /\.(webm|mp4)$/i.test(file.name)) {
        const episodeTitle = path.basename(file.name, path.extname(file.name));
        const subsEpisodeDir = path.join(animePath, 'subs', episodeTitle);
        let subtitles = [];

        if (fs.existsSync(subsEpisodeDir)) {
          subtitles = fs.readdirSync(subsEpisodeDir)
            .filter(sub => /\.vtt$/i.test(sub))
            .map(sub => {
              const match = sub.match(/_([a-z]{2})\d*\.vtt$/i);
              return {
                lang: match ? match[1] : 'unknown',
                url: `/mock/${animeTitle}/subs/${episodeTitle}/${sub}`,
              };
            });
        }

        videoList.push({
          id: episodeTitle,
          animeTitle,
          episodeTitle,
          videoUrl: `/mock/${animeTitle}/${file.name}`,
          subtitles,
        });
      }
    });
  });

  res.json(videoList);
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Файл загружен' });
});

app.delete('/delete', (req, res) => {
  const { animeTitle, filename, type } = req.body;
  if (!animeTitle || !filename || !type) {
    return res.status(400).json({ error: 'Недостаточно данных' });
  }

  const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
  const safeFilename = filename.trim().replace(/\s+/g, '_');

  const filePath = type === 'subtitle'
    ? path.join(BASE_DIR, safeAnime, 'subs', safeFilename)
    : path.join(BASE_DIR, safeAnime, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.json({ message: 'Файл уже отсутствует, пропущен' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка при удалении файла', details: err.message });
    }
    res.json({ message: 'Файл удалён' });
  });
});

app.use('/mock', express.static(path.join(__dirname, '../public/mock')));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
