import express from 'express';
import { Op } from 'sequelize';
import { Card } from '../models/Card.js';

const router = express.Router();

// Интервальное повторение — простая логика (можно доработать)
function sm2(card, quality) {
  let { efactor, interval, repetition } = card;

  const now = new Date();
  let nextAppearance;

  if (quality < 3) {
    // Сброс повтора
    repetition = 0;
    efactor = 2.5; // можно сбрасывать или оставить
    switch (quality) {
    case 0: // снова
      nextAppearance = new Date(now.getTime() + 30 * 1000); // 30 секунд
      break;
    case 2: // трудно
      nextAppearance = new Date(now.getTime() + 10 * 60 * 1000); // 10 минут
      break;
    case 3: // сложно
      nextAppearance = new Date(now.getTime() + 30 * 60 * 1000); // 1 час
      break;
    default:
      nextAppearance = new Date(now.getTime() + 60 * 60 * 1000); // fallback: 1 час
    }
    interval = 0;
  } else {
    repetition += 1;
    if (repetition === 1) interval = 1;
    else if (repetition === 2) interval = 6;
    else interval = Math.round(interval * efactor);

    efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (efactor < 1.3) efactor = 1.3;

    nextAppearance = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000); // дни

  }

  return { efactor, interval, repetition, nextAppearance };
}

const difficultyMap = {
  'снова': 0,
  'трудно': 2,
  'сложно': 3,
  'легко': 5,
};

// GET /api/cards?userId=123
router.get('/', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: 'userId is required' });

  try {
    const allCards = await Card.findAll({ where: { userId } });
    res.json(allCards);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  const { userId, word, translation, reading } = req.body;

  if (!userId || !word || !translation) {
    return res.status(400).json({ error: 'userId, word и translation обязательны' });
  }

  try {
    const now = new Date();
    const card = await Card.create({
      userId,
      word,
      translation,
      reading,
      difficulty: '',
      nextAppearance: new Date(now.getTime()),
      repetition: 0,
      interval: 0,
      efactor: 2.5
    });

    res.status(201).json({ success: true, card });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера при создании карточки' });
  }
});

// POST /api/cards/:id/update
router.post('/:id/update', async (req, res) => {
  const { id } = req.params;
  const { difficulty } = req.body;

  if (!['трудно', 'сложно', 'легко', 'снова'].includes(difficulty)) {
    return res.status(400).json({ error: 'Invalid difficulty' });
  }

  try {
    const card = await Card.findByPk(id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    const quality = difficultyMap[difficulty];
    const update = sm2(card, quality);
    Object.assign(card, update, { difficulty });
    await card.save();

    res.json({ success: true, card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


router.patch('/:id/update', async (req, res) => {
  const { id } = req.params;
  const { word, translation, reading } = req.body;

  try {
    const card = await Card.findByPk(id);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    if (word) card.word = word;
    if (translation) card.translation = translation;
    if (reading !== undefined) card.reading = reading;

    await card.save();
    res.json({ success: true, card });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
