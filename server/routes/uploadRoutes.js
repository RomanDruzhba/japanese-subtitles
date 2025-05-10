import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';
import { Genre } from '../models/Genre.js';
import { Tag } from '../models/Tag.js';

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
    const animeTitle = req.body.animeTitle?.toString().trim().replace(/\s+/g, ' ');
    const episodeTitle = req.body.episodeTitle?.toString().trim().replace(/\s+/g, ' ');
    const type = req.body.type;

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

    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении файла или записи в БД' });
  }
});

const uploadposter = multer({ storage: multer.memoryStorage() });

router.post('/upload/description', uploadposter.single('file'), async (req, res) => {
  try {
    const releasedRaw = req.body.released?.toString();
    const finishedRaw = req.body.finished?.toString();
    const released = releasedRaw ? new Date(releasedRaw) : null;
    const finished = finishedRaw === 'true';

    const { file } = req;
    const animeTitle = req.body.animeTitle?.toString().trim();
    if (!animeTitle) {
      return res.status(400).json({ error: 'Название аниме обязательно' });
    }

    const description = req.body.description?.toString().trim();
    const rating = parseFloat(req.body.rating || '0');
    const genres = JSON.parse(req.body.genres || '[]');
    const tags = JSON.parse(req.body.tags || '[]');

    const [anime] = await Anime.findOrCreate({ where: { title: animeTitle } });

    const updateData = { rating, finished };
    if (description) updateData.description = description;
    if (released) updateData.released = released;
    if (file) {
      const fileBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);
      updateData.poster = fileBuffer;
      updateData.posterMimeType = file.mimetype;
    }

    await anime.update(updateData);

    if (genres.length > 0) {
      const genreRecords = await Genre.findAll({ where: { id: genres } });
      await anime.setGenres(genreRecords);
    }

    if (tags.length > 0) {
      const tagRecords = await Tag.findAll({ where: { id: tags } });
      await anime.setTags(tagRecords);
    }
    res.json({ message: 'Изменения успешно сохранены' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при сохранении описания' });
  }
});

router.get('/genres', async (req, res) => {
  const genres = await Genre.findAll();
  res.json(genres);
});

router.get('/tags', async (req, res) => {
  const tags = await Tag.findAll();
  res.json(tags);
});

export default router;