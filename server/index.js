// server/index.js

import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import dbEditorRoutes from './routes/dbEditor.js';
import commentsRoutes from './routes/comments.js';
import animeRoutes from './routes/animes.js';
import adminoutes from './routes/admin.js';

import session from 'express-session';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3000;

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, 
    maxAge:  24 * 60 * 60 * 1000 // 1 день в миллисекундах (для авторизованного пользователя)
  } 
}));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // <--- ВАЖНО
}));
app.use(express.json({ limit: '10mb' }));

app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', videoRoutes);
app.use('', uploadRoutes);
app.use('/api/db', dbEditorRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/animes', animeRoutes);
app.use('/api/admin', adminoutes);


const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

app.delete('/delete', (req, res) => {
  const { animeTitle, episodeTitle } = req.body;
  if (!animeTitle || !episodeTitle) {
    return res.status(400).json({ error: 'Недостаточно данных' });
  }

  const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
  const safeEpisode = episodeTitle.trim().replace(/\s+/g, '_');

  const videoPath = path.join(BASE_DIR, safeAnime, `${safeEpisode}.webm`);
  const subsDirPath = path.join(BASE_DIR, safeAnime, 'subs', safeEpisode);

  const messages = [];

  // Удаление видео
  if (fs.existsSync(videoPath)) {
    try {
      fs.unlinkSync(videoPath);
      messages.push('Видео удалено');
    } catch (err) {
      return res.status(500).json({ error: 'Ошибка при удалении видео', details: err.message });
    }
  }

  // Удаление папки с сабами
  if (fs.existsSync(subsDirPath)) {
    try {
      fs.rmSync(subsDirPath, { recursive: true, force: true });
      messages.push('Субтитры удалены');
    } catch (err) {
      return res.status(500).json({ error: 'Ошибка при удалении субтитров', details: err.message });
    }
  }

  res.json({ message: messages.join('; ') || 'Ничего не найдено для удаления' });
});


// Статика
app.use('/mock', express.static(path.join(__dirname, '../public/mock')));
app.use(express.static(path.join(__dirname, '../dist')));


// Фоллбэк для SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});

