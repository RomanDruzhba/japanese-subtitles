import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, getCurrentUser, saveCurrentUser, logout as logoutFn } from '../auth';

interface AuthContextType {
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getCurrentUser());

  const login = (user: AuthUser) => {
    saveCurrentUser(user);
    setCurrentUser(user);
  };

  const logout = () => {
    logoutFn();
    setCurrentUser(null);
  };

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
