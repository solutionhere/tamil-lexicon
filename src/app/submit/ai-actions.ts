'use server';

import { suggestTransliteration as suggestTransliterationFlow } from '@/ai/flows/suggest-transliteration';

export async function suggestTransliteration(tamilWord: string): Promise<{ transliteration: string }> {
    if (!tamilWord) return { transliteration: '' };
    
    try {
        const result = await suggestTransliterationFlow({ tamilWord });
        return { transliteration: result.transliteration };
    } catch (error) {
        console.error("AI transliteration failed:", error);
        // Fallback or error handling
        return { transliteration: '' };
    }
}

// Placeholder for reverse transliteration - would need a new Genkit flow.
export async function suggestTamilWord(englishWord: string): Promise<{ tamilWord: string }> {
    if (!englishWord) return { tamilWord: '' };
    // This would be another Genkit flow call in a real implementation.
    return { tamilWord: '' };
}
