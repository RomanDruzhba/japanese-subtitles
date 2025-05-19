import express from 'express';
import { User } from '../models/User.js';
import crypto from 'node:crypto';
import nodemailer from 'nodemailer';
import { Op } from 'sequelize';


const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email и пароль обязательны' });
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

    const newUser = await User.create({
      email,
      password,
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
    const user = await User.findOne({ where: { email, password } });

    if (!user) {
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
router.post('/reset-password', async (req, res) => {
  const testAccount = await nodemailer.createTestAccount();
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email обязателен' });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ message: 'Пользователь не найден' });

  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 3600_000); // 1 час

  await user.update({ resetToken: token, resetTokenExpires: expires });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'myb334455@gmail.com',
      pass: 'rveo zcrg kfti opls ',
    },
  });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${token}`;
  await transporter.sendMail({
    to: email,
    subject: 'Сброс пароля',
    html: `<p>Для сброса пароля перейдите по ссылке: <a href="${resetUrl}">${resetUrl}</a></p>`,
  });

  res.json({ message: 'Инструкция отправлена на email' });
});


router.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const user = await User.findOne({
    where: {
      resetToken: token,
      resetTokenExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) return res.status(400).json({ message: 'Токен недействителен или истёк' });

  await user.update({
    password: newPassword,
    resetToken: null,
    resetTokenExpires: null,
  });

  res.json({ message: 'Пароль успешно обновлён' });
});




router.get('/current-user', (req, res) => {
  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: 'Не авторизован' });
  }
});

export default router;