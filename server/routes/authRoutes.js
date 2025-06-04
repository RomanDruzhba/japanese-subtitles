import express from 'express';
import path from 'path';
import { User } from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();


const router = express.Router();

// Ограничение на сброс пароля
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 час
  max: 5,
  message: 'Слишком много попыток сброса пароля. Попробуйте позже.',
});

// Валидация пароля
const isPasswordValid = password =>
  password.length >= 8 && /\d/.test(password) && /[\W_А-Яа-яA-Za-z]/.test(password);

// Регистрация
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password || !isPasswordValid(password)) {
    return res.status(400).json({ message: 'Email и пароль обязательны, пароль должен быть сложным.' });
  }

  const passwordValid =
    password.length >= 8 &&
    /\d/.test(password) &&
    /[\W_А-Яа-яA-Za-z]/.test(password);

  if (!passwordValid) {
    return res.status(400).json({ message: 'Пароль не соответствует требованиям.' });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Пользователь уже существует' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      password: hashedPassword,
      nickname: email.split('@')[0],
    });

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      nickname: newUser.nickname,
    });
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
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Неверный email или пароль' });
    }

    if (user.isBanned) {
      const now = new Date();
      if (!user.unbanDate || new Date(user.unbanDate) > now) {
        return res.status(403).json({ message: 'Ваш аккаунт заблокирован. Повторите попытку позже.' });
      } else {
        // автоматическое снятие бана, если срок истёк
        user.isBanned = false;
        user.unbanDate = null;
        await user.save();
      }
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

// Логаут (выход)
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Не удалось выйти из системы' });
    }
    res.clearCookie('connect.sid'); // Удаляем cookie сессии
    res.json({ message: 'Вы вышли из системы' });
  });
});

// Сброс пароля
router.post('/reset-password', resetLimiter, async (req, res) => {
  // const testAccount = await nodemailer.createTestAccount();
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email обязателен' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expires = new Date(Date.now() + 3600_000); // 1 час

    await user.update({ resetToken: tokenHash, resetTokenExpires: expires });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await transporter.sendMail({
      to: email,
      subject: 'Сброс пароля',
      html: `<p>Для сброса пароля перейдите по ссылке: <a href="${resetUrl}">${resetUrl}</a></p>`,
    });

    res.json({ message: 'Инструкция отправлена на email' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка отправки письма' });
  }
});


// Сброс пароля — установка нового
router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || !isPasswordValid(newPassword)) {
    return res.status(400).json({ message: 'Новый пароль слишком простой' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({
    where: {
      resetToken: tokenHash,
      resetTokenExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) return res.status(400).json({ message: 'Токен недействителен или истёк' });

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await user.update({
    password: hashedPassword,
    resetToken: null,
    resetTokenExpires: null,
  });

  res.json({ message: 'Пароль успешно обновлён' });
});



// Получить текущего пользователя
router.get('/current-user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Не авторизован' });
  }
});

export default router;