import React, { useState } from 'react';
import { AdminVideo } from '../types';
import EpisodeUploadForm from './EpisodeUploadForm';
import DescriptionUploadForm from './DescriptionUploadForm';

interface UploadFormProps {
  onUpload: (newVideo: AdminVideo) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [activeTab, setActiveTab] = useState<'episode' | 'description'>('episode');

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('episode')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'episode' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Загрузка нового эпизода
        </button>
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'description' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
          }`}
        >
          Описание аниме
        </button>
      </div>

      {activeTab === 'episode' ? (
        <EpisodeUploadForm onUpload={onUpload} />
      ) : (
        <DescriptionUploadForm />
      )}
    </div>
  );
};

export default UploadForm;
