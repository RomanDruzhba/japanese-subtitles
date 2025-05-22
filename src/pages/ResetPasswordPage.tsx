import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });

      if (res.ok) {
        setStatus('Пароль обновлён, можете войти');
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await res.json();
        setStatus(data.message || 'Ошибка');
      }
    } catch {
      setStatus('Ошибка сети');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-2xl mb-4">Сброс пароля</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          maxLength={50}
          type="password"
          placeholder="Новый пароль"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-3 border rounded"
          required
        />
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">Обновить пароль</button>
      </form>
      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
    </div>
  );
};
