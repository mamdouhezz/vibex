
import { PreprocessingOutput, Heading } from '../../types.ts';
import { Logger } from '../../services/logger.ts';
import { detectLanguage } from './detect.ts';
import { normalizeText, countWords, calculateReadability } from './normalize.ts';
import { extractTitle, extractMetaDescription, extractCanonicalUrl, extractHeadings, extractCleanText } from './sanitize.ts';

const logger = new Logger('PreprocessingEngine');

/**
 * Simulates fetching the content of a URL.
 * In a real Node.js server, this would use a library like node-fetch or axios.
 * @param url The URL to "fetch".
 * @returns A promise resolving to mock HTML content.
 */
const fetchUrlContent = async (url: string): Promise<string> => {
    logger.info(`[Server] Simulating fetch for URL: ${url}`);
    await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network latency
    return `
        <html>
            <head>
                <title>Analysis for ${url}</title>
                <meta name="description" content="A page about AEO and GEO." />
                <link rel="canonical" href="${url}" />
            </head>
            <body>
                <h1>What is AEO?</h1>
                <p>Answer Engine Optimization (AEO) is the process of optimizing your content to appear directly in the answers provided by AI engines like Google, ChatGPT, and Perplexity. It focuses on structured data and clear authority.</p>
                <h2>Why is it important?</h2>
                <p>Because user behavior is shifting from clicking links to consuming direct answers from AI systems. If your content isn't optimized for AEO, you lose visibility in this new paradigm.</p>
                <h3>Key Benefits</h3>
                <p>The key benefits include higher visibility, brand authority, and future-proofing your content strategy.</p>
            </body>
        </html>
    `;
};


/**
 * Preprocessing Engine
 * Fetches, cleans, normalizes, and extracts metadata from raw content.
 * This is the main entry point for the preprocessing stage of the orchestrator.
 * @param url The URL to be processed.
 * @param traceId A unique ID for tracing the request through the pipeline.
 * @returns A promise resolving to the structured PreprocessingOutput.
 */
export const runPreprocessing = async (url: string, traceId: string): Promise<PreprocessingOutput> => {
    logger.info('Starting content preprocessing...', traceId);
    
    // 1. Fetch Content
    const rawContent = await fetchUrlContent(url);
    
    // 2. Detect Language
    const lang = detectLanguage(rawContent);
    logger.info(`Detected language: ${lang}`, traceId);

    // 3. Sanitize & Extract Metadata
    const headings = extractHeadings(rawContent);
    const title = extractTitle(rawContent) || headings.find(h => h.level === 1)?.text || 'Untitled';
    const description = extractMetaDescription(rawContent) || '';
    const canonicalUrl = extractCanonicalUrl(rawContent);
    logger.info(`Extracted metadata. Title: "${title}", Headings: ${headings.length}`, traceId);

    // 4. Extract Clean Text
    const cleanTextWithMarkers = extractCleanText(rawContent);
    
    // 5. Normalize Text
    const normalizedText = normalizeText(cleanTextWithMarkers);
    logger.info(`Content cleaned and normalized.`, traceId);

    // 6. Calculate Quality Scores
    const wordCount = countWords(normalizedText.replace(/---H\d---/g, '')); // Exclude markers from word count
    const readabilityScore = calculateReadability(wordCount, normalizedText);
    logger.info(`Calculated quality scores. Word Count: ${wordCount}, Readability: ${readabilityScore}`, traceId);

    // 7. Assemble Output
    const output: PreprocessingOutput = {
        jobId: traceId,
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

    logger.info('Preprocessing complete.', traceId);
    return output;
};