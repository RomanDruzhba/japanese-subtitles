// src/components/comments/CommentsSection.tsx

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../auth';
import UserActionsPopover from './UserActionsPopover';

interface Comment {
  id: number;
  text: string;
  user: {
    id: number;
    nickname: string;
    avatarUrl: string;
  };
  isAnonymous?: boolean;
}

interface Props {
  videoId: string;
}

// const SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const COMMENTS_PER_PAGE = 5;

const CommentsSection: React.FC<Props> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/comments/${videoId}`, { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setComments(data);
        } else {
          console.error('Ошибка в данных комментариев:', data);
        }
      })
      .catch(error => {
        console.error('Ошибка при загрузке комментариев:', error);
      });
  }, [videoId]);

  const handleAddComment = async () => {
    if (!input.trim()) return;

    if (input.length > 300) {
      alert('Комментарий не должен превышать 300 символов');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Вы должны войти, чтобы оставить комментарий');
      return;
    }

    const res = await fetch(`${API_BASE_URL}/api/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        videoId,
        text: input.trim(),
        userId: currentUser.id,
      }),
      credentials: 'include',
    });

    const newComment = await res.json();
    setComments(prev => [...prev, newComment]);
    setInput('');
  };

  const totalPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
  const pagedComments = comments
    .slice()
    .reverse()
    .slice((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE);

  return (
    <div className="mt-8 p-4 border-t border-gray-300">
      <h3 className="text-lg font-semibold mb-4">Комментарии</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          maxLength={300}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Оставить комментарий (до 300 символов)..."
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Отправить
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-4">
        {pagedComments.map((c) => (
          <div
            key={c.id}
            className="flex items-start gap-3 bg-white shadow p-4 rounded-xl"
          >
            <UserActionsPopover
              userId={c.user?.id}
              nickname={c.user?.nickname}
              avatarUrl={c.user?.avatarUrl}
              commentId={c.id}
            />
            <div>
              <strong className="block mb-1">{c.isAnonymous ? 'Аноним' : c.user?.nickname}</strong>
              <p className="text-gray-800">{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              return (
                page <= 3 ||
                page > totalPages - 2 ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .reduce((acc, page, i, arr) => {
              if (i > 0 && page - arr[i - 1] > 1) {
                acc.push('...');
              }
              acc.push(page);
              return acc;
            }, [] as (number | string)[]).map((item, idx) =>
              item === '...' ? (
                <span key={`ellipsis-${idx}`} className="mx-2">...</span>
              ) : (
                <button
                  key={item}
                  onClick={() => setCurrentPage(Number(item))}
                  className={`px-3 py-1 rounded ${
                    currentPage === item
                      ? 'bg-blue-500 text-white font-bold'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {item}
                </button>
              )
            )}
        </div>
      )}
    </div>
  );
};

export default CommentsSection;
