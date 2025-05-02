import express from 'express';
import { User } from '../models/User.js';
import { Comment } from '../models/Comment.js';


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
          attributes: ['id', 'nickname', 'avatarUrl'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.json(comments);
  } catch (error) {
    console.error('Ошибка при загрузке комментариев:', error);
    res.status(500).json({ error: 'Ошибка загрузки комментариев' });
  }
});

router.post('/', async (req, res) => {
  const { videoId, text } = req.body;
  let userId = req.session?.userId ?? null;

  const isAnonymous = !userId;

  try {
    const comment = await Comment.create({ videoId, text, userId, isAnonymous });

    const fullComment = await Comment.findByPk(comment.id, {
      include: userId
        ? { model: User, attributes: ['nickname', 'avatarUrl'] }
        : undefined,
    });

    res.status(201).json(fullComment);
  } catch (err) {
    console.error('Ошибка сохранения комментария:', err);
    res.status(500).json({ error: 'Ошибка сохранения комментария' });
  }
});
  

export default router;
