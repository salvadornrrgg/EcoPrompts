import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/api';
import { TranslateModal } from './TranslateModal';
import type { User } from '../App';

interface PromptDetailProps {
  promptId: number;
  token: string | null;
  user: User | null;
  isAdmin: boolean;
  onBack: () => void;
}

export const PromptDetail = ({ promptId, user, isAdmin, onBack }: PromptDetailProps) => {
  const [prompt, setPrompt] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [versions, setVersions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'info' | 'comments' | 'versions'>('info');
  const [commentText, setCommentText] = useState('');
  const [userScore, setUserScore] = useState<number>(0);
  const [newVersionText, setNewVersionText] = useState('');
  const [newVersionImprovements, setNewVersionImprovements] = useState('');
  const [showVersionForm, setShowVersionForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [showTranslate, setShowTranslate] = useState(false);

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
    await api.createVersion(promptId, { promptText: newVersionText, improvements: newVersionImprovements, userId: user!.id });
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

  if (loading) return <div className="text-center py-12 text-gray-500">A carregar...</div>;
  if (!prompt) return <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">Prompt não encontrado.</div>;

  const isOwner = user?.id === prompt.user?.id;

  return (
    <div>
      {showTranslate && (
        <TranslateModal initialText={prompt.prompt} onClose={() => setShowTranslate(false)} />
      )}

      <button className="text-gray-400 hover:text-gray-600 text-sm mb-4" onClick={onBack}>
        ← Voltar
      </button>

      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <div className="flex gap-2 mb-2 flex-wrap items-center">
            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs font-medium">
              {prompt.category?.name}
            </span>
            <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">
              {prompt.AImodel}
            </span>
            {avgRating() && (
              <span className="text-green-700 text-sm font-semibold">
                ⭐ {avgRating()} ({prompt.evals.length} avaliações)
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{prompt.title}</h1>
          <p className="text-sm text-gray-400">
            por @{prompt.user?.username} · {new Date(prompt.createdAt).toLocaleDateString('pt-PT')}
          </p>
        </div>
        {(isOwner || isAdmin) && (
          <div className="flex gap-2 flex-shrink-0">
            {isOwner && (
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setShowEditForm(!showEditForm)}
              >
                Editar
              </button>
            )}
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700"
              onClick={handleDelete}
            >
              Apagar
            </button>
          </div>
        )}
      </div>

      {showEditForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Editar Prompt</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Título</label>
              <input
                value={editData.title}
                onChange={e => setEditData({ ...editData, title: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Descrição</label>
              <textarea
                value={editData.description}
                onChange={e => setEditData({ ...editData, description: e.target.value })}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Prompt</label>
              <textarea
                value={editData.prompt}
                onChange={e => setEditData({ ...editData, prompt: e.target.value })}
                rows={4}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Resultado</label>
              <textarea
                value={editData.result}
                onChange={e => setEditData({ ...editData, result: e.target.value })}
                rows={3}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
              />
            </div>
            <div className="flex gap-3">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                onClick={handleEdit}
              >
                Guardar
              </button>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                onClick={() => setShowEditForm(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="eco-tabs flex border-b border-gray-200 mb-6">
        {(['info', 'comments', 'versions'] as const).map(tab => (
          <button
            key={tab}
            className={`eco-tab px-5 py-3 text-sm font-medium border-b-2 transition-all
              ${activeTab === tab
                ? 'border-green-700 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'info' ? 'Informação' : tab === 'comments' ? `Comentários (${comments.length})` : `Versões (${versions.length})`}
          </button>
        ))}
      </div>

      {activeTab === 'info' && (
        <div className="flex flex-col gap-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Descrição</h3>
            <p className="text-gray-600">{prompt.description}</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Prompt</h3>
              <button
                className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-50"
                onClick={() => setShowTranslate(true)}
              >
                Traduzir prompt
              </button>
            </div>
            <pre className="eco-code bg-gray-900 text-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap break-words">
              {prompt.prompt}
            </pre>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Resultado obtido</h3>
            <pre className="eco-code-result bg-gray-50 border border-gray-200 text-gray-600 p-4 rounded-lg text-sm whitespace-pre-wrap break-words">
              {prompt.result}
            </pre>
          </div>

          {user && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Avaliar</h3>
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={userScore}
                  onChange={e => setUserScore(Number(e.target.value))}
                  placeholder="1-5"
                  className="border border-gray-300 p-2 rounded-lg w-20 focus:outline-none focus:border-green-600"
                />
                <button
                  className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                  onClick={handleRate}
                >
                  Avaliar
                </button>
                <button
                  className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                  onClick={handleDeleteRating}
                >
                  Remover avaliação
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div>
          {user && (
            <div className="mb-5">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="Escreve um comentário..."
                rows={3}
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y mb-2"
              />
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                onClick={handleComment}
              >
                Comentar
              </button>
            </div>
          )}
          <div className="flex flex-col gap-3">
            {comments.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Ainda não há comentários.</p>
            ) : (
              comments.map((c: any) => (
                <div key={c.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-sm text-gray-800">@{c.user?.username}</span>
                    <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString('pt-PT')}</span>
                    {(user?.id === c.userId || isAdmin) && (
                      <button
                        className="ml-auto bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs hover:bg-red-200"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{c.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'versions' && (
        <div>
          {user && (
            <div className="mb-4">
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                onClick={() => setShowVersionForm(!showVersionForm)}
              >
                + Nova Versão
              </button>
            </div>
          )}

          {showVersionForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Texto do Prompt (versão melhorada)</label>
                  <textarea
                    value={newVersionText}
                    onChange={e => setNewVersionText(e.target.value)}
                    placeholder="Escreve aqui a versão melhorada do prompt..."
                    rows={4}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Melhorias introduzidas (opcional)</label>
                  <textarea
                    value={newVersionImprovements}
                    onChange={e => setNewVersionImprovements(e.target.value)}
                    placeholder="Descreve as melhorias que fizeste..."
                    rows={2}
                    className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
                    onClick={handleCreateVersion}
                  >
                    Publicar versão
                  </button>
                  <button
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
                    onClick={() => setShowVersionForm(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {versions.length === 0 ? (
              <p className="text-center py-8 text-gray-400 text-sm">Ainda não há versões.</p>
            ) : (
              versions.map((v: any) => (
                <div key={v.id} className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="eco-version-badge bg-green-700 text-white px-2 py-0.5 rounded-full text-xs font-semibold">
                      v{v.versionNumber}
                    </span>
                    <span className="text-sm font-medium text-gray-700">@{v.user?.username}</span>
                    <span className="text-xs text-gray-400">{new Date(v.createdAt).toLocaleDateString('pt-PT')}</span>
                    {(user?.id === v.userId || isAdmin) && (
                      <button
                        className="ml-auto bg-red-100 text-red-600 px-3 py-1 rounded text-xs hover:bg-red-200"
                        onClick={() => handleDeleteVersion(v.id)}
                      >
                        Apagar
                      </button>
                    )}
                  </div>
                  {v.improvements && (
                    <p className="text-sm text-gray-500 mb-3"><strong>Melhorias:</strong> {v.improvements}</p>
                  )}
                  <pre className="eco-code bg-gray-900 text-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap break-words">
                    {v.promptText}
                  </pre>
                  {v.rating > 0 && (
                    <p className="text-sm text-green-700 mt-2">⭐ {v.rating}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
