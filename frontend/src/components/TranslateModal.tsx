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
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal large" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Tradutor</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <div className="form-group">
                    <label>Texto a traduzir</label>
                    {initialText !== undefined ? (
                        <pre className="code-block" style={{ maxHeight: '150px', overflowY: 'auto' }}>{text}</pre>
                    ) : (
                        <textarea
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Escreve o texto a traduzir..."
                            rows={5}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Traduzir para</label>
                    <select value={target} onChange={e => setTarget(e.target.value)}>
                        {TARGET_LANGS.map(l => (
                            <option key={l.code} value={l.code}>{l.label}</option>
                        ))}
                    </select>
                </div>

                <button
                    className="btn-primary full-width"
                    onClick={handleTranslate}
                    disabled={loading || !text.trim()}
                >
                    {loading ? 'A traduzir...' : 'Traduzir'}
                </button>

                {error && <div className="alert-error" style={{ marginTop: '0.75rem' }}>{error}</div>}

                {translatedText && (
                    <div className="form-group" style={{ marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <label>Tradução</label>
                            <button
                                className="btn-outline"
                                onClick={handleCopy}
                                style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                            >
                                {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                        </div>
                        <pre className="code-block result" style={{ maxHeight: '200px', overflowY: 'auto' }}>{translatedText}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};
