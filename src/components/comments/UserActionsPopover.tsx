// components/comments/UserActionsPopover.tsx
import React, { useState } from 'react';
import ReportUserModal from './ReportUserModal';
import UserProfileModal from './UserProfileModal';

interface Props {
  userId: number;
  nickname: string;
  avatarUrl?: string;
  commentId: number;
}

const UserActionsPopover: React.FC<Props> = ({ userId, nickname, avatarUrl, commentId }) => {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <>
      <div className="relative inline-block">
        <img
          src={avatarUrl || './default-avatar.jpg'}
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
          onClick={() => setOpen(prev => !prev)}
        />
        {open && (
          <div className="absolute z-10 left-0 mt-2 w-32 bg-white border rounded shadow-lg">
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setShowProfile(true);
                setOpen(false);
              }}
            >
              Профиль
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setShowReport(true);
                setOpen(false);
              }}
            >
              Пожаловаться
            </button>
          </div>
        )}
      </div>

      {showReport && (
        <ReportUserModal
          targetUserId={userId}
          commentId={commentId}
          onClose={() => setShowReport(false)}
        />
      )}

      {showProfile && (
        <UserProfileModal
          userId={userId}
          nickname={nickname}
          avatarUrl={avatarUrl}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
};

export default UserActionsPopover;
