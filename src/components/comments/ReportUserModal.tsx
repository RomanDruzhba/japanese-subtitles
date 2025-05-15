// components/comments/ReportUserModal.tsx
import React, { useState } from 'react';
import { getCurrentUser } from '../../auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Props {
  targetUserId: number;
  commentId: number;
  onClose: () => void;
}

const ReportUserModal: React.FC<Props> = ({ targetUserId, commentId, onClose }) => {
  const [text, setText] = useState('');
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('Необходимо войти в систему для отправки жалобы');
    return;
  }

  const handleSubmit = async () => {
    if (!text.trim()) return alert('Введите текст жалобы');

    const res = await fetch(`${API_BASE_URL}/api/complaints`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintText: text.trim(),
        complainantId: currentUser.id,
        targetUserId,
        commentId,
      }),
    });

    if (res.ok) {
      alert('Жалоба отправлена');
      onClose();
    } else {
      alert('Ошибка при отправке жалобы');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow">
        <h2 className="text-lg font-semibold mb-4">Жалоба на пользователя</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          rows={4}
          className="w-full border p-2 rounded mb-4"
          placeholder="Опишите проблему..."
        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Отмена</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Отправить</button>
        </div>
      </div>
    </div>
  );
};

export default ReportUserModal;
