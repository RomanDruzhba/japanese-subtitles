import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveCurrentUser } from '../auth'; // Мы сейчас обновим auth.ts

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        saveCurrentUser(user); // Сохраняем пользователя
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Вход</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Войти</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '1rem',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default LoginPage;
