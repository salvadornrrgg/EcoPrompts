import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/api';
import { PromptDetail } from '../components/PromptDetail';
import { CreatePrompt } from '../components/CreatePrompt';
import type { User } from '../App';

interface Prompt {
  id: number;
  title: string;
  description: string;
  AImodel: string;
  createdAt: string;
  user: { id: number; username: string };
  category: { id: number; name: string };
  evals?: { score: number }[];
}

interface PromptsViewProps {
  token: string | null;
  user: User | null;
  isAdmin: boolean;
}

export const PromptsView = ({ token, user, isAdmin }: PromptsViewProps) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPrompts();
      setPrompts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPrompts(); }, [fetchPrompts]);

  const handleSearch = async () => {
    if (!search.trim()) { fetchPrompts(); return; }
    setSearching(true);
    setError(null);
    try {
      const data = await api.searchPrompts(search);
      setPrompts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const avgRating = (evals?: { score: number }[]) => {
    if (!evals || evals.length === 0) return null;
    return (evals.reduce((s, e) => s + e.score, 0) / evals.length).toFixed(1);
  };

  if (selectedPromptId) {
    return (
      <PromptDetail
        promptId={selectedPromptId}
        token={token}
        user={user}
        isAdmin={isAdmin}
        onBack={() => { setSelectedPromptId(null); fetchPrompts(); }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prompts</h1>
        {user && (
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
            onClick={() => setShowCreate(true)}
          >
            + Novo Prompt
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Pesquisa semântica de prompts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
        />
        <button
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 disabled:opacity-60"
          onClick={handleSearch}
          disabled={searching}
        >
          {searching ? '...' : 'Pesquisar'}
        </button>
        {search && (
          <button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            onClick={() => { setSearch(''); fetchPrompts(); }}
          >
            Limpar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button className="underline" onClick={fetchPrompts}>Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">A carregar prompts...</div>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-4">{prompts.length} prompts encontrados</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {prompts.map(p => (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all"
                onClick={() => setSelectedPromptId(p.id)}
              >
                <div className="flex gap-2 mb-3">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    {p.category?.name}
                  </span>
                  <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
                    {p.AImodel}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{p.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="font-medium">@{p.user?.username}</span>
                  <span>{new Date(p.createdAt).toLocaleDateString('pt-PT')}</span>
                  {avgRating(p.evals) && (
                    <span className="ml-auto text-green-700 font-semibold">⭐ {avgRating(p.evals)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {prompts.length === 0 && (
            <div className="text-center py-12 text-gray-400">Nenhum prompt encontrado.</div>
          )}
        </>
      )}

      {showCreate && (
        <CreatePrompt
          token={token}
          user={user}
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchPrompts(); }}
        />
      )}
    </div>
  );
};
