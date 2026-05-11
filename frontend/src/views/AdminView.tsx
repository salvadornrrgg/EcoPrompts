import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

export const AdminView = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleDelete = async (id: number) => {
    if (!confirm('Apagar este utilizador?')) return;
    try {
      await api.deleteUser(id);
      fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (!isAdmin()) return <div className="alert-error">Acesso negado.</div>;

  return (
    <div className="view">
      <div className="view-header">
        <h1>Painel Admin</h1>
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading">A carregar utilizadores...</div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Tipo</th>
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>@{u.username}</td>
                  <td>{u.email}</td>
                  <td><span className="user-type-badge">{u.userType}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString('pt-PT')}</td>
                  <td>
                    <button className="btn-danger small" onClick={() => handleDelete(u.id)}>
                      Apagar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="results-count">{users.length} utilizadores</p>
        </div>
      )}
    </div>
  );
};
