import express from 'express';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';
import { WatchedEpisode } from '../models/WatchedEpisode.js';

const router = express.Router();

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
router.put('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { nickname, avatarUrl } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    user.nickname = nickname;
    user.avatarUrl = avatarUrl;
    await user.save();

    res.json({ message: 'Профиль обновлен', user });
  } catch (error) {
    console.error('Ошибка обновления профиля', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
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