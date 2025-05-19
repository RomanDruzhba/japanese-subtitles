import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from '../pages/RegisterPage';
import HomePage from '../pages/HomePage';
import VideoPage from '../pages/VideoPage';
import FlashcardsPage from '../pages/FlashcardsPage';
import Layout from '../components/layout/Layout';
import LoginPage from '../pages/LoginPage';
import AdminPage from '../pages/AdminPage/AdminPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import AdminDatabasePage from '../pages/AdminDatabasePage';
import AdminRoute from './AdminRoute';
import AdminComplaintsPage from '../pages/AdminComplaintsPage';
import {ResetPasswordPage} from '../pages/ResetPasswordPage';


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
          <Route path="/database" element={<AdminRoute><AdminDatabasePage /></AdminRoute>} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/complaint" element={<AdminComplaintsPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default AppRouter;
