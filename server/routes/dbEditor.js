// server/routes/dbEditor.js
import Database from 'better-sqlite3';
import express from 'express';
import path from 'path';

const dbPath = path.join(process.cwd(), 'server', 'database.sqlite');
const db = new Database(dbPath);

const router = express.Router();

// Получить список всех таблиц
router.get('/tables', (req, res) => {
  const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';`).all();
  res.json(tables.map(t => t.name));
});

// Получить данные таблицы
router.get('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  const columns = db.prepare(`PRAGMA table_info(${table})`).all().map(col => col.name);
  const rows = db.prepare(`SELECT * FROM ${table}`).all();
  res.json({ columns, rows });
});

// Добавить строку
router.post('/table/:tableName', (req, res) => {
  const table = req.params.tableName;
  const row = req.body;
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
  const keys = Object.keys(rest);
  const values = keys.map(k => rest[k]);
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