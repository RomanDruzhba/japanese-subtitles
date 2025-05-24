import React, { useState } from 'react';
import { AdminVideo } from '../types/types';
import EpisodeUploadForm from './EpisodeUploadForm';
import DescriptionUploadForm from './DescriptionUploadForm';
import SubtitleTransformForm from './SubtitleTransformForm';

interface UploadFormProps {
  onUpload: (newVideo: AdminVideo) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [activeTab, setActiveTab] = useState<'episode' | 'description' | 'subtitle'>('episode');

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-4">
      <div className="flex border-b">
        {['episode', 'description', 'subtitle'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'
            }`}
          >
            {{
              episode: 'Загрузка эпизода',
              description: 'Описание аниме',
              subtitle: 'Разбивка и перевод',
            }[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'episode' && <EpisodeUploadForm onUpload={onUpload} />}
      {activeTab === 'description' && <DescriptionUploadForm />}
      {activeTab === 'subtitle' && <SubtitleTransformForm />}
    </div>
  );
};

export default UploadForm;
