
/**
 * VibeX Preprocessing Engine - Normalization Utilities
 *
 * Contains functions for normalizing text and calculating quality scores.
 */

/** Normalizes whitespace and quotes in a string. */
export const normalizeText = (text: string): string => {
    return text
        .replace(/[“”]/g, '"').replace(/[‘’]/g, "'") // Normalize quotes
        .replace(/\s+/g, ' ') // Collapse whitespace
        .trim();
};

/** Counts the words in a string. */
export const countWords = (text: string): number => text.split(/\s+/).filter(Boolean).length;

/**
 * Calculates a mock Flesch reading ease score.
 * @param wordCount The total number of words.
 * @param text The text to analyze for sentence count.
 * @returns A readability score.
 */
export const calculateReadability = (wordCount: number, text: string): number => {
    // A real implementation would be more complex.
    const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;
    const avgSentenceLength = wordCount / sentenceCount;
    const mockScore = Math.max(0, 90 - (avgSentenceLength * 2)); // Simplified heuristic
    return Math.round(mockScore);
};
