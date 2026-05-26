import { useState } from 'react';
import * as api from '../api/api';
import type { User } from '../App';

interface LoginProps {
  onSuccess: (token: string, user: User) => void;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const Login = ({ onSuccess, onClose, onSwitchToRegister }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.login(email, password);
      onSuccess(data.token, data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Entrar</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="o-teu@email.com"
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••"
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white p-2 rounded-lg font-medium hover:bg-green-800 disabled:opacity-60 mt-2"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Não tens conta?{' '}
          <span className="text-green-700 font-medium cursor-pointer hover:underline" onClick={onSwitchToRegister}>
            Registar
          </span>
        </p>
      </div>
    </div>
  );
};
