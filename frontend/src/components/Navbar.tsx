import { useAuth } from '../context/AuthContext';

type View = 'home' | 'prompts' | 'categories' | 'profile' | 'admin';

interface NavbarProps {
  view: View;
  setView: (v: View) => void;
  setShowLogin: (v: boolean) => void;
  setShowRegister: (v: boolean) => void;
}

export const Navbar = ({ view, setView, setShowLogin, setShowRegister }: NavbarProps) => {
  const { user, logout, isAdmin } = useAuth();

  const navItems: { id: View; label: string }[] = [
    { id: 'home', label: 'Início' },
    { id: 'prompts', label: 'Prompts' },
    { id: 'categories', label: 'Categorias' },
    ...(user ? [{ id: 'profile' as View, label: 'Perfil' }] : []),
    ...(isAdmin() ? [{ id: 'admin' as View, label: 'Admin' }] : []),
  ];

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => setView('home')}>
        <span className="brand-icon">🌿</span>
        <span className="brand-name">EcoPrompts</span>
      </div>

      <div className="navbar-links">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`nav-link ${view === id ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="navbar-auth">
        {user ? (
          <>
            <span className="nav-user">Olá, {user.username}</span>
            <button className="btn-outline" onClick={logout}>Sair</button>
          </>
        ) : (
          <>
            <button className="btn-outline" onClick={() => setShowLogin(true)}>Entrar</button>
            <button className="btn-primary" onClick={() => setShowRegister(true)}>Registar</button>
          </>
        )}
      </div>
    </nav>
  );
};
