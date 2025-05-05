import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Импортируем функцию для проверки авторизации

const Header: React.FC = () => {
  const { currentUser } = useAuth(); // Получаем текущего пользователя

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.link}>Главная</Link>      {/* <Link to="/video">Видео</Link> */}
        <Link to="/flashcards" style={styles.link}>Карточки</Link>
        {!currentUser && <Link to="/register" style={styles.link}>Регистрация</Link>} {/* Показываем ссылку на регистрацию, если нет пользователя */}
        {!currentUser && <Link to="/login" style={styles.link}>Логин</Link>} {/* Показываем ссылку на логин, если нет пользователя */}
        {currentUser && <Link to="/profile" style={styles.link}>Профиль</Link>} {/* Показываем ссылку на профиль, если пользователь авторизован */}
        {currentUser?.roleId === 3 && <Link to="/admin" style={styles.link}>Админ панель</Link>}
        {currentUser?.roleId === 3 && <Link to="/database" style={styles.link}>База данных</Link>}
      </nav>
    </header>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  header: {
    backgroundColor: '#222',
    padding: '1rem',
    marginBottom: '1rem'
  },
  nav: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  link: {
    color: 'black',
    textDecoration: 'none',
    backgroundColor: 'darksalmon',
    padding: '0.5rem',
    borderRadius: '10px'
  }
};


export default Header;
