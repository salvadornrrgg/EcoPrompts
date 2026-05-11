import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import * as api from '../api/api';

export const CategoriesView = () => {
  const { isAdmin } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [categoryPrompts, setCategoryPrompts] = useState<any[]>([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = search.trim()
        ? await api.searchCategories(search)
        : await api.getCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchCategories(); }, []);

  const handleSearch = () => fetchCategories();

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
    <div className="view">
      <div className="view-header">
        <h1>Categorias</h1>
        {isAdmin() && (
          <button className="btn-primary" onClick={() => setShowCreate(!showCreate)}>
            + Nova Categoria
          </button>
        )}
      </div>

      {showCreate && isAdmin() && (
        <div className="create-form">
          <input
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
            placeholder="Nome da categoria"
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
          />
          <button className="btn-primary" onClick={handleCreate}>Criar</button>
          <button className="btn-outline" onClick={() => setShowCreate(false)}>Cancelar</button>
        </div>
      )}

      <div className="search-bar">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Pesquisar categorias..."
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn-primary" onClick={handleSearch}>Pesquisar</button>
        {search && <button className="btn-outline" onClick={() => { setSearch(''); fetchCategories(); }}>Limpar</button>}
      </div>

      {error && <div className="alert-error">{error}</div>}

      {loading ? (
        <div className="loading">A carregar categorias...</div>
      ) : (
        <div className="categories-layout">
          <div className="categories-list">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className={`category-item ${selectedCategory?.id === cat.id ? 'active' : ''}`}
                onClick={() => handleSelectCategory(cat)}
              >
                <span className="category-name">{cat.name}</span>
                <span className="category-arrow">→</span>
              </div>
            ))}
            {categories.length === 0 && <p className="empty-state">Nenhuma categoria encontrada.</p>}
          </div>

          {selectedCategory && (
            <div className="category-prompts">
              <h2>Prompts em "{selectedCategory.name}"</h2>
              {loadingPrompts ? (
                <div className="loading">A carregar...</div>
              ) : categoryPrompts.length === 0 ? (
                <p className="empty-state">Nenhum prompt nesta categoria.</p>
              ) : (
                <div className="prompt-list-simple">
                  {categoryPrompts.map((p: any) => (
                    <div key={p.id} className="prompt-list-item">
                      <h4>{p.title}</h4>
                      <p>{p.description}</p>
                      <span className="prompt-author">@{p.user?.username}</span>
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
