// server/routes/dbEditor.js
import Database from 'better-sqlite3';
import express from 'express';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server', 'database.sqlite');
const db = new Database(dbPath);

const router = express.Router();

// Загрузка списка ролей
router.get('/roles', (req, res) => {
  const roles = db.prepare('SELECT id, name FROM roles').all();
  res.json(roles);
});

// Получить список всех таблиц
router.get('/tables', (req, res) => {
  const tables = db.prepare('SELECT name FROM sqlite_master WHERE type=\'table\' AND name NOT LIKE \'sqlite_%\';').all();
  res.json(tables.map(t => t.name));
});

// Получить данные таблицы
router.get('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(col => col.name);
  const rowsRaw = db.prepare(`SELECT * FROM ${table}`).all();
  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  const blobFields = pragma.filter(col => col.type?.toLowerCase() === 'blob').map(col => col.name);
  const sensitiveFields = ['password'];

  // Преобразуем буферы в base64 строки
  const rows = rowsRaw.map(row => {
    for (const field of blobFields) {
      if (row[field] instanceof Buffer) {
        row[field] = `data:image/png;base64,${row[field].toString('base64')}`;
      }
    }
    for (const field of sensitiveFields) {
      if (field in row) {
        row[field] = '***';
      }
    }
    return row;
  });

  res.json({ columns: pragma.map(col => col.name), rows });
});

// Добавить строку
router.post('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  const row = req.body;

  // Автоматически добавить createdAt, если поле есть
  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  if (pragma.some(col => col.name === 'createdAt')) {
    row.createdAt = new Date().toISOString();
  }

  const keys = Object.keys(row);
  const values = keys.map(k => row[k]);
  const placeholders = keys.map(() => '?').join(', ');
  db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`).run(values);
  res.sendStatus(200);
});

// Обновить строку
router.put('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  const { id, ...rest } = req.body;

  const pragma = db.prepare(`PRAGMA table_info(${table})`).all();
  const blobFields = pragma.filter(col => col.type?.toLowerCase() === 'blob').map(col => col.name);

  const keys = Object.keys(rest);
  const values = keys.map(k => {
    if (blobFields.includes(k)) {
      const val = rest[k];
      if (typeof val === 'string' && val.startsWith('data:')) {
        // Конвертация из base64
        const base64 = val.split(',')[1];
        return Buffer.from(base64, 'base64');
      } else if (val === null) {
        return null;
      } else {
        return val; // может быть уже Buffer
      }
    }
    return rest[k];
  });

  const assignments = keys.map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE ${table} SET ${assignments} WHERE id = ?`).run([...values, id]);
  res.sendStatus(200);
});

// Удалить строку
router.delete('/table/:tableName/:id', (req, res) => {
  const { tableName, id } = req.params;
  db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
  res.sendStatus(200);
});

export default router;