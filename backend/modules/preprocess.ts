import { Job, OrchestratorContext, PreprocessingOutput, Heading } from '../types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('PreprocessModule');

// --- Mock Library Functions ---

/** Mock of `cheerio` to extract data from HTML string */
const mockCheerio = {
    extractTitle: (html: string): string => (html.match(/<title>(.*?)<\/title>/i) || ['', ''])[1].trim(),
    extractMetaDescription: (html: string): string => (html.match(/<meta\s+name="description"\s+content="(.*?)"/i) || ['', ''])[1].trim(),
    extractCanonicalUrl: (html: string): string | undefined => (html.match(/<link\s+rel="canonical"\s+href="(.*?)"/i) || [])[1]?.trim(),
    extractHeadings: (html: string): Heading[] => {
        const matches = html.matchAll(/<(h[1-3])[^>]*>(.*?)<\/\1>/gi);
        return Array.from(matches, m => ({
            level: parseInt(m[1][1], 10), // Get the number from 'h1', 'h2', etc.
            text: m[2].trim(),
        }));
    },
    extractCleanText: (html: string): string => {
        return html
            // Remove scripts, styles, and other noise
            .replace(/<(script|style|nav|footer|aside)[\s\S]*?<\/\1>/gi, '')
            // Convert headings to a special marker format for the chunker to find later
            .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, '\n---H$1---\n$2\n')
            // Remove all remaining HTML tags
            .replace(/<[^>]+>/g, ' ')
            .trim();
    }
};

/** Mock of `franc` to detect language */
const detectLanguage = (html: string, declaredLang?: string): string => {
    const langAttr = (html.match(/<html\s+lang="([^"]+)"/i) || [])[1];
    if (langAttr) return langAttr.split('-')[0];
    if (declaredLang) return declaredLang;
    // Simple regex to check for Arabic characters
    return /[\u0600-\u06FF]/.test(html) ? 'ar' : 'en';
};

/** Mock of `reading-time` and other text analysis libs */
const analyzeText = {
    normalize: (text: string): string => {
        return text
            .replace(/[“”]/g, '"').replace(/[‘’]/g, "'") // Normalize quotes
            .replace(/\s+/g, ' ') // Normalize whitespace
            .trim();
    },
    wordCount: (text: string): number => text.split(/\s+/).filter(Boolean).length,
    readabilityScore: (wordCount: number, text: string): number => {
        // Mock Flesch reading ease score. A real implementation would be more complex.
        const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;
        const avgSentenceLength = wordCount / sentenceCount;
        const mockScore = Math.max(0, 90 - (avgSentenceLength * 2)); // Simplified heuristic
        return Math.round(mockScore);
    }
};

// --- Main Module Function ---

/**
 * Preprocessing Layer
 * Cleans, normalizes, and extracts metadata from raw content. This is the
 * real implementation of the first pipeline step, replacing the initial mock.
 * @param job The full job object containing raw content and metadata.
 * @param context Orchestrator context with traceId for logging.
 * @returns A promise resolving to the structured PreprocessingOutput.
 */
export const cleanContent = async (job: Job, context: OrchestratorContext): Promise<PreprocessingOutput> => {
    logger.info('Starting full content preprocessing...', context.traceId);
    
    const { content: rawContent, url, jobId } = job;

    // 1. Language Detection
    const lang = detectLanguage(rawContent, job.language);
    logger.info(`Detected language: ${lang}`, context.traceId);

    // 2. Metadata Extraction (extract headings with levels first)
    const headings = mockCheerio.extractHeadings(rawContent);
    const title = mockCheerio.extractTitle(rawContent) || headings.find(h => h.level === 1)?.text || 'Untitled';
    const description = mockCheerio.extractMetaDescription(rawContent);
    const canonicalUrl = mockCheerio.extractCanonicalUrl(rawContent);
    logger.info(`Extracted metadata. Title: "${title}", Headings: ${headings.length}`, context.traceId);

    // 3. HTML Cleaning & Text Extraction (this now adds markers for headings)
    const cleanTextWithMarkers = mockCheerio.extractCleanText(rawContent);
    
    // 4. Text Normalization
    const normalizedText = analyzeText.normalize(cleanTextWithMarkers);
    logger.info(`Content cleaned and normalized.`, context.traceId);

    // 5. Quality Scoring
    const wordCount = analyzeText.wordCount(normalizedText.replace(/---H\d---/g, '')); // Exclude markers from word count
    const readabilityScore = analyzeText.readabilityScore(wordCount, normalizedText);
    logger.info(`Calculated quality scores. Word Count: ${wordCount}, Readability: ${readabilityScore}`, context.traceId);

    // 6. Assemble Output
    const output: PreprocessingOutput = {
        jobId,
        cleanText: normalizedText,
        metadata: {
            title,
            description,
            canonicalUrl,
            headings,
            lang,
        },
        wordCount,
        readabilityScore,
    };

    logger.info('Preprocessing complete.', context.traceId);
    return output;
};
