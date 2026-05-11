import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

interface CreatePromptModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePromptModal = ({ onClose, onSuccess }: CreatePromptModalProps) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    prompt: '',
    AImodel: '',
    result: '',
    categoryId: 0,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async () => {
    setError(null);
    if (!form.title || !form.prompt || !form.categoryId) {
      setError('Preenche os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await api.createPrompt({ ...form, userId: user!.id });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: field === 'categoryId' ? Number(e.target.value) : e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal large" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Novo Prompt</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="alert-error">{error}</div>}

        <div className="form-group">
          <label>Título *</label>
          <input value={form.title} onChange={set('title')} placeholder="Título do prompt" />
        </div>

        <div className="form-group">
          <label>Descrição *</label>
          <textarea value={form.description} onChange={set('description')} placeholder="Descreve o prompt e o seu uso" rows={2} />
        </div>

        <div className="form-group">
          <label>Prompt *</label>
          <textarea value={form.prompt} onChange={set('prompt')} placeholder="Escreve o prompt aqui..." rows={4} />
        </div>

        <div className="form-group">
          <label>Resultado obtido</label>
          <textarea value={form.result} onChange={set('result')} placeholder="Qual foi o resultado com este prompt?" rows={3} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Modelo de IA *</label>
            <select value={form.AImodel} onChange={set('AImodel')}>
              <option value="">Seleciona...</option>
              <option>ChatGPT</option>
              <option>Claude</option>
              <option>Gemini</option>
              <option>Llama</option>
              <option>Outro</option>
            </select>
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <select value={form.categoryId} onChange={set('categoryId')}>
              <option value={0}>Seleciona...</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button className="btn-primary full-width" onClick={handleSubmit} disabled={loading}>
          {loading ? 'A publicar...' : 'Publicar Prompt'}
        </button>
      </div>
    </div>
  );
};
