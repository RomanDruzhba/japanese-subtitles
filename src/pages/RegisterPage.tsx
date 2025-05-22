import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showRules, setShowRules] = useState(false);

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checkPasswordRules = (password: string) => ({
    length: password.length >= 8,
    digit: /\d/.test(password),
    symbol: /[\W_А-Яа-яA-Za-z]/.test(password),
  });

  const passwordRules = checkPasswordRules(password);
  const allRulesPassed = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!isValidEmail(email)) {
      setError('Введите корректный email.');
      return;
    }

    if (!allRulesPassed) {
      setError('Пароль не соответствует требованиям.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        setSuccess('Регистрация прошла успешно!');
        setEmail('');
        setPassword('');
        setShowRules(false);
      } else {
        const data = await response.json();
        setError(data.message || 'Ошибка регистрации');
      }
    } catch (err) {
      setError('Ошибка подключения к серверу');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Регистрация</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            maxLength={50}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Пароль</label>
          <input
            maxLength={50}
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={password}
            onFocus={() => setShowRules(true)}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              id="show-password"
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="show-password" className="text-sm text-gray-700">
              Показать пароль
            </label>
          </div>

          <div className="mt-3">
            <button
              type="button"
              className="flex items-center text-sm text-blue-600 hover:underline"
              onClick={() => setShowRules((prev) => !prev)}
            >
              <ChevronDownIcon
                className={`w-4 h-4 mr-1 transition-transform duration-300 ${
                  showRules ? 'rotate-180' : ''
                }`}
              />
              Правила пароля
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                showRules ? 'max-h-40 mt-2' : 'max-h-0'
              }`}
            >
              <ul className="text-sm text-gray-700 space-y-1 pl-4">
                <li className={passwordRules.length ? 'text-green-600' : ''}>
                  • Минимум 8 символов
                </li>
                <li className={passwordRules.digit ? 'text-green-600' : ''}>
                  • Хотя бы одна цифра
                </li>
                <li className={passwordRules.symbol ? 'text-green-600' : ''}>
                  • Символ (русский/английский/спец)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Зарегистрироваться
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}

        <p className="text-sm text-center mt-4">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;