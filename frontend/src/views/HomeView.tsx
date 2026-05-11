import { useAuth } from '../context/AuthContext';

interface HomeViewProps {
  setView: (v: any) => void;
  setShowLogin: (v: boolean) => void;
}

export const HomeView = ({ setView, setShowLogin }: HomeViewProps) => {
  const { user } = useAuth();

  return (
    <div className="home-view">
      <div className="home-hero">
        <div className="home-badge">🌿 Prompt Engineering Colaborativo</div>
        <h1 className="home-title">
          Partilha prompts.<br />
          <span className="home-title-accent">Poupa energia.</span>
        </h1>
        <p className="home-subtitle">
          Uma plataforma colaborativa para descobrir, partilhar e otimizar prompts para modelos de IA —
          reduzindo interações desnecessárias e o impacto ambiental.
        </p>
        <div className="home-actions">
          <button className="btn-primary large" onClick={() => setView('prompts')}>
            Explorar Prompts
          </button>
          {!user && (
            <button className="btn-outline large" onClick={() => setShowLogin(true)}>
              Entrar na comunidade
            </button>
          )}
        </div>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Pesquisa Semântica</h3>
          <p>Encontra prompts por significado, não apenas por palavras-chave.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🔄</div>
          <h3>Versionamento</h3>
          <p>Melhora prompts existentes e mantém um histórico de evoluções.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⭐</div>
          <h3>Avaliações</h3>
          <p>A comunidade avalia e destaca os prompts mais eficazes.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💬</div>
          <h3>Discussão</h3>
          <p>Comenta e discute técnicas de prompt engineering.</p>
        </div>
      </div>
    </div>
  );
};
