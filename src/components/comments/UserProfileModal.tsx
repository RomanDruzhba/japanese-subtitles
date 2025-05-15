// components/comments/UserProfileModal.tsx
import React from 'react';

interface Props {
  userId: number;
  nickname: string;
  avatarUrl?: string;
  onClose: () => void;
}

const UserProfileModal: React.FC<Props> = ({ nickname, avatarUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow w-80 text-center">
        <img
          src={avatarUrl || './default-avatar.jpg'}
          alt="avatar"
          className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
        />
        <h2 className="text-xl font-bold">{nickname}</h2>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default UserProfileModal;
