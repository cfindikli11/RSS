import { translate } from '@vitalets/google-translate-api';
import config from '../config/config.js';

// In-memory cache for translations
const translationCache = new Map();

export async function translateText(text, targetLang = 'tr') {
    if (!text) return text;

    // Check cache first
    const cacheKey = `${text}_${targetLang}`;
    if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey);
    }

    try {
        const result = await translate(text, { to: targetLang });
        const translated = result.text;

        // Cache the result
        translationCache.set(cacheKey, translated);

        // Cleanup old cache entries periodically (keep last 1000)
        if (translationCache.size > 1000) {
            const firstKey = translationCache.keys().next().value;
            translationCache.delete(firstKey);
        }

        return translated;
    } catch (error) {
        console.error('Translation error:', error.message);
        // Return original text if translation fails
        return text;
    }
}

export function clearTranslationCache() {
    translationCache.clear();
}

export default {
    translateText,
    clearTranslationCache,
};
