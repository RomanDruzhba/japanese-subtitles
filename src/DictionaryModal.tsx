import React, { useEffect } from 'react';
import { DictionaryEntry } from './types'; // Убедись, что путь корректен

interface DictionaryModalProps {
  word: string;
  entries: DictionaryEntry[];
  onClose: () => void;
}

const DictionaryModal: React.FC<DictionaryModalProps> = ({ word, entries, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#fff',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80%',
          overflowY: 'auto',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginTop: 0 }}>{word}</h2>
        {entries.length > 0 ? (
          entries.map((entry, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              <p><strong>Чтение:</strong> {entry.reading}</p>
              <p><strong>Код:</strong> {entry.code}</p>
              <ul>
                {entry.senses.map((sense: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: sense }} />
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>Нет записей в словаре.</p>
        )}
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};

export default DictionaryModal;
