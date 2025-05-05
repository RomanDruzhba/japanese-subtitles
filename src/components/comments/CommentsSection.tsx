// src/components/comments/CommentsSection.tsx

import React, { useEffect, useState } from 'react';
import { getCurrentUser } from '../../auth';

interface Comment {
  id: number;
  text: string;
  user: {
    nickname: string;
    avatarUrl: string;
  };
  isAnonymous?: boolean;
}

interface Props {
  videoId: string;
}

const SERVER_URL = 'http://localhost:3000';
const COMMENTS_PER_PAGE = 5;

const CommentsSection: React.FC<Props> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/comments/${videoId}`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then((data) => {
        
        if (Array.isArray(data)) {
          setComments(data); // Устанавливаем данные, если это массив
        } else {
          console.error('Ошибка в данных комментариев:', data); // Логируем ошибку, если данные не массив
        }
      })
      .catch((error) => {
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

    const res = await fetch(`${SERVER_URL}/api/comments`, {
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
    <div style={styles.container}>
      <h3>Комментарии</h3>

      <div style={styles.inputSection}>
        <input
          type="text"
          maxLength={300}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Оставить комментарий (до 300 символов)..."
          style={styles.input}
        />
        <button onClick={handleAddComment} style={styles.button}>
          Отправить
        </button>
      </div>

      <div style={styles.commentList}>
        {pagedComments.map((c) => (
          <div key={c.id} style={styles.comment}>
            <img
              src={
                c.isAnonymous || !c.user?.avatarUrl
                  ? './default-avatar.jpg'
                  : c.user.avatarUrl
              }
              alt="avatar"
              style={styles.avatar}
            />
            <div>
              <strong>{c.isAnonymous ? 'Аноним' : c.user?.nickname}</strong>
              <p>{c.text}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                ...styles.pageButton,
                fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
      
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    marginTop: '2rem',
    padding: '1rem',
    borderTop: '1px solid #ccc',
  },
  commentList: {
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  comment: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  },
  inputSection: {
    display: 'flex',
    gap: 8,
    marginBottom: 16
  },
  input: {
    flex: 1,
    padding: 8,
  },
  button: {
    padding: '0.5rem 1rem',
  },
  pagination: { 
    display: 'flex',
    gap: 6, 
    justifyContent: 'center',
    marginTop: 16 
  },
  pageButton: { 
    padding: '4px 8px',
    cursor: 'pointer' 
  },
};

export default CommentsSection;
