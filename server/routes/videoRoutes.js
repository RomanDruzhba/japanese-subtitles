import express from 'express';
import path from 'path';
import fs from 'fs';
import { EpisodeRating } from '../models/EpisodeRating.js';
import { Episode } from '../models/Episode.js';
import { User } from '../models/User.js';

const router = express.Router();

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

router.get('/videos', (req, res) => {
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

// GET рейтинг эпизода и рейтинг пользователя
router.get('/episodes/:id/rating', async (req, res) => {
  const { id: episodeTitle } = req.params;
  const { userId } = req.query;

  const episode = await Episode.findOne({ where: { title: episodeTitle } });
  if (!episode) {
    return res.status(400).json({ error: 'Invalid episode title' });
  }

  const ratings = await EpisodeRating.findAll({ where: { episodeId: episode.id } });
  const average = ratings.length ? ratings.reduce((a, b) => a + b.rating, 0) / ratings.length : 0;

  let user = null;
  if (userId) {
    const userRating = await EpisodeRating.findOne({ where: { episodeId: episode.id, userId } });
    user = userRating?.rating || null;
  }

  res.json({ average, user });
});

router.post('/episodes/:id/rating', async (req, res) => {
  const { id: episodeTitle } = req.params; // на самом деле это title, а не ID!
  const { userId, rating } = req.body;

  // 1. Найдём эпизод по title
  const episode = await Episode.findOne({ where: { title: episodeTitle } });
  if (!episode) {
    return res.status(400).json({ error: 'Invalid episode title' });
  }

  const user = await User.findByPk(userId);
  if (!user) {
    return res.status(400).json({ error: 'Invalid userId' });
  }

  // 2. Теперь используем episode.id (реальный ID из базы)
  const [userRating, created] = await EpisodeRating.findOrCreate({
    where: { episodeId: episode.id, userId },
    defaults: { rating },
  });

  if (!created) {
    userRating.rating = rating;
    await userRating.save();
  }

  // 3. Обновим среднюю оценку в Episode
  const ratings = await EpisodeRating.findAll({ where: { episodeId: episode.id } });
  const average = ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  episode.rating = average;
  await episode.save();

  res.json({ success: true });
});


export default router;