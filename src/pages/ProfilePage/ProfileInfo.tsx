import React, { useEffect, useState } from 'react';
import { saveCurrentUser } from '../../auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const ProfileInfo = ({ user, setUser, message, setMessage }: any) => {
  const [nickname, setNickname] = useState(user.nickname || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatarUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/users/${user.id}/avatar`)
      .then(res => res.blob())
      .then(blob => setAvatarUrl(URL.createObjectURL(blob)))
      .catch(() => {});
  }, [user]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('nickname', nickname);
      if (selectedFile) formData.append('avatar', selectedFile);

      const response = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const updatedUser = { ...user, nickname, avatarUrl: result.avatarUrl };
        saveCurrentUser(updatedUser);
        setUser(updatedUser);
        setAvatarUrl(result.avatarUrl);
        setMessage('Профиль обновлён!');
      } else {
        setMessage('Ошибка обновления');
      }
    } catch {
      setMessage('Ошибка подключения к серверу');
    }

  };

  return (
    <div className="bg-white rounded-xl shadow p-6 text-center space-y-4">
      <img
        src={avatarUrl || '/default-avatar.jpg'}
        alt="Аватар"
        className="w-28 h-28 rounded-full mx-auto object-cover"
      />
      <input
        type="text"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
        className="w-full p-2 border rounded"
      />
      <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Сохранить изменения
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
};

export default ProfileInfo;