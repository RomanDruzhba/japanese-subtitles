// server/routes/dbEditor.js
import Database from 'better-sqlite3';
import express from 'express';
import path from 'path';
import multer from 'multer';

const upload = multer();
const dbPath = path.join(process.cwd(), 'server', 'database.sqlite');
const db = new Database(dbPath);

const router = express.Router();

// Получение списка таблиц для whitelist
const allowedTables = db.prepare(
  'SELECT name FROM sqlite_master WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\';'
).all().map(t => t.name);

const isValidTable = (table) => /^[a-zA-Z0-9_]+$/.test(table) && allowedTables.includes(table);

// Загрузка списка ролей
router.get('/roles', (req, res) => {
  const roles = db.prepare('SELECT id, name FROM roles').all();
  res.json(roles);
});

// Получить список всех таблиц
router.get('/tables', (req, res) => {
  res.json(allowedTables);
});

// Получить данные таблицы
router.get('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  if (!isValidTable(table)) return res.status(400).json({ error: 'Invalid table name' });

  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  const rowsRaw = db.prepare(`SELECT * FROM ${table}`).all();

  const blobFields = pragma.filter(col => col.type?.toLowerCase() === 'blob').map(col => col.name);
  const sensitiveFields = ['password'];

  const visibleColumns = pragma
    .filter(col => !sensitiveFields.includes(col.name))
    .map(col => col.name);

  const rows = rowsRaw.map(row => {
    const processedRow = {};
    for (const key of visibleColumns) {
      if (blobFields.includes(key)) {
        let buf = row[key];
        if (buf && typeof buf === 'object' && buf.type === 'Buffer' && Array.isArray(buf.data)) {
          buf = Buffer.from(buf.data);
        }
        if (Buffer.isBuffer(buf)) {
          const mimeTypeKey = Object.keys(row).find(k => k.toLowerCase() === `${key.toLowerCase()}mimetype`);
          const mimeType = mimeTypeKey ? row[mimeTypeKey] : 'image/jpeg';
          processedRow[key] = `data:${mimeType};base64,${buf.toString('base64')}`;
        } else {
          processedRow[key] = null;
        }
      } else {
        processedRow[key] = row[key];
      }
    }
    return processedRow;
  });

  res.json({ columns: visibleColumns, rows });
});

// Добавить строку
router.post('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  if (!isValidTable(table)) return res.status(400).json({ error: 'Invalid table name' });

  const row = req.body;
  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  const blobFields = pragma.filter(col => col.type?.toLowerCase() === 'blob').map(col => col.name);

  for (const key of blobFields) {
    if (typeof row[key] === 'string' && row[key].startsWith('data:')) {
      const [meta, base64] = row[key].split(',');
      const mimeMatch = meta.match(/data:(.*);base64/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1];
        row[key] = Buffer.from(base64, 'base64');
        row[`${key}MimeType`] = mimeType;
      }
    }
  }

  if (pragma.some(col => col.name === 'createdAt')) {
    row.createdAt = new Date().toISOString();
  }

  const keys = Object.keys(row);
  const placeholders = keys.map(() => '?').join(', ');
  const values = keys.map(k => row[k]);

  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  db.prepare(sql).run(values);
  res.sendStatus(200);
});

// Обновить строку
router.put('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  if (!isValidTable(table)) return res.status(400).json({ error: 'Invalid table name' });

  const { id, ...rest } = req.body;
  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  const blobFields = pragma.filter(col => col.type?.toLowerCase() === 'blob').map(col => col.name);

  const keys = Object.keys(rest);
  const values = keys.map(k => {
    const val = rest[k];
    if (blobFields.includes(k) && typeof val === 'string' && val.startsWith('data:')) {
      const [meta, base64] = val.split(',');
      const mimeMatch = meta.match(/data:(.*);base64/);
      if (mimeMatch) {
        const mimeType = mimeMatch[1];
        rest[`${k}MimeType`] = mimeType;
        return Buffer.from(base64, 'base64');
      }
    }
    return val;
  });

  const assignments = keys.map(k => `${k} = ?`).join(', ');
  const sql = `UPDATE ${table} SET ${assignments} WHERE id = ?`;
  db.prepare(sql).run([...values, id]);
  res.sendStatus(200);
});

// Удалить строку
router.delete('/table/:tableName/:id', (req, res) => {
  const { tableName, id } = req.params;
  if (!isValidTable(tableName)) return res.status(400).json({ error: 'Invalid table name' });

  db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
  res.sendStatus(200);
});

// Удалить постер
router.delete('/delete-poster/:animeId', async (req, res) => {
  try {
    const { Anime } = await import('../models/Anime.js');
    const anime = await Anime.findByPk(req.params.animeId);
    if (!anime) return res.status(404).json({ error: 'Anime not found' });

    anime.poster = null;
    anime.posterMimeType = null;
    await anime.save();

    res.status(200).json({ message: 'Poster removed successfully' });
  } catch (err) {
    console.error('Failed to delete poster:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
