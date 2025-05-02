import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Импортируем функцию для проверки авторизации

const Header: React.FC = () => {
  const { currentUser } = useAuth(); // Получаем текущего пользователя

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/">Главная</Link>
        <Link to="/video">Видео</Link>
        <Link to="/flashcards">Карточки</Link>
        {!currentUser && <Link to="/register">Регистрация</Link>} {/* Показываем ссылку на регистрацию, если нет пользователя */}
        {!currentUser && <Link to="/login">Логин</Link>} {/* Показываем ссылку на логин, если нет пользователя */}
        {currentUser && <Link to="/profile">Профиль</Link>} {/* Показываем ссылку на профиль, если пользователь авторизован */}
        <Link to="/admin">Админ панель</Link>
        <Link to="/database">База данных</Link>
      </nav>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#222',
    padding: '1rem',
    marginBottom: '1rem',
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    color: 'white',
  },
};

export default Header;
