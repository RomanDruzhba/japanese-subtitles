// AdminPage.tsx
import React from 'react';
import UploadForm from './components/UploadForm';
import UploadedList from './components/UploadedList';
import { useAdminVideos } from './hooks/useAdminVideos';

const AdminPage: React.FC = () => {
  const { videos, deleteVideo, refreshAllVideos } = useAdminVideos();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Панель администратора</h2>
          <p className="text-sm text-gray-500 mt-1">Добавляйте, управляйте и удаляйте эпизоды и субтитры</p>
        </header>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <UploadForm onUpload={refreshAllVideos} />
        </section>

        <section className="bg-white p-6 rounded-xl shadow-md">
          <UploadedList videos={videos} onDelete={deleteVideo} />
        </section>
      </div>
    </div>
  );
};

export default AdminPage;