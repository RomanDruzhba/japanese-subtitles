import express from 'express';
import multer from 'multer';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';
import { WatchedEpisode } from '../models/WatchedEpisode.js';

const router = express.Router();

// multer — в память
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Получить профиль пользователя
router.get('/users/:id/profile', async (req, res) => {
  try {
    const userId = req.params.id;

    const comments = await Comment.findAll({ where: { userId } });
    const watchedEpisodes = await WatchedEpisode.findAll({ where: { userId } });

    res.json({ comments, watchedEpisodes });
  } catch (error) {
    console.error('Ошибка получения профиля', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить никнейм и аватар
router.put('/users/:id', upload.single('avatar'), async (req, res) => {
  try {
    const userId = req.params.id;
    const { nickname } = req.body;
    const avatarFile = req.file;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    user.nickname = nickname;

    if (avatarFile) {
      user.avatar = avatarFile.buffer; // сохраняем файл в БД
      user.avatarMimeType = avatarFile.mimetype; // например image/png
    }

    await user.save();

    res.json({ message: 'Профиль обновлён', user: { id: user.id, nickname: user.nickname } });
  } catch (error) {
    console.error('Ошибка обновления профиля', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

router.get('/users/:id/avatar', async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user || !user.avatar) {
    return res.status(404).send('Аватар не найден');
  }

  res.set('Content-Type', user.avatarMimeType || 'application/octet-stream');
  res.send(user.avatar);
});

router.put('/watched-episodes/:id', async (req, res) => {
  try {
    const episodeId = req.params.id;
    const { watched } = req.body;

    const episode = await WatchedEpisode.findByPk(episodeId);
    if (!episode) {
      return res.status(404).json({ error: 'Эпизод не найден' });
    }

    episode.watched = watched;
    await episode.save();

    res.json({ message: 'Статус эпизода обновлен', episode });
  } catch (error) {
    console.error('Ошибка обновления статуса эпизода', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


export default router;