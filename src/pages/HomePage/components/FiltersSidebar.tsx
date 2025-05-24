/* components/FiltersSidebar.tsx */
import React from 'react';

interface Props {
  genres: string[];
  tags: string[];
  selectedGenres: string[];
  selectedTags: string[];
  openFilter: 'genres' | 'tags' | null;
  setOpenFilter: (val: 'genres' | 'tags' | null) => void;
  onGenreChange: (genre: string) => void;
  onTagChange: (tag: string) => void;
  onReset: () => void;
}

const FiltersSidebar: React.FC<Props> = ({
  genres, tags, selectedGenres, selectedTags,
  openFilter, setOpenFilter, onGenreChange, onTagChange, onReset
}) => (
  <aside className="w-64 p-4 border-r border-gray-200 hidden md:block">
    <div>
      <button onClick={() => setOpenFilter(openFilter === 'genres' ? null : 'genres')} className="w-full text-left font-bold mb-2">Жанры</button>
      {openFilter === 'genres' && (
        <ul className="mb-4 space-y-1">
          {genres.map(genre => (
            <li key={genre}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => onGenreChange(genre)}
                />
                <span>{genre}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
    <div>
      <button onClick={() => setOpenFilter(openFilter === 'tags' ? null : 'tags')} className="w-full text-left font-bold mb-2">Теги</button>
      {openFilter === 'tags' && (
        <ul className="space-y-1">
          {tags.map(tag => (
            <li key={tag}>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => onTagChange(tag)}
                />
                <span>{tag}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <button onClick={onReset} className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full">
        Сбросить фильтры
      </button>
    </div>
  </aside>
);

export default FiltersSidebar;