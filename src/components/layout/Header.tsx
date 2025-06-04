import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Импортируем функцию для проверки авторизации

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Базовый стиль для всех ссылок
  const linkStyle = 'h-full flex items-center justify-center px-6 text-white transition-all duration-300 border-gray-300 hover:bg-gray-600';
  
  return (
    <header className='bg-gray-900 border-b border-gray-700'>
      <div className='flex h-16'>
        {/* Левая часть - Основные ссылки */}
        <div className="flex h-full">
          <Link 
            to="/" 
            className={`${linkStyle} border-r`}
          >
            Главная
          </Link>
          <Link 
            to="/flashcards" 
            className={`${linkStyle} border-r`}
          >
            Карточки
          </Link>
        </div>
        
        {/* Центральная часть - Админские ссылки */}
        {currentUser?.roleId === 3 && (
          <div className="flex h-full">
            <Link 
              to="/admin" 
              className={`${linkStyle} border-r`}
            >
              Админ панель
            </Link>
            <Link 
              to="/complaint" 
              className={`${linkStyle} border-r`}
            >
              Жалобы
            </Link>
            <Link 
              to="/database" 
              className={`${linkStyle} border-r`}
            >
              База данных
            </Link>
          </div>
        )}
        
        {/* Правая часть - Профиль/Авторизация */}
        <div className="flex h-full ml-auto">
          {currentUser ? (
            <Link 
              to="/profile" 
              className={`${linkStyle} border-l`}
            >
              Профиль
            </Link>
          ) : (
            <>
              <Link 
                to="/register" 
                className={`${linkStyle} border-l`}
              >
                Регистрация
              </Link>
              <Link 
                to="/login" 
                className={`${linkStyle} border-l`}
              >
                Вход
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};


export default Header;
