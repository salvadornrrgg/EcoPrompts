import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export const LoginModal = ({ onClose, onSwitchToRegister }: LoginModalProps) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    try {
      const data = await api.login(email, password);
      login(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Entrar</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="o-teu@email.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••"
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </div>

        <button className="btn-primary full-width" onClick={handleSubmit} disabled={loading}>
          {loading ? 'A entrar...' : 'Entrar'}
        </button>

        <p className="modal-switch">
          Não tens conta?{' '}
          <span onClick={onSwitchToRegister}>Registar</span>
        </p>
      </div>
    </div>
  );
};
