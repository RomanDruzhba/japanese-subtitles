import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Импортируем функцию для проверки авторизации

const Header: React.FC = () => {
  const { currentUser } = useAuth(); // Получаем текущего пользователя
  const link_style = 'text-[#222] bg-indigo-100 hover:bg-indigo-200 rounded-3xl text-center p-2 w-[200px]';

  return (
    <header className='bg-[#222] p-5 pl-10 pr-10'>
      <nav className='grid grid-cols-2 gap-5 w-full items-center '>
        <div className="flex w-full gap-6 justify-start">
          <Link to="/" className={link_style}>Главная</Link> {/* <Link to="/video">Видео</Link> */}
          <Link to="/flashcards" className={link_style}>Карточки</Link>
        </div>
        {currentUser ? (
          <div className='flex w-full justify-end'>
            <Link to="/profile" className={link_style}>Профиль</Link> {/* Показываем ссылку на профиль, если пользователь авторизован */}
          </div>
        ) : (
          <div className="flex gap-5 justify-end">
            <Link to="/register" className={link_style}>Регистрация</Link> {/* Показываем ссылку на регистрацию, если нет пользователя */}
            <Link to="/login" className={link_style}>Логин</Link> {/* Показываем ссылку на логин, если нет пользователя */}
          </div>
        )}
        {currentUser?.roleId === 3 && <div className="flex w-full justify-around col-span-2">
          <Link to="/admin" className={link_style}>Админ панель</Link>
          <Link to="/database" className={link_style}>База данных</Link>
        </div> }
      </nav>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  link: {
    textDecoration: 'none',
    backgroundColor: 'darksalmon',
    padding: '0.5rem',
    borderRadius: '10px'
  }
};


export default Header;
