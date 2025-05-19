import React from 'react';
import { Link } from 'react-router-dom';

const ProfileComments = ({ comments, videoMap }: any) => {
  if (comments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Мои комментарии</h3>
        <p>Комментариев пока нет.</p>
      </div>
    );
  }

  const grouped = comments.reduce((acc: any, comment: any) => {
    const meta = videoMap[comment.videoId];
    if (!meta) return acc;
    const { animeTitle, episodeTitle } = meta;
    if (!acc[animeTitle]) acc[animeTitle] = {};
    if (!acc[animeTitle][episodeTitle]) acc[animeTitle][episodeTitle] = [];
    acc[animeTitle][episodeTitle].push(comment);
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-xl font-semibold mb-4">Мои комментарии</h3>
      {Object.entries(grouped).map(([animeTitle, episodes]: any) => (
        <div key={animeTitle} className="mb-4">
          <details className="mb-2">
            <summary className="cursor-pointer font-semibold">{animeTitle}</summary>
            {Object.entries(episodes).map(([episodeTitle, episodeComments]: any) => (
              <details key={episodeTitle} className="ml-4 mt-2">
                <summary className="cursor-pointer">{episodeTitle}</summary>
                <Link
                  to={`/video?vid=${encodeURIComponent(episodeComments[0].videoId)}`}
                  className="inline-block text-blue-600 underline mt-2 mb-1"
                >
                            Перейти к видео
                </Link>
                {episodeComments.map((comment: any) => (
                  <div key={comment.id} className="border-b py-2 text-gray-700">{comment.text}</div>
                ))}
              </details>
            ))}
          </details>
        </div>
      ))}
    </div>
  );
};

export default ProfileComments;