import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { RegisterModal } from './components/RegisterModal';
import { HomeView } from './views/HomeView';
import { PromptsView } from './views/PromptsView';
import { CategoriesView } from './views/CategoriesView';
import { ProfileView } from './views/ProfileView';
import { AdminView } from './views/AdminView';

type View = 'home' | 'prompts' | 'categories' | 'profile' | 'admin';

function AppInner() {
  const [view, setView] = useState<View>('home');
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div className="app">
      <Navbar
        view={view}
        setView={setView}
        setShowLogin={setShowLogin}
        setShowRegister={setShowRegister}
      />

      <main className="main-content">
        {view === 'home' && <HomeView setView={setView} setShowLogin={setShowLogin} />}
        {view === 'prompts' && <PromptsView />}
        {view === 'categories' && <CategoriesView />}
        {view === 'profile' && <ProfileView />}
        {view === 'admin' && <AdminView />}
      </main>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
        />
      )}

      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}