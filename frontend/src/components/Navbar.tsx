import { useState } from 'react';
import { TranslateModal } from './TranslateModal';
import type { User } from '../App';

type View = 'home' | 'prompts' | 'categories' | 'profile' | 'admin';

interface NavbarProps {
  currentView: View;
  setView: (v: View) => void;
  user: User | null;
  isAdmin: boolean;
  onLogout: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
}

export const Navbar = ({ currentView, setView, user, isAdmin, onLogout, onShowLogin, onShowRegister }: NavbarProps) => {
  const [showTranslator, setShowTranslator] = useState(false);

  const navItems: { id: View; label: string }[] = [
    { id: 'home', label: 'Início' },
    { id: 'prompts', label: 'Prompts' },
    { id: 'categories', label: 'Categorias' },
    ...(user ? [{ id: 'profile' as View, label: 'Perfil' }] : []),
    ...(isAdmin ? [{ id: 'admin' as View, label: 'Admin' }] : []),
  ];

  return (
    <>
      {showTranslator && <TranslateModal onClose={() => setShowTranslator(false)} />}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <img src="/src/assets/logo.png" alt="EcoPrompts" className="h-10 w-auto" />
          <span className="text-xl font-extrabold"><span className="eco-brand-eco">Eco</span><span className="eco-brand-prompts">Prompts</span></span>
        </div>

        <div className="flex gap-1">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${currentView === id
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
            >
              {label}
            </button>
          ))}
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
            onClick={() => setShowTranslator(true)}
          >
            Tradutor
          </button>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-500">Olá, {user.username}</span>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
                onClick={onLogout}
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <button
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
                onClick={onShowLogin}
              >
                Entrar
              </button>
              <button
                className="bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-800 transition-all"
                onClick={onShowRegister}
              >
                Registar
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};
