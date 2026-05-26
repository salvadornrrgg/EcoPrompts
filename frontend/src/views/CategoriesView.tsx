import { useState, useEffect } from 'react';
import * as api from '../api/api';

interface CategoriesViewProps {
  token: string | null;
  isAdmin: boolean;
}

export const CategoriesView = ({ isAdmin }: CategoriesViewProps) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [categoryPrompts, setCategoryPrompts] = useState<any[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  const fetchCategories = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = q?.trim() ? await api.searchCategories(q) : await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async () => {
    if (!newCategoryName.trim()) return;
    try {
      await api.createCategory({ name: newCategoryName });
      setNewCategoryName('');
      setShowCreate(false);
      fetchCategories();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSelectCategory = async (cat: any) => {
    setSelectedCategory(cat);
    setLoadingPrompts(true);
    try {
      const data = await api.getCategoryPrompts(cat.id);
      setCategoryPrompts(data);
    } catch {
      setCategoryPrompts([]);
    } finally {
      setLoadingPrompts(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categorias</h1>
        {isAdmin && (
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
            onClick={() => setShowCreate(!showCreate)}
          >
            + Nova Categoria
          </button>
        )}
      </div>

      {showCreate && isAdmin && (
        <div className="flex gap-3 mb-6 flex-wrap">
          <input
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Nome da categoria"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 min-w-48"
          />
          <button
            className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
            onClick={handleCreate}
          >
            Criar
          </button>
          <button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            onClick={() => setShowCreate(false)}
          >
            Cancelar
          </button>
        </div>
      )}

      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar categorias..."
          onKeyDown={e => e.key === 'Enter' && fetchCategories(search)}
          className="flex-1 border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
        />
        <button
          className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800"
          onClick={() => fetchCategories(search)}
        >
          Pesquisar
        </button>
        {search && (
          <button
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            onClick={() => { setSearch(''); fetchCategories(); }}
          >
            Limpar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center py-12 text-gray-500">A carregar categorias...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all
                  ${selectedCategory?.id === cat.id ? 'bg-green-50 text-green-700 font-semibold' : 'hover:bg-gray-50'}`}
                onClick={() => handleSelectCategory(cat)}
              >
                <span className="text-sm">{cat.name}</span>
                <span className="text-gray-400 text-xs">→</span>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-center py-8 text-gray-400 text-sm">Nenhuma categoria encontrada.</p>
            )}
          </div>

          {selectedCategory && (
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Prompts em "{selectedCategory.name}"
              </h2>
              {loadingPrompts ? (
                <div className="text-center py-8 text-gray-500">A carregar...</div>
              ) : categoryPrompts.length === 0 ? (
                <p className="text-center py-8 text-gray-400 text-sm">Nenhum prompt nesta categoria.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {categoryPrompts.map((p: any) => (
                    <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all">
                      <h4 className="font-medium text-gray-800 mb-1">{p.title}</h4>
                      <p className="text-sm text-gray-500 mb-2">{p.description}</p>
                      <span className="text-xs text-gray-400">@{p.user?.username}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
