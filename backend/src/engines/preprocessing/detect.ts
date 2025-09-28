
/**
 * VibeX Preprocessing Engine - Detection Utilities
 *
 * Contains functions for detecting content properties like language.
 */

/**
 * Mock of `franc` to detect language from an HTML string.
 * @param html The raw HTML content.
 * @param declaredLang An optional language hint.
 * @returns The detected language code (e.g., 'en', 'ar').
 */
export const detectLanguage = (html: string, declaredLang?: string): string => {
    const langAttr = (html.match(/<html\s+lang="([^"]+)"/i) || [])[1];
    if (langAttr) return langAttr.split('-')[0];
    if (declaredLang) return declaredLang;
    // Simple regex to check for Arabic characters as a fallback
    return /[\u0600-\u06FF]/.test(html) ? 'ar' : 'en';
};
