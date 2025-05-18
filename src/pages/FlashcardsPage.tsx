import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface Card {
  id: number;
  word: string;
  translation: string;
  difficulty: 'трудно' | 'сложно' | 'легко' | 'снова';
  nextAppearance: string;
  efactor: number;
  interval: number;
  repetition: number;
}

const FlashcardsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [shuffled, setShuffled] = useState<Card[]>([]);
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [editedCardId, setEditedCardId] = useState<number | null>(null);
  const [editedFields, setEditedFields] = useState<{ word?: string; translation?: string }>({});

  const fetchCards = async () => {
    const res = await fetch(`/api/cards?userId=${currentUser?.id}`);
    const data = await res.json();
    const due = data.filter((card: Card) => new Date(card.nextAppearance) <= new Date());
    const shuffled = due.sort(() => Math.random() - 0.5);
    setCards(data);
    setShuffled(shuffled);
    setIndex(0);
  };

  useEffect(() => {
    if (currentUser) {
      fetchCards();
      const interval = setInterval(fetchCards, 30000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleAnswer = async (difficulty: Card['difficulty']) => {
    const card = shuffled[index];
    await fetch(`/api/cards/${card.id}/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
    });
    await fetchCards();
    setShowBack(false);
  };

  const handleEdit = (id: number) => {
    setEditedCardId(id);
    const card = cards.find((c) => c.id === id);
    if (card) setEditedFields({ word: card.word, translation: card.translation });
  };

  const handleSave = async (id: number) => {
    await fetch(`/api/cards/${id}/update`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editedFields),
    });
    setEditedCardId(null);
    setEditedFields({});
    await fetchCards();
  };

  const card = shuffled[index];

  const difficultyMap: Record<Card['difficulty'], number> = {
    'трудно': 2,
    'сложно': 3,
    'легко': 5,
    'снова': 0,
  };

  function getNextAppearance(card: Card, difficulty: Card['difficulty']) {
    const quality = difficultyMap[difficulty];
    const now = new Date();

    if (card.repetition === 0) {
      switch (quality) {
      case 0: // 'снова'
        return new Date(now.getTime() + 30 * 1000); // 30 секунд
      case 2: // 'трудно'
        return new Date(now.getTime() + 10 * 60 * 1000); // 10 минут
      case 3: // 'сложно'
        return new Date(now.getTime() + 60 * 60 * 1000); // 1 час
      case 5: // 'легко'
        return new Date(now.getTime() + 24 * 60 * 60 * 1000); // 1 день
      default:
        return new Date(now.getTime() + 60 * 60 * 1000); // по умолчанию 1 час
      }
    }

    let { efactor, interval, repetition } = card;

    if (quality < 3) {
      repetition = 0;
      interval = 1;
    } else {
      repetition += 1;
      if (repetition === 1) interval = 1;
      else if (repetition === 2) interval = 6;
      else interval = Math.round(interval * efactor);

      efactor = efactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      if (efactor < 1.3) efactor = 1.3;
    }

    return new Date(now.getTime() + interval * 24 * 60 * 60 * 1000);
  }

  function formatTimeDifference(nextDate: Date): string {
    const now = new Date();
    const diffMs = nextDate.getTime() - now.getTime();
    const seconds = Math.round(diffMs / 1000);

    if (seconds < 60) return 'менее минуты';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} мин`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч ${Math.floor((seconds % 3600) / 60)} мин`;

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    return `${days} дн ${hours} ч`;
  }

  return (
    <div className="text-center p-8">
      <h2 className="text-2xl font-semibold mb-4">Ваши флешкарты</h2>

      <button
        onClick={() => setShowTable(!showTable)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-6"
      >
        {showTable ? 'Скрыть таблицу' : 'Показать таблицу'}
      </button>

      {card ? (
        <>
          <div
            className="text-3xl px-8 py-6 mx-auto w-72 border-2 border-gray-700 rounded-xl cursor-pointer bg-white shadow-md mb-6"
            onClick={() => setShowBack(!showBack)}
          >
            {showBack ? card.translation : card.word}
          </div>

          <div className="flex justify-center gap-4 flex-wrap mb-8">
            {(['трудно', 'сложно', 'легко', 'снова'] as Card['difficulty'][]).map((diff) => {
              const predicted = card ? getNextAppearance(card, diff) : null;
              return (
                <div key={diff} className="flex flex-col items-center">
                  <button
                    onClick={() => handleAnswer(diff)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    {diff[0].toUpperCase() + diff.slice(1)}
                  </button>
                  {predicted && (
                    <small className="text-gray-500 text-sm mt-1">
                      {formatTimeDifference(predicted)}
                    </small>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-gray-600">Нет карточек для повторения</p>
      )}

      {showTable && (
        <div className="overflow-x-auto mt-8">
          <table className="table-auto mx-auto border border-gray-300 w-full max-w-4xl text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Слово</th>
                <th className="border px-4 py-2">Перевод</th>
                <th className="border px-4 py-2">Сложность</th>
                <th className="border px-4 py-2">Следующее повторение</th>
                <th className="border px-4 py-2">Действие</th>
              </tr>
            </thead>
            <tbody>
              {cards.map((c) => (
                <tr key={c.id} className="odd:bg-white even:bg-gray-50">
                  <td className="border px-4 py-2">
                    {editedCardId === c.id ? (
                      <input
                        value={editedFields.word ?? ''}
                        onChange={(e) =>
                          setEditedFields((prev) => ({ ...prev, word: e.target.value }))
                        }
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      c.word
                    )}
                  </td>
                  <td className="border px-4 py-2">
                    {editedCardId === c.id ? (
                      <input
                        value={editedFields.translation ?? ''}
                        onChange={(e) =>
                          setEditedFields((prev) => ({ ...prev, translation: e.target.value }))
                        }
                        className="border px-2 py-1 w-full rounded"
                      />
                    ) : (
                      c.translation
                    )}
                  </td>
                  <td className="border px-4 py-2">{c.difficulty}</td>
                  <td className="border px-4 py-2">
                    {new Date(c.nextAppearance).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {editedCardId === c.id ? (
                      <button
                        onClick={() => handleSave(c.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Сохранить
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(c.id)}
                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Редактировать
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
