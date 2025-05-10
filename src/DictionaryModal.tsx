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
        <h2 style={{ marginTop: 0, borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          {word}
        </h2>
        
        {entries.length > 0 ? (
          <div>
            {/* Лучшее совпадение - выделяем особо */}
            <div style={{
              background: '#f8f8f8',
              padding: '15px',
              borderRadius: '5px',
              marginBottom: '20px',
              borderLeft: '4px solid #4CAF50'
            }}>
              <h3 style={{ marginTop: 0, color: '#2E7D32' }}>
                {entries[0][0]} {/* Кандзи */}
                <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '10px' }}>
                  {entries[0][1]} {/* Чтение */}
                </span>
              </h3>
              <div>
                {entries[0][5].map((sense: string, i: number) => (
                  <p key={i} 
                    style={{ margin: '8px 0' }}
                    dangerouslySetInnerHTML={{ __html: sense }} 
                  />
                ))}
              </div>
            </div>
  
            {/* Остальные варианты */}
            {entries.length > 1 && (
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: '#666', borderBottom: '1px solid #eee' }}>
                  Другие варианты:
                </h4>
                {entries.slice(1).map((entry, idx) => (
                  <div 
                    key={idx} 
                    style={{
                      marginBottom: '1rem',
                      padding: '10px',
                      borderLeft: '3px solid #2196F3',
                      background: '#f5f5f5'
                    }}
                  >
                    <h4 style={{ margin: '0 0 5px 0' }}>
                      {entry[0]} {/* Кандзи */}
                      <span style={{ fontSize: '0.9em', color: '#666', marginLeft: '8px' }}>
                        {entry[1]} {/* Чтение */}
                      </span>
                    </h4>
                    <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                      {entry[5].map((sense: string, i: number) => (
                        <li 
                          key={i} 
                          style={{ marginBottom: '5px' }}
                          dangerouslySetInnerHTML={{ __html: sense }} 
                        />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#666', fontStyle: 'italic' }}>Нет записей в словаре.</p>
        )}
        
        <button 
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};

export default DictionaryModal;
