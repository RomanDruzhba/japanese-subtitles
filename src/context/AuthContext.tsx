import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, getCurrentUser, saveCurrentUser, logout as logoutFn } from '../auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

// const SERVER_URL = 'http://localhost:3000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  const login = (user: AuthUser) => {
    saveCurrentUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    logoutFn();
    setCurrentUser(null);
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/current-user`, {
          credentials: 'include',
        });

        if (res.ok) {
          const user = await res.json();
          saveCurrentUser(user);
          setCurrentUser(user);
        } else {
          logoutFn(); // очистить localStorage
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Ошибка при получении текущего пользователя:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
