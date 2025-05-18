import React, { useEffect, useState } from 'react';
import { DictionaryEntry } from '../types';
import { getCurrentUser } from '../auth';

interface DictionaryModalProps {
  word: string;
  entries: DictionaryEntry[];
  onClose: () => void;
}

const DictionaryModal: React.FC<DictionaryModalProps> = ({ word, entries, onClose }) => {
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleAddCard = async (entryId: string, word: string, translation: string) => {
    const user = getCurrentUser();
    if (!user) return;

    setAddingId(entryId);
    try {
      await fetch('/api/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word, translation, userId: user.id }),
      });
      setAddedIds(prev => new Set(prev).add(entryId));
    } catch (err) {
      console.error('Ошибка при добавлении карточки:', err);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-2xl w-11/12 max-h-[80vh] overflow-y-auto shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-semibold border-b pb-2 mb-4">{word}</h2>

        {entries.length > 0 ? (
          <div className="space-y-6">
            {entries.map((entry, idx) => {
              const entryId = `${entry[0]}-${idx}`;
              const wordKanji = entry[0];
              const reading = entry[1];
              const senses = entry[5];
              const plainTranslation = senses[0]?.replace(/<[^>]*>/g, '').trim();

              return (
                <div
                  key={entryId}
                  className={`p-4 rounded border-l-4 ${
                    idx === 0
                      ? 'bg-green-50 border-green-500'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {wordKanji}
                        <span className="ml-2 text-sm text-gray-500">{reading}</span>
                      </h3>
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                        {senses.map((sense, i) => (
                          <li
                            key={i}
                            dangerouslySetInnerHTML={{ __html: sense }}
                            className="text-gray-700"
                          />
                        ))}
                      </ul>
                    </div>
                    <button
                      className={`ml-4 px-4 py-1 text-sm rounded shadow ${
                        addedIds.has(entryId)
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      } disabled:opacity-50`}
                      disabled={addingId === entryId || addedIds.has(entryId)}
                      onClick={() =>
                        handleAddCard(entryId, wordKanji, plainTranslation)
                      }
                    >
                      {addedIds.has(entryId)
                        ? 'Добавлено!'
                        : addingId === entryId
                        ? 'Добавление...'
                        : 'Добавить'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500 italic">Нет записей в словаре.</p>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictionaryModal;
