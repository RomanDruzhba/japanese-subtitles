import express from 'express';
import path from 'path';
import fs from 'fs';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';
import { Genre } from '../models/Genre.js';
import { Tag } from '../models/Tag.js';
import { AnimeRating } from '../models/AnimeRating.js';
import { User } from '../models/User.js';


const router = express.Router();

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');


// GET средний рейтинг и рейтинг пользователя
router.get('/:id/rating', async (req, res) => {
  const { id } = req.params;
  const { userId } = req.query;

  const anime = await Anime.findByPk(id);
  if (!anime) return res.status(400).json({ error: 'Invalid anime id' });

  const ratings = await AnimeRating.findAll({ where: { animeId: id } });
  const average = ratings.length ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length : 0;

  let user = null;
  if (userId) {
    const userRating = await AnimeRating.findOne({ where: { animeId: id, userId } });
    user = userRating?.rating || null;
  }

  res.json({ average, user });
});

// POST поставить или обновить рейтинг
router.post('/:id/rating', async (req, res) => {
  const { id } = req.params;
  const { userId, rating } = req.body;

  const anime = await Anime.findByPk(id);
  if (!anime) return res.status(400).json({ error: 'Invalid anime id' });

  const user = await User.findByPk(userId);
  if (!user) return res.status(400).json({ error: 'Invalid userId' });

  const [userRating, created] = await AnimeRating.findOrCreate({
    where: { animeId: id, userId },
    defaults: { rating },
  });

  if (!created) {
    userRating.rating = rating;
    await userRating.save();
  }

  const ratings = await AnimeRating.findAll({ where: { animeId: id } });
  const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  anime.rating = average;
  await anime.save();

  res.json({ success: true });
});

// GET /api/animes — список всех аниме с жанрами и тегами
router.get('/', async (req, res) => {
  try {
    const animes = await Anime.findAll({
      where: { archived: false },
      include: [Genre, Tag],
      order: [['title', 'ASC']],
    });

    const serialized = animes.map(a => {
      const json = a.toJSON();
      if (json.poster && json.posterMimeType) {
        json.poster = `data:${json.posterMimeType};base64,${Buffer.from(json.poster).toString('base64')}`;
      } else {
        json.poster = null;
      }
      return json;
    });

    res.json(serialized);
  } catch (error) {
    console.error('Ошибка при получении аниме:', error);
    res.status(500).json({ error: 'Ошибка при загрузке аниме' });
  }
});

// GET /api/animes/:id/episodes — эпизоды из ФС по id аниме
router.get('/:id/episodes', async (req, res) => {
  try {
    const anime = await Anime.findOne({
      where: { id: req.params.id, archived: false },
    });
    if (!anime) {
      return res.status(404).json({ error: 'Аниме не найдено' });
    }
  
    const animeTitle = anime.title;
    const animePath = path.join(BASE_DIR, animeTitle);
    const episodes = [];
  
    if (!fs.existsSync(animePath)) {
      return res.json([]); // если директории нет — возвращаем пусто
    }
  
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
  
        episodes.push({
          id: episodeTitle,
          animeTitle,
          episodeTitle,
          videoUrl: `/mock/${animeTitle}/${file.name}`,
          subtitles,
        });
      }
    });
  
    res.json(episodes);
  } catch (error) {
    console.error('Ошибка при получении эпизодов из ФС:', error);
    res.status(500).json({ error: 'Ошибка при загрузке эпизодов' });
  }
});

export default router;



