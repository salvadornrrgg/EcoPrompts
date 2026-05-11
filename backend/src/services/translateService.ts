const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';

export const translateText = async (text: string, source: string, target: string): Promise<string> => {
    const langpair = source === 'auto' ? `pt|${target}` : `${source}|${target}`;
    const url = `${MYMEMORY_URL}?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`MyMemory respondeu com ${res.status}`);
    }

    const data = await res.json() as any;
    return data.responseData.translatedText as string;
};
