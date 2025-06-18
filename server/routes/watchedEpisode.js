import express from 'express';
import path from 'path';
import fs from 'fs';
import { WatchedEpisode } from '../models/WatchedEpisode.js';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';
import { User } from '../models/User.js';

const router = express.Router();

router.get('/', async (req, res) => {

  const animes = await Anime.findAll({ 
    where: { archived: false }, 
    attributes: ['id', 'title'], 
    order: [['title', 'ASC']] });
  res.json(animes);
});

router.get('/:id/episodes', async (req, res) => {

  const episodes = await Episode.findAll({
    where: { animeId: req.params.id, archived: false  },
    order: [['title', 'ASC']],
    attributes: ['id', 'title']
  });
  res.json(episodes);
});

router.get('/:userId/watched', async (req, res) => {
  const { userId } = req.params;
  const { animeId } = req.query;

  const where = { userId };
  if (animeId) where.animeId = animeId;

  const watched = await WatchedEpisode.findAll({ where });
  res.json(watched);
});

router.post('/watched-episodes', async (req, res) => {
  const { userId, animeId, episodeId } = req.body;

  const existing = await WatchedEpisode.findOne({ where: { userId, episodeId } });
  if (existing) return res.status(400).json({ error: 'Уже добавлено' });

  const episode = await WatchedEpisode.create({ userId, animeId, episodeId });
  res.json(episode);
});

router.delete('/watched-episodes', async (req, res) => {
  const { userId, episodeId } = req.body;
  await WatchedEpisode.destroy({ where: { userId, episodeId } });
  res.json({ success: true });
});

export default router;