'use server';

// AI functionality has been removed.
// These functions are kept to prevent import errors but are no longer functional.

export async function suggestTransliteration(tamilWord: string): Promise<{ transliteration: string }> {
    console.warn("AI transliteration is disabled.");
    return { transliteration: '' };
}

export async function suggestTamilWord(englishWord: string): Promise<{ tamilWord: string }> {
    console.warn("AI reverse transliteration is disabled.");
    return { tamilWord: '' };
}
