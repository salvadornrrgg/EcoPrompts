import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';
import { PromptDetail } from '../components/PromptDetail';
import { CreatePromptModal } from '../components/CreatePromptModal';

interface Prompt {
  id: number;
  title: string;
  description: string;
  prompt: string;
  AImodel: string;
  result: string;
  createdAt: string;
  user: { id: number; username: string };
  category: { id: number; name: string };
  evals?: { score: number }[];
}

export const PromptsView = () => {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<number | null>(null);
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

  if (selectedPrompt) {
    return (
      <PromptDetail
        promptId={selectedPrompt}
        onBack={() => { setSelectedPrompt(null); fetchPrompts(); }}
      />
    );
  }

  return (
    <div className="view">
      <div className="view-header">
        <h1>Prompts</h1>
        {user && (
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            + Novo Prompt
          </button>
        )}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Pesquisa semântica de prompts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn-primary" onClick={handleSearch} disabled={searching}>
          {searching ? '...' : 'Pesquisar'}
        </button>
        {search && (
          <button className="btn-outline" onClick={() => { setSearch(''); fetchPrompts(); }}>
            Limpar
          </button>
        )}
      </div>

      {error && (
        <div className="alert-error">
          {error}
          <button onClick={fetchPrompts}>Tentar novamente</button>
        </div>
      )}

      {loading ? (
        <div className="loading">A carregar prompts...</div>
      ) : (
        <>
          <p className="results-count">{prompts.length} prompts encontrados</p>
          <div className="prompt-grid">
            {prompts.map(p => (
              <div key={p.id} className="prompt-card" onClick={() => setSelectedPrompt(p.id)}>
                <div className="prompt-card-header">
                  <span className="prompt-category">{p.category?.name}</span>
                  <span className="prompt-model">{p.AImodel}</span>
                </div>
                <h3 className="prompt-title">{p.title}</h3>
                <p className="prompt-description">{p.description}</p>
                <div className="prompt-card-footer">
                  <span className="prompt-author">@{p.user?.username}</span>
                  <span className="prompt-date">{new Date(p.createdAt).toLocaleDateString('pt-PT')}</span>
                  {avgRating(p.evals) && (
                    <span className="prompt-rating">⭐ {avgRating(p.evals)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          {prompts.length === 0 && (
            <div className="empty-state">
              <p>Nenhum prompt encontrado.</p>
            </div>
          )}
        </>
      )}

      {showCreate && (
        <CreatePromptModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setShowCreate(false); fetchPrompts(); }}
        />
      )}
    </div>
  );
};
