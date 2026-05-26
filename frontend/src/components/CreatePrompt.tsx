import { useState, useEffect } from 'react';
import * as api from '../api/api';
import type { User } from '../App';

interface CreatePromptProps {
  token: string | null;
  user: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePrompt = ({ user, onClose, onSuccess }: CreatePromptProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [AImodel, setAImodel] = useState('');
  const [result, setResult] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !prompt || !categoryId) {
      setError('Preenche os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      await api.createPrompt({ title, description, prompt, AImodel, result, categoryId, userId: user!.id });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Novo Prompt</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>✕</button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título do prompt"
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descrição</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Descreve o prompt e o seu uso"
              rows={2}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Prompt *</label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Escreve o prompt aqui..."
              rows={4}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Resultado obtido</label>
            <textarea
              value={result}
              onChange={e => setResult(e.target.value)}
              placeholder="Qual foi o resultado com este prompt?"
              rows={3}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-700">Modelo de IA *</label>
              <select
                value={AImodel}
                onChange={e => setAImodel(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              >
                <option value="">Seleciona...</option>
                <option>ChatGPT</option>
                <option>Claude</option>
                <option>Gemini</option>
                <option>Llama</option>
                <option>Outro</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm font-medium text-gray-700">Categoria *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(Number(e.target.value))}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              >
                <option value={0}>Seleciona...</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white p-2 rounded-lg font-medium hover:bg-green-800 disabled:opacity-60 mt-2"
          >
            {loading ? 'A publicar...' : 'Publicar Prompt'}
          </button>
        </form>
      </div>
    </div>
  );
};
