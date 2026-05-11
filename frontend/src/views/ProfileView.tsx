import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

export const ProfileView = () => {
  const { user, logout } = useAuth();
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
    logout();
  };

  if (!user) return <div className="alert-error">Tens de estar autenticado.</div>;
  if (loading) return <div className="loading">A carregar perfil...</div>;

  return (
    <div className="view">
      <div className="view-header">
        <h1>O meu perfil</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}
      {success && <div className="alert-success">{success}</div>}

      <div className="profile-card">
        <div className="profile-avatar">
          {profile?.username?.[0]?.toUpperCase()}
        </div>
        <div className="profile-info">
          <h2>{profile?.username}</h2>
          <p>{profile?.email}</p>
          <span className="user-type-badge">{profile?.userType}</span>
          <p className="profile-date">Membro desde {new Date(profile?.createdAt).toLocaleDateString('pt-PT')}</p>
        </div>
      </div>

      {editing ? (
        <div className="edit-form">
          <h3>Editar perfil</h3>
          <div className="form-group">
            <label>Username</label>
            <input
              value={editData.username}
              onChange={e => setEditData(d => ({ ...d, username: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={editData.email}
              onChange={e => setEditData(d => ({ ...d, email: e.target.value }))}
            />
          </div>
          <div className="form-row">
            <button className="btn-primary" onClick={handleUpdate}>Guardar</button>
            <button className="btn-outline" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </div>
      ) : (
        <div className="form-row">
          <button className="btn-outline" onClick={() => setEditing(true)}>Editar perfil</button>
          <button className="btn-danger" onClick={handleDelete}>Apagar conta</button>
        </div>
      )}
    </div>
  );
};
