import type { User } from '../App';

type View = 'home' | 'prompts' | 'categories' | 'profile' | 'admin';

interface HomeViewProps {
  setView: (v: View) => void;
  user: User | null;
  onShowLogin: () => void;
}

export const HomeView = ({ setView, user, onShowLogin }: HomeViewProps) => {
  return (
    <div>
      <div className="text-center py-20">
        <div className="inline-block bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
          🌿 Prompt Engineering Colaborativo
        </div>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
          Partilha prompts.<br />
          <span className="text-green-700">Poupa energia.</span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-lg mb-8">
          Uma plataforma colaborativa para descobrir, partilhar e otimizar prompts para modelos de IA —
          reduzindo interações desnecessárias e o impacto ambiental.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            className="bg-green-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-800 transition-all"
            onClick={() => setView('prompts')}
          >
            Explorar Prompts
          </button>
          {!user && (
            <button
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all"
              onClick={onShowLogin}
            >
              Entrar na comunidade
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mt-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-800 mb-1">Pesquisa Semântica</h3>
          <p className="text-sm text-gray-500">Encontra prompts por significado, não apenas por palavras-chave.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-3">🔄</div>
          <h3 className="font-semibold text-gray-800 mb-1">Versionamento</h3>
          <p className="text-sm text-gray-500">Melhora prompts existentes e mantém um histórico de evoluções.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-3">⭐</div>
          <h3 className="font-semibold text-gray-800 mb-1">Avaliações</h3>
          <p className="text-sm text-gray-500">A comunidade avalia e destaca os prompts mais eficazes.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="text-3xl mb-3">💬</div>
          <h3 className="font-semibold text-gray-800 mb-1">Discussão</h3>
          <p className="text-sm text-gray-500">Comenta e discute técnicas de prompt engineering.</p>
        </div>
      </div>
    </div>
  );
};
