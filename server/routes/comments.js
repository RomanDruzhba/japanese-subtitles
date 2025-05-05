// routes/comments.js

import express from 'express';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';
import { replaceForbiddenWords } from './commentFilter.js';


const router = express.Router();

// Получить комментарии по videoId
router.get('/:videoId', async (req, res) => {
  try {
    const videoId = req.params.videoId;
    const comments = await Comment.findAll({
      where: { videoId },
      include: [
        {
          model: User,
          attributes: ['id', 'nickname', 'avatar', 'avatarMimeType'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });
    
    const commentsWithAvatarBase64 = comments.map(comment => {
      const json = comment.toJSON();
      if (json.user && json.user.avatar) {
        json.user.avatarUrl = `data:${json.user.avatarMimeType};base64,${json.user.avatar.toString('base64')}`;
        delete json.user.avatar; // убираем сырые бинарные данные из ответа
        delete json.user.avatarMimeType;
      }
      return json;
    });
    
    res.json(commentsWithAvatarBase64);
  } catch (error) {
    console.error('Ошибка при загрузке комментариев:', error);
    res.status(500).json({ error: 'Ошибка загрузки комментариев' });
  }
});

router.post('/', async (req, res) => {
  const { videoId, text } = req.body;
  const userId = req.session?.userId ?? null;

  const isAnonymous = !userId;

  const filteredText = replaceForbiddenWords(text);

  try {
    // Создаём комментарий
    const comment = await Comment.create({ videoId, text: filteredText, userId, isAnonymous });

    // Загружаем с присоединённым пользователем (если он есть)
    const fullComment = await Comment.findByPk(comment.id, {
      include: userId
        ? { model: User, attributes: ['id', 'nickname', 'avatar', 'avatarMimeType'] }
        : undefined,
    });

    // Преобразуем в JSON и обработаем аватар
    const json = fullComment.toJSON();

    if (json.user && json.user.avatar) {
      json.user.avatarUrl = `data:${json.user.avatarMimeType};base64,${json.user.avatar.toString('base64')}`;
      delete json.user.avatar;
      delete json.user.avatarMimeType;
    }

    res.status(201).json(json);
  } catch (err) {
    console.error('Ошибка сохранения комментария:', err);
    res.status(500).json({ error: 'Ошибка сохранения комментария' });
  }
});
  

export default router;
