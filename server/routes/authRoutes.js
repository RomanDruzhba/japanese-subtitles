import express from 'express';
import { User } from '../models/User.js';

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь уже существует' });
    }

    const newUser = await User.create({ email, password, nickname: email.split('@')[0] });
    res.status(201).json({ id: newUser.id, email: newUser.email, nickname: newUser.nickname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Логин
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
  }

  try {
    const user = await User.findOne({ where: { email, password } });
    if (!user) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    req.session.userId = user.id;
    
    req.session.user = {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      avatarUrl: user.avatarUrl,
      roleId: user.roleId,
    };

    res.json(req.session.user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Не удалось выйти из системы' });
    }
    res.clearCookie('connect.sid'); // Удаляем cookie сессии
    res.json({ message: 'Вы вышли из системы' });
  });
});


router.get('/current-user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Не авторизован' });
  }
});

export default router;