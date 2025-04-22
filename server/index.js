import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const anime = req.headers['x-anime-title'];
    const type = req.headers['x-type'];

    if (!anime || !type) return cb(new Error('Missing headers'), '');

    const safeAnime = anime.toString().trim().replace(/\s+/g, '_');

    const uploadPath = type === 'subtitle'
      ? path.join(BASE_DIR, safeAnime, 'subs')
      : path.join(BASE_DIR, safeAnime);

    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).trim();
    const rawName = path.basename(file.originalname, ext);
    const safeName = rawName.trim().replace(/\s+/g, '_');
    cb(null, `${safeName}${ext}`);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Файл загружен' });
});

app.delete('/delete', (req, res) => {
  const { animeTitle, filename, type } = req.body;

  console.log('🧾 Пришло на удаление:', req.body);

  if (!animeTitle || !filename || !type) {
    console.error('❌ Недостаточно данных:', req.body);
    return res.status(400).json({ error: 'Недостаточно данных' });
  }

  const safeAnime = animeTitle.trim().replace(/\s+/g, '_');
  const safeFilename = filename.trim().replace(/\s+/g, '_');

  const filePath = type === 'subtitle'
    ? path.join(BASE_DIR, safeAnime, 'subs', safeFilename)
    : path.join(BASE_DIR, safeAnime, safeFilename);

  console.log('🗑 Удаление файла:', filePath);

  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ Файл не существует, пропускаем:', filePath);
    return res.json({ message: 'Файл уже отсутствует, пропущен' });
  }

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('❌ Ошибка unlink:', err.message);
      return res.status(500).json({ error: 'Ошибка при удалении файла', details: err.message });
    }
    console.log('✅ Удалено:', filePath);
    res.json({ message: 'Файл удалён' });
  });
});

app.listen(5000, () => {
  console.log('🚀 Сервер запущен на http://localhost:5000');
});
