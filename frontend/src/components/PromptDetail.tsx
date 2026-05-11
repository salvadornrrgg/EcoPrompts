import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

interface PromptDetailProps {
  promptId: number;
  onBack: () => void;
}

export const PromptDetail = ({ promptId, onBack }: PromptDetailProps) => {
  const { user, isAdmin } = useAuth();
  const [prompt, setPrompt] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [userScore, setUserScore] = useState<number>(0);
  const [newVersionText, setNewVersionText] = useState('');
  const [newVersionImprovements, setNewVersionImprovements] = useState('');
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'info' | 'comments' | 'versions'>('info');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, c, v] = await Promise.all([
        api.getPrompt(promptId),
        api.getComments(promptId),
        api.getVersions(promptId),
      ]);
      setPrompt(p);
      setComments(c);
      setVersions(v);
      setEditData({ title: p.title, description: p.description, prompt: p.prompt, AImodel: p.AImodel, result: p.result, categoryId: p.categoryId });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [promptId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleDelete = async () => {
    if (!confirm('Tens a certeza que queres apagar este prompt?')) return;
    await api.deletePrompt(promptId);
    onBack();
  };

  const handleEdit = async () => {
    await api.updatePrompt(promptId, editData);
    setShowEditForm(false);
    fetchAll();
  };

  const handleComment = async () => {
    if (!commentText.trim()) return;
    await api.addComment(promptId, { comment: commentText, userId: user!.id });
    setCommentText('');
    fetchAll();
  };

  const handleDeleteComment = async (commentId: number) => {
    await api.deleteComment(commentId);
    fetchAll();
  };

  const handleRate = async () => {
    if (userScore < 1 || userScore > 5) return;
    try {
      await api.ratePrompt(promptId, { score: userScore, userId: user!.id });
    } catch {
      await api.updateRating(promptId, { score: userScore, userId: user!.id });
    }
    fetchAll();
  };

  const handleDeleteRating = async () => {
    await api.deleteRating(promptId);
    fetchAll();
  };

  const handleCreateVersion = async () => {
    if (!newVersionText.trim()) return;
    await api.createVersion(promptId, {
      promptText: newVersionText,
      improvements: newVersionImprovements,
      userId: user!.id,
    });
    setNewVersionText('');
    setNewVersionImprovements('');
    setShowVersionForm(false);
    fetchAll();
  };

  const handleDeleteVersion = async (versionId: number) => {
    await api.deleteVersion(versionId);
    fetchAll();
  };

  const avgRating = () => {
    if (!prompt?.evals || prompt.evals.length === 0) return null;
    return (prompt.evals.reduce((s: number, e: any) => s + e.score, 0) / prompt.evals.length).toFixed(1);
  };

  if (loading) return <div className="loading">A carregar...</div>;
  if (!prompt) return <div className="alert-error">Prompt não encontrado.</div>;

  const isOwner = user?.id === prompt.user?.id;

  return (
    <div className="view">
      <button className="btn-back" onClick={onBack}>← Voltar</button>

      <div className="prompt-detail-header">
        <div>
          <div className="prompt-detail-meta">
            <span className="prompt-category">{prompt.category?.name}</span>
            <span className="prompt-model">{prompt.AImodel}</span>
            {avgRating() && <span className="prompt-rating">⭐ {avgRating()} ({prompt.evals.length} avaliações)</span>}
          </div>
          <h1 className="prompt-detail-title">{prompt.title}</h1>
          <p className="prompt-detail-subtitle">por @{prompt.user?.username} · {new Date(prompt.createdAt).toLocaleDateString('pt-PT')}</p>
        </div>
        {(isOwner || isAdmin()) && (
          <div className="prompt-detail-actions">
            {isOwner && <button className="btn-outline" onClick={() => setShowEditForm(!showEditForm)}>Editar</button>}
            {(isOwner || isAdmin()) && <button className="btn-danger" onClick={handleDelete}>Apagar</button>}
          </div>
        )}
      </div>

      {showEditForm && (
        <div className="edit-form">
          <h3>Editar Prompt</h3>
          <div className="form-group">
            <label>Título</label>
            <input value={editData.title} onChange={e => setEditData({ ...editData, title: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Descrição</label>
            <textarea value={editData.description} onChange={e => setEditData({ ...editData, description: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Prompt</label>
            <textarea value={editData.prompt} onChange={e => setEditData({ ...editData, prompt: e.target.value })} rows={4} />
          </div>
          <div className="form-group">
            <label>Resultado</label>
            <textarea value={editData.result} onChange={e => setEditData({ ...editData, result: e.target.value })} rows={3} />
          </div>
          <div className="form-row">
            <button className="btn-primary" onClick={handleEdit}>Guardar</button>
            <button className="btn-outline" onClick={() => setShowEditForm(false)}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="tabs">
        {(['info', 'comments', 'versions'] as const).map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'info' ? 'Informação' : tab === 'comments' ? `Comentários (${comments.length})` : `Versões (${versions.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="tab-content">
          <div className="prompt-section">
            <h3>Descrição</h3>
            <p>{prompt.description}</p>
          </div>
          <div className="prompt-section">
            <h3>Prompt</h3>
            <pre className="code-block">{prompt.prompt}</pre>
          </div>
          <div className="prompt-section">
            <h3>Resultado obtido</h3>
            <pre className="code-block result">{prompt.result}</pre>
          </div>

          {user && (
            <div className="rating-section">
              <h3>Avaliar</h3>
              <div className="rating-input">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={userScore}
                  onChange={e => setUserScore(Number(e.target.value))}
                  placeholder="1-5"
                />
                <button className="btn-primary" onClick={handleRate}>Avaliar</button>
                <button className="btn-outline" onClick={handleDeleteRating}>Remover avaliação</button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="tab-content">
          {user && (
            <div className="comment-form">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Escreve um comentário..."
                rows={3}
              />
              <button className="btn-primary" onClick={handleComment}>Comentar</button>
            </div>
          )}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="empty-state">Ainda não há comentários.</p>
            ) : (
              comments.map((c: any) => (
                <div key={c.id} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">@{c.user?.username}</span>
                    <span className="comment-date">{new Date(c.createdAt).toLocaleDateString('pt-PT')}</span>
                    {(user?.id === c.userId || isAdmin()) && (
                      <button className="btn-danger small" onClick={() => handleDeleteComment(c.id)}>✕</button>
                    )}
                  </div>
                  <p>{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div className="tab-content">
          {user && (
            <div className="version-actions">
              <button className="btn-primary" onClick={() => setShowVersionForm(!showVersionForm)}>
                + Nova Versão
              </button>
            </div>
          )}

          {showVersionForm && (
            <div className="version-form">
              <div className="form-group">
                <label>Texto do Prompt (versão melhorada)</label>
                <textarea
                  value={newVersionText}
                  onChange={e => setNewVersionText(e.target.value)}
                  placeholder="Escreve aqui a versão melhorada do prompt..."
                  rows={4}
                />
              </div>
              <div className="form-group">
                <label>Melhorias introduzidas (opcional)</label>
                <textarea
                  value={newVersionImprovements}
                  onChange={e => setNewVersionImprovements(e.target.value)}
                  placeholder="Descreve as melhorias que fizeste..."
                  rows={2}
                />
              </div>
              <div className="form-row">
                <button className="btn-primary" onClick={handleCreateVersion}>Publicar versão</button>
                <button className="btn-outline" onClick={() => setShowVersionForm(false)}>Cancelar</button>
              </div>
            </div>
          )}

          <div className="versions-list">
            {versions.length === 0 ? (
              <p className="empty-state">Ainda não há versões.</p>
            ) : (
              versions.map((v: any) => (
                <div key={v.id} className="version-card">
                  <div className="version-header">
                    <span className="version-number">v{v.versionNumber}</span>
                    <span className="version-author">@{v.user?.username}</span>
                    <span className="version-date">{new Date(v.createdAt).toLocaleDateString('pt-PT')}</span>
                    {(user?.id === v.userId || isAdmin()) && (
                      <button className="btn-danger small" onClick={() => handleDeleteVersion(v.id)}>Apagar</button>
                    )}
                  </div>
                  {v.improvements && <p className="version-improvements"><strong>Melhorias:</strong> {v.improvements}</p>}
                  <pre className="code-block">{v.promptText}</pre>
                  {v.rating > 0 && <p className="version-rating">⭐ {v.rating}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
