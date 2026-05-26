import { useState } from 'react';
import * as api from '../api/api';

const TARGET_LANGS = [
  { code: 'en', label: 'Inglês (EN)' },
  { code: 'es', label: 'Espanhol (ES)' },
  { code: 'fr', label: 'Francês (FR)' },
  { code: 'de', label: 'Alemão (DE)' },
];

interface TranslateModalProps {
  onClose: () => void;
  initialText?: string;
}

export const TranslateModal = ({ onClose, initialText }: TranslateModalProps) => {
  const [text, setText] = useState(initialText ?? '');
  const [target, setTarget] = useState('en');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const res = await api.translate(text, 'auto', target);
      setTranslatedText(res.translatedText);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="eco-overlay fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="eco-modal bg-white rounded-xl shadow-lg p-8 w-full max-w-lg max-h-screen overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Tradutor</h2>
          <button className="text-gray-400 hover:text-gray-600 text-xl" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Texto a traduzir</label>
            {initialText !== undefined ? (
              <pre className="eco-code bg-gray-900 text-gray-100 p-4 rounded-lg text-sm whitespace-pre-wrap break-words max-h-36 overflow-y-auto">
                {text}
              </pre>
            ) : (
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Escreve o texto a traduzir..."
                rows={5}
                className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600 resize-y"
              />
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Traduzir para</label>
            <select
              value={target}
              onChange={e => setTarget(e.target.value)}
              className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-green-600"
            >
              {TARGET_LANGS.map(l => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </div>

          <button
            className="bg-green-700 text-white p-2 rounded-lg font-medium hover:bg-green-800 disabled:opacity-60"
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
          >
            {loading ? 'A traduzir...' : 'Traduzir'}
          </button>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}

          {translatedText && (
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Tradução</label>
                <button
                  className="border border-gray-300 text-gray-600 px-3 py-1 rounded text-xs hover:bg-gray-50"
                  onClick={handleCopy}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <pre className="eco-code-result bg-gray-50 border border-gray-200 text-gray-700 p-4 rounded-lg text-sm whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                {translatedText}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
