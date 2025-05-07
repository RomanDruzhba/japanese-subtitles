import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';

const router = express.Router();
const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const anime = req.headers['x-anime-title'];
    const type = req.headers['x-type'];
    if (!anime || !type) return cb(new Error('Missing headers'), '');

    const safeAnime = anime.toString().trim().replace(/\s+/g, '_');
    const episode = req.headers['x-episode-title']?.toString().trim().replace(/\s+/g, '_') || 'unknown';
    const uploadPath = type === 'subtitle'
      ? path.join(BASE_DIR, safeAnime, 'subs', episode)
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



router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    const animeTitle = req.headers['x-anime-title']?.toString().trim().replace(/\s+/g, ' ');
    const episodeTitle = req.headers['x-episode-title']?.toString().trim().replace(/\s+/g, ' ');
    const type = req.headers['x-type'];

    if (!animeTitle || !type) {
      return res.status(400).json({ error: 'Missing anime title or type header' });
    }

    // Найти или создать аниме
    const [anime] = await Anime.findOrCreate({
      where: { title: animeTitle },
    });

    // Если это видео — создаём эпизод
    if (type === 'video' && episodeTitle) {
      await Episode.findOrCreate({
        where: {
          title: episodeTitle,
          animeId: anime.id,
        },
        defaults: {
          title: episodeTitle,
          animeId: anime.id,
        }
      });
    }

    res.json({ message: 'Файл загружен' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении файла или записи в БД' });
  }
});

export default router;