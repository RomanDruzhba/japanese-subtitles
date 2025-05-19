import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        login(user);
        navigate('/');
      } else {
        const data = await response.json();
        setError(data.message || 'Ошибка входа');
        setShowReset(true);
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleReset = async () => {
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setResetSent(true);
      else setError('Не удалось отправить письмо для сброса');
    } catch {
      setError('Ошибка отправки запроса');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Вход</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">Пароль</label>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border rounded"
          />
          <label className="text-sm inline-flex items-center mt-2">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="mr-2"
            />
            Показать пароль
          </label>
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">Войти</button>
        {error && <p className="text-red-500">{error}</p>}
        {showReset && (
          <div className="text-sm">
            {!resetSent ? (
              <button onClick={handleReset} type="button" className="text-blue-600 underline">Забыли пароль?</button>
            ) : (
              <p className="text-green-500">Письмо отправлено на почту</p>
            )}
          </div>
        )}
        <p className="text-sm text-center">Нет аккаунта? 
          <Link to="/register" className="text-blue-600 hover:underline">Регистрация</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
