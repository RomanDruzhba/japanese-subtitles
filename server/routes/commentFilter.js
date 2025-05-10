// routes/commentFilter.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем путь к текущему файлу и директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Читаем файл со словами
const patterns = fs
  .readFileSync(path.join(__dirname, '../filter_russian_cached.txt'), 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

// Преобразуем строки в регулярки, добавляя ручные границы слова для кириллицы
const forbiddenWords = patterns.map(pattern => {
  const isPlainWord = /^[\wа-яёА-ЯЁ]+$/i.test(pattern);
  const wrappedPattern = isPlainWord
    ? `(^|[^а-яёА-ЯЁ])(${pattern})(?![а-яёА-ЯЁ])`
    : pattern;
  return new RegExp(wrappedPattern, 'gmi');
});

export function replaceForbiddenWords(text) {
  let filtered = text;
  for (const regex of forbiddenWords) {
    filtered = filtered.replace(regex, (match, p1, p2) => {
      if (p2) {
        return `${p1}${'*'.repeat(p2.length)}`;
      }
      return '*'.repeat(match.length);
    });
  }
  return filtered;
}