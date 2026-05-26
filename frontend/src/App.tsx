import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { HomeView } from './views/HomeView';
import { PromptsView } from './views/PromptsView';
import { CategoriesView } from './views/CategoriesView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

export interface User {
  id: number;
  username: string;
  email: string;
  userType: string;
}

type View = 'home' | 'prompts' | 'categories' | 'profile' | 'admin';

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [view, setView] = useState<View>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (t: string, u: User) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
    setToken(t);
    setUser(u);
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.userType === 'Admin' || user?.userType === '2';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentView={view}
        setView={setView}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onShowLogin={() => setShowLogin(true)}
        onShowRegister={() => setShowRegister(true)}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {view === 'home' && (
          <HomeView setView={setView} user={user} onShowLogin={() => setShowLogin(true)} />
        )}
        {view === 'prompts' && (
          <PromptsView token={token} user={user} isAdmin={isAdmin} />
        )}
        {view === 'categories' && (
          <CategoriesView token={token} isAdmin={isAdmin} />
        )}
        {view === 'profile' && (
          <ProfileView token={token} user={user} onLogout={handleLogout} />
        )}
        {view === 'admin' && (
          <AdminView token={token} isAdmin={isAdmin} />
        )}
      </main>

      {showLogin && (
        <Login
          onSuccess={handleLogin}
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}
      {showRegister && (
        <Register
          onSuccess={handleLogin}
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
}

export default App;
