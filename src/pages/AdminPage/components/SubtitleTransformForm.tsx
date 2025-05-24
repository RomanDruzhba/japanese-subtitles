import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const SubtitleTransformForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [operation, setOperation] = useState<'translate' | 'tokenize'>('translate');
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('ru');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('Выберите файл');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('operation', operation);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    try {
      const response = await axios.post<Blob>(`${API_BASE_URL}/api/subtitles/transform`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/vtt' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Ошибка при обработке файла');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label>Файл субтитров (.vtt)</label>
      <input type="file" accept=".vtt" onChange={(e) => setFile(e.target.files?.[0] || null)} />

      <label>Операция</label>
      <select value={operation} onChange={(e) => setOperation(e.target.value as any)} className="w-full border p-2 rounded">
        <option value="translate">Перевод</option>
        <option value="tokenize">Разбивка</option>
      </select>

      {operation === 'translate' && (
        <>
          <label>Язык оригинала</label>
          <select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)} className="w-full border p-2 rounded">
            <option value="ja">Японский</option>
            <option value="ru">Русский</option>
          </select>

          <label>Язык перевода</label>
          <select value={targetLang} onChange={(e) => setTargetLang(e.target.value)} className="w-full border p-2 rounded">
            <option value="ru">Русский</option>
            <option value="ja">Японский</option>
            <option value="en">Английский</option>
          </select>
        </>
      )}

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Обработать</button>

      {downloadUrl && (
        <div>
          <a
            href={downloadUrl}
            download={`subtitles_${operation}.vtt`}
            className="text-blue-500 underline"
          >
            Скачать результат
          </a>
        </div>
      )}
    </form>
  );
};

export default SubtitleTransformForm;
