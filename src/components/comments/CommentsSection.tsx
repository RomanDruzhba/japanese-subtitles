import React, { useEffect, useState } from 'react';

interface Comment {
  id: number;
  text: string;
}

interface Props {
    videoId: string;
  }



  const CommentsSection: React.FC<Props> = ({ videoId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [input, setInput] = useState('');
  
    const STORAGE_KEY = `comments:${videoId}`;
  
    useEffect(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          setComments(JSON.parse(saved));
        } catch (e) {
          console.error('Ошибка парсинга комментариев:', e);
        }
      }
    }, [STORAGE_KEY]);
  
    useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
    }, [comments, STORAGE_KEY]);
  
    const handleAddComment = () => {
      if (!input.trim()) return;
  
      const newComment: Comment = {
        id: Date.now(),
        text: input.trim(),
      };
  
      setComments([...comments, newComment]);
      setInput('');
    };
  
    return (
      <div style={styles.container}>
        <h3>Комментарии</h3>
        <div style={styles.commentList}>
          {comments.map((c) => (
            <div key={c.id} style={styles.comment}>
              {c.text}
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
  },
  comment: {
    backgroundColor: '#f5f5f5',
    padding: '0.5rem',
    borderRadius: '4px',
    marginBottom: '0.5rem',
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
