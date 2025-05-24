import express from 'express';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

// Архивировать аниме по названию
router.post('/archive-anime/:title', async (req, res) => {
  try {
    const anime = await Anime.findOne({ where: { title: req.params.title } });
    if (!anime) return res.status(404).json({ error: 'Аниме не найдено' });
    anime.archived = true;
    await anime.save();
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка архивирования аниме' });
  }
});

// Архивировать эпизод
router.post('/archive-episode/:title', async (req, res) => {
  const episode = await Episode.findOne({ where: { title: req.params.title } });
  if (!episode) return res.status(404).json({ error: 'Эпизод не найден' });
  episode.archived = true;
  await episode.save();
  res.json({ success: true });
});


router.delete('/delete-file', (req, res) => {
  const { filePath } = req.body;
  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'Неверный путь к файлу' });
  }

  const sanitizedPath = filePath.replace(/^\/?mock\/?/, '');
  const fullPath = path.join(BASE_DIR, sanitizedPath);

  if (!fullPath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }

  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
      return res.json({ message: 'Файл удалён' });
    } catch (err) {
      return res.status(500).json({ error: 'Ошибка при удалении', details: err.message });
    }
  } else {
    return res.status(404).json({ error: 'Файл не найден' });
  }
});

router.post('/delete-episode-completely', async (req, res) => {
  const { episodeTitle, animeTitle } = req.body;

  if (!episodeTitle || !animeTitle) {
    return res.status(400).json({ error: 'Не указаны название эпизода или аниме' });
  }

  try {
    const episode = await Episode.findOne({
      where: { title: episodeTitle },
      include: {
        model: Anime,
        where: { title: animeTitle }
      }
    });

    if (!episode) {
      return res.status(404).json({ error: 'Эпизод не найден' });
    }

    // Удаление видеофайла
    if (episode.videoUrl) {
      const videoPath = path.join(BASE_DIR, episode.videoUrl.replace(/^\/?mock\/?/, ''));
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
      }
    }

    // Удаление папки с сабами
    const subsFolder = path.join(BASE_DIR, animeTitle, episodeTitle, 'subtitles');
    if (fs.existsSync(subsFolder)) {
      fs.rmSync(subsFolder, { recursive: true, force: true });
    }

    // Удаление записи из базы
    await episode.destroy();

    res.json({ message: 'Эпизод полностью удалён' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка удаления эпизода', details: err.message });
  }
});

export default router;