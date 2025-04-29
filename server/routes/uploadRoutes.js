import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const BASE_DIR = path.join(process.cwd(), 'public', 'mock');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const anime = req.headers['x-anime-title'];
    const type = req.headers['x-type'];
    if (!anime || !type) return cb(new Error('Missing headers'), '');

    const safeAnime = anime.toString().trim().replace(/\s+/g, '_');
    const episode = req.headers['x-episode-title']?.toString().trim().replace(/\s+/g, '_') || 'unknown';
    const uploadPath = type === 'subtitle'
      ? path.join(BASE_DIR, safeAnime, 'subs', episode)
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



router.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'Файл загружен' });
});

export default router;