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

const CommentsSection: React.FC<Props> = ({ videoId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    fetch(`${SERVER_URL}/api/comments/${videoId}`)
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
    });

    const newComment = await res.json();
    setComments(prev => [...prev, newComment]);
    setInput('');
  };

  return (
    <div style={styles.container}>
      <h3>Комментарии</h3>
      <div style={styles.commentList}>
        {comments.map((c) => (
          <div key={c.id} style={styles.comment}>
            
            <img
              src={
                c.isAnonymous
                  ? '/default-avatar.png'
                  : SERVER_URL + c.user?.avatarUrl
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
      <div style={styles.inputSection}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Оставить комментарий..."
          style={styles.input}
        />
        <button onClick={handleAddComment} style={styles.button}>
          Отправить
        </button>
      </div>
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
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.5rem',
  },
  button: {
    padding: '0.5rem 1rem',
  },
};

export default CommentsSection;
