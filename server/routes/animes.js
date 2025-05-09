import express from 'express';
import path from 'path';
import fs from 'fs';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';
import { Genre } from '../models/Genre.js';
import { Tag } from '../models/Tag.js';

const router = express.Router();

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

// GET /api/animes — список всех аниме с жанрами и тегами
router.get('/', async (req, res) => {
    try {
        const animes = await Anime.findAll({
        include: [Genre, Tag],
        order: [['title', 'ASC']],
        });
        res.json(animes);
    } catch (error) {
        console.error('Ошибка при получении аниме:', error);
        res.status(500).json({ error: 'Ошибка при загрузке аниме' });
    }
});

// GET /api/animes/:id/episodes — эпизоды из ФС по id аниме
router.get('/:id/episodes', async (req, res) => {
    try {
      const anime = await Anime.findByPk(req.params.id);
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



