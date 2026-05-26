import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/api';
import type { User } from '../App';

interface ProfileViewProps {
  token: string | null;
  user: User | null;
  onLogout: () => void;
}

export const ProfileView = ({ user, onLogout }: ProfileViewProps) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '' });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getUser(user.id);
      setProfile(data);
      setEditData({ username: data.username, email: data.email });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleUpdate = async () => {
    setError(null);
    try {
      await api.updateUser(user!.id, editData);
      setSuccess('Perfil atualizado com sucesso.');
      setEditing(false);
      fetchProfile();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tens a certeza que queres apagar a tua conta? Esta ação é irreversível.')) return;
    await api.deleteUser(user!.id);
    onLogout();
  };

  if (!user) return (
    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">Tens de estar autenticado.</div>
  );

  if (loading) return (
    <div className="text-center py-12 text-gray-500">A carregar perfil...</div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">O meu perfil</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
      {success && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{success}</div>}

      <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 bg-green-700 text-white rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
          {profile?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">{profile?.username}</h2>
          <p className="text-sm text-gray-500">{profile?.email}</p>
          <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium mt-1">
            {profile?.userType}
          </span>
          <p className="text-xs text-gray-400 mt-1">
            Membro desde {new Date(profile?.createdAt).toLocaleDateString('pt-PT')}
          </p>
        </div>
      </div>

      {editing ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Editar perfil</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Username</label>
              <input
                value={editData.username}
                onChange={e => setEditData(d => ({ ...d, username: e.target.value }))}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={editData.email}
                onChange={e => setEditData(d => ({ ...d, email: e.target.value }))}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div className="flex gap-3">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                onClick={handleUpdate}
              >
                Guardar
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setEditing(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-3">
          <button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            onClick={() => setEditing(true)}
          >
            Editar perfil
          </button>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
            onClick={handleDelete}
          >
            Apagar conta
          </button>
        </div>
      )}
    </div>
  );
};
