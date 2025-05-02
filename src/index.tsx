import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './context/AuthContext';

// Рендерим React-приложение
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </React.StrictMode>
  );
