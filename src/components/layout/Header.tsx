import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const linkStyle = 'w-full md:w-auto flex items-center justify-center px-6 py-2 md:py-0 text-white transition-all duration-300 border-gray-300 hover:bg-gray-600';

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 md:px-0">
        <Link to="/" className={`${linkStyle} h-16`}>Главная</Link>

        <button
          className="md:hidden text-white focus:outline-none w-auto"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        <div className="hidden md:flex h-full">
          <div className="flex h-full">
            
            <Link to="/flashcards" className={`${linkStyle} border-l`}>Карточки</Link>
          </div>

          {currentUser?.roleId === 3 && (
            <div className="flex h-full">
              <Link to="/admin" className={`${linkStyle} border-r`}>Админ панель</Link>
              <Link to="/complaint" className={`${linkStyle} border-r`}>Жалобы</Link>
              <Link to="/database" className={`${linkStyle} border-r`}>База данных</Link>
            </div>
          )}

          <div className="flex h-full ml-auto">
            {currentUser ? (
              <Link to="/profile" className={`${linkStyle} border-l`}>Профиль</Link>
            ) : (
              <>
                <Link to="/register" className={`${linkStyle} border-l`}>Регистрация</Link>
                <Link to="/login" className={`${linkStyle} border-l`}>Вход</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Выпадающее меню для мобильных устройств */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-700 bg-gray-800 flex flex-col">
          <Link to="/flashcards" className={linkStyle} onClick={() => setIsOpen(false)}>Карточки</Link>

          {currentUser?.roleId === 3 && (
            <>
              <Link to="/admin" className={linkStyle} onClick={() => setIsOpen(false)}>Админ панель</Link>
              <Link to="/complaint" className={linkStyle} onClick={() => setIsOpen(false)}>Жалобы</Link>
              <Link to="/database" className={linkStyle} onClick={() => setIsOpen(false)}>База данных</Link>
            </>
          )}

          {currentUser ? (
            <Link to="/profile" className={linkStyle} onClick={() => setIsOpen(false)}>Профиль</Link>
          ) : (
            <>
              <Link to="/register" className={linkStyle} onClick={() => setIsOpen(false)}>Регистрация</Link>
              <Link to="/login" className={linkStyle} onClick={() => setIsOpen(false)}>Вход</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
