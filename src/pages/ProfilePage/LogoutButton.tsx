import React from 'react';
import { logout } from '../../auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Ошибка при выходе:', err);
    }

    logout();
    window.location.href = '/login';

  };

  return (
    <div className="text-center">
      <button onClick={handleLogout} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded" >
                Выйти
      </button>
    </div>
  );
};

export default LogoutButton;