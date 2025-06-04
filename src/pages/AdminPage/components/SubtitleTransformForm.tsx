import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const SubtitleTransformForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [operation, setOperation] = useState<'translate' | 'tokenize'>('translate');
  const [sourceLang, setSourceLang] = useState('ja');
  const [targetLang, setTargetLang] = useState('ru');
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDownloadUrl(null);
    setError(null);
    setStatus(null);

    if (!file) {
      setError('Выберите файл');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('operation', operation);
    formData.append('sourceLang', sourceLang);
    formData.append('targetLang', targetLang);

    setIsLoading(true);
    setStatus('Загружаю файл и обрабатываю...');

    try {
      const response = await axios.post<Blob>(`${API_BASE_URL}/api/subtitles/transform`, formData, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/vtt' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setStatus('✅ Обработка завершена');
    } catch (err: any) {
      console.error(err);
      setError('Ошибка при обработке файла');
      setStatus('❌ Произошла ошибка');
    } finally {
      setIsLoading(false);
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

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={isLoading}>
        {isLoading ? 'Обработка...' : 'Обработать'}
      </button>

      {isLoading && <p className="text-gray-600">⏳ Пожалуйста, подождите...</p>}

      {status && <p className="text-sm text-gray-700">{status}</p>}

      {error && <p className="text-red-600 font-semibold">{error}</p>}

      {downloadUrl && (
        <div>
          <a
            href={downloadUrl}
            download={`subtitles_${operation}.vtt`}
            className="text-blue-500 underline"
          >
            📥 Скачать результат
          </a>
        </div>
      )}
    </form>
  );
};

export default SubtitleTransformForm;
