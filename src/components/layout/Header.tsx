import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/">Главная</Link>
        <Link to="/video">Видео</Link>
        <Link to="/flashcards">Карточки</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Логин</Link>
        <Link to="/admin">Админ панель</Link>
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
