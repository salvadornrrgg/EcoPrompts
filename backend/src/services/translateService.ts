const LIBRETRANSLATE_URL = process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';

export const translateText = async (text: string, source: string, target: string): Promise<string> => {
    const body: Record<string, string> = { q: text, source, target, format: 'text' };

    const apiKey = process.env.LIBRETRANSLATE_API_KEY;
    if (apiKey) body.api_key = apiKey;

    const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({})) as any;
        throw new Error(err.error || `LibreTranslate respondeu com ${res.status}`);
    }

    const data = await res.json() as any;
    return data.translatedText as string;
};
