import express from 'express';
import { Anime } from '../models/Anime.js';
import { Episode } from '../models/Episode.js';
import { EpisodeRating } from '../models/EpisodeRating.js';
import { WatchedEpisode } from '../models/WatchedEpisode.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

async function archiveModelByTitle(Model, title) {
  const item = await Model.findOne({ where: { title } });
  if (!item) return null;
  item.archived = true;
  await item.save();
  return item;
}

// Архивировать аниме по названию
router.post('/archive-anime/:title', async (req, res) => {
  try {
    const result = await archiveModelByTitle(Anime, req.params.title);
    if (!result) return res.status(404).json({ error: 'Аниме не найдено' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка архивирования аниме' });
  }
});

// Архивировать эпизод
router.post('/archive-episode/:title', async (req, res) => {
  try {
    const result = await archiveModelByTitle(Episode, req.params.title);
    if (!result) return res.status(404).json({ error: 'Эпизод не найден' });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка архивирования эпизода' });
  }
});


router.delete('/delete-file', (req, res) => {
  const { filePath } = req.body;
  if (!filePath || typeof filePath !== 'string') {
    return res.status(400).json({ error: 'Неверный путь к файлу' });
  }

  const sanitizedPath = filePath.replace(/^\/?mock\/?/, '');
  const fullPath = path.resolve(BASE_DIR, sanitizedPath);

  if (!fullPath.startsWith(BASE_DIR)) {
    return res.status(403).json({ error: 'Доступ запрещён' });
  }

  if (fs.existsSync(fullPath)) {
    try {
      fs.promises.unlink(fullPath);
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
    const episode = await Episode.findOne({ where: { title: episodeTitle } });
    if (!episode) return res.status(404).json({ error: 'Эпизод не найден' });

    const anime = await Anime.findByPk(episode.animeId);
    if (!anime || anime.title !== animeTitle) {
      return res.status(404).json({ error: 'Несоответствие аниме и эпизода' });
    }

    // Удаление всех оценок этого эпизода
    await EpisodeRating.destroy({ where: { episodeId: episode.id } });

    // Удаление всех записей о просмотре
    await WatchedEpisode.destroy({ where: { episodeId: episode.id } });

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
      fs.promises.rm(subsFolder, { recursive: true, force: true });
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