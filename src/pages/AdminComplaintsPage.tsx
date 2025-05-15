import React, { useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Complaint {
  id: number;
  complainant: { id: number; nickname: string; email: string };
  targetUser: { id: number; nickname: string; email: string };
  complaintText: string;
  comment?: { id: number; text: string };
  isResolved: boolean;
}

const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [warningText, setWarningText] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const fetchComplaints = async () => {
    const res = await fetch(`${API_BASE_URL}/api/complaints`);
    const data = await res.json();
    setComplaints(data);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const markResolved = async (id: number) => {
    await fetch(`${API_BASE_URL}/api/complaints/${id}/resolve`, { method: 'POST' });
    fetchComplaints();
  };

  const banUser = async (complaintId: number, duration: string) => {
    await fetch(`${API_BASE_URL}/api/complaints/${complaintId}/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ duration }),
    });
    fetchComplaints();
  };

  const sendWarning = async () => {
    if (!selectedComplaint) return;
    await fetch(`${API_BASE_URL}/api/complaints/${selectedComplaint.id}/warn`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: warningText }),
    });
    setShowModal(false);
    setWarningText('');
    fetchComplaints();
  };

  const deleteComment = async (commentId: number) => {
    await fetch(`${API_BASE_URL}/api/complaints/${commentId}`, {
      method: 'DELETE',
    });
    fetchComplaints();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Жалобы пользователей</h2>
      <div className="overflow-auto">
        <table className="table-auto min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="px-4 py-2 border-b">Жалующийся</th>
              <th className="px-4 py-2 border-b">На кого</th>
              <th className="px-4 py-2 border-b w-48">Текст жалобы</th>
              <th className="px-4 py-2 border-b w-64">Комментарий</th>
              <th className="px-4 py-2 border-b">Действия</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-pre-wrap">
                  <div>{c.complainant.nickname}</div>
                  <div className="text-xs text-gray-500">{c.complainant.email}</div>
                </td>
                <td className="px-4 py-2 whitespace-pre-wrap">
                  <div>{c.targetUser.nickname}</div>
                  <div className="text-xs text-gray-500">{c.targetUser.email}</div>
                </td>
                <td className="px-4 py-2 whitespace-pre-wrap break-words max-w-xs">{c.complaintText}</td>
                <td className="px-4 py-2 whitespace-pre-wrap break-words max-w-xs">{c.comment?.text || '—'}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => markResolved(c.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-sm"
                    >
                      ✅ Рассмотрена
                    </button>
                    <select
                      onChange={(e) => banUser(c.id, e.target.value)}
                      defaultValue=""
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="" disabled>🔒 Бан</option>
                      <option value="1m">На месяц</option>
                      <option value="6m">На 6 месяцев</option>
                      <option value="1y">На год</option>
                      <option value="perm">Навсегда</option>
                    </select>
                    <button
                      onClick={() => { setSelectedComplaint(c); setShowModal(true); }}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      ⚠️ Предупреждение
                    </button>
                    {c.comment && (
                      <button
                        onClick={() => c.comment?.id && deleteComment(c.comment.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                      >
                        🗑 Удалить комментарий
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 space-y-4">
            <h3 className="text-lg font-semibold">Предупреждение пользователю</h3>
            <p><b>Ник:</b> {selectedComplaint.targetUser.nickname}</p>
            <p><b>Email:</b> {selectedComplaint.targetUser.email}</p>
            <textarea
              className="w-full border rounded p-2 h-24 text-sm"
              placeholder="Причина предупреждения"
              value={warningText}
              onChange={(e) => setWarningText(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={sendWarning}
                className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 text-sm"
              >
                Отправить
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-1.5 rounded hover:bg-gray-400 text-sm"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComplaintsPage;
