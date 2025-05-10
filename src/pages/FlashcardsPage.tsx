import React, { useEffect, useState } from 'react';
import { flashcards, FlashcardStatus } from '../data/flashcards';

const FlashcardsPage: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [statusMap, setStatusMap] = useState<Record<number, FlashcardStatus>>({});
  const [filter, setFilter] = useState<'all' | 'unknown'>('all');

  const STORAGE_KEY = 'flashcard_status';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setStatusMap(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statusMap));
  }, [statusMap]);

  const filteredCards = flashcards.filter(card =>
    filter === 'all' || statusMap[card.id] !== 'known'
  );

  const card = filteredCards[index % filteredCards.length];

  const handleMark = (status: FlashcardStatus) => {
    setStatusMap({ ...statusMap, [card.id]: status });
    handleNext();
  };

  const handleNext = () => {
    setShowBack(false);
    setIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setShowBack(false);
    setIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  return (
    <div style={styles.container}>
      <h2>Карточки для изучения</h2>

      <div style={styles.filters}>
        <button onClick={() => setFilter('all')} disabled={filter === 'all'}>Все</button>
        <button onClick={() => setFilter('unknown')} disabled={filter === 'unknown'}>Незапомненные</button>
      </div>

      {card ? (
        <>
          <div style={styles.card} onClick={() => setShowBack(!showBack)}>
            {showBack ? card.back : card.front}
          </div>

          <div style={styles.controls}>
            <button onClick={handlePrev}>Назад</button>
            <button onClick={handleNext}>Далее</button>
          </div>

          <div style={styles.mark}>
            <button onClick={() => handleMark('known')}>Запомнил</button>
            <button onClick={() => handleMark('unknown')}>Повторить позже</button>
          </div>
        </>
      ) : (
        <p>Нет карточек для отображения</p>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    textAlign: 'center',
    padding: '2rem',
  },
  card: {
    fontSize: '2rem',
    padding: '2rem',
    margin: '2rem auto',
    width: '300px',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    backgroundColor: '#fff',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  mark: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  filters: {
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
};

export default FlashcardsPage;
