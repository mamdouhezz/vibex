import { Chunk, ChunkingInput, ChunkingOutput, OrchestratorContext } from '../types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('ChunkingModule');

const MIN_CHUNK_TOKENS = 100; // Corresponds to roughly 75 words
const MAX_CHUNK_TOKENS = 768; // Optimal size for many embedding models

// --- Mock Library Functions ---

/** Mock of `uuid` library. */
const mockUuidV4 = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

/** Mock of `tiktoken` to count tokens. A simple heuristic is used here. */
const countTokens = (text: string): number => {
    return Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.33);
};


/**
 * Content Chunking Engine (Algo_01 - Real Implementation)
 * Splits cleaned text into semantically coherent chunks based on heading hierarchy.
 * @param input The structured output from the preprocessing module.
 * @param context Orchestrator context with traceId for logging.
 * @returns A promise resolving to the chunking output.
 */
export const splitContent = async (input: ChunkingInput, context: OrchestratorContext): Promise<ChunkingOutput> => {
    logger.info('Starting content chunking engine...', context.traceId);
    
    const { jobId, cleanText } = input;
    
    // Split text by the heading markers inserted by the preprocessor
    const sections = cleanText.split(/\n---H\d---\n/).filter(s => s.trim().length > 0);
    const headings = [{ level: 0, text: input.metadata.title }, ...input.metadata.headings];
    
    let rawChunks: { content: string; headingContext: string[] }[] = [];
    let headingContext: string[] = [input.metadata.title];
    let currentHeadingIndex = 1;

    for (const section of sections) {
        // The first part is the intro text before any H1/H2/H3
        if (currentHeadingIndex > headings.length || !section.startsWith(headings[currentHeadingIndex].text)) {
             rawChunks.push({ content: section.trim(), headingContext: [...headingContext] });
             continue;
        }

        const currentHeading = headings[currentHeadingIndex];
        const content = section.substring(currentHeading.text.length).trim();
        
        // Update heading context based on hierarchy
        while (headingContext.length > currentHeading.level) {
            headingContext.pop();
        }
        headingContext[currentHeading.level] = currentHeading.text;
        
        // Ensure context is clean up to the current level
        headingContext = headingContext.slice(0, currentHeading.level + 1);

        if (content) {
            rawChunks.push({ content, headingContext: [...headingContext] });
        }
        
        currentHeadingIndex++;
    }

    // Process raw chunks to respect token limits
    const finalChunks: Chunk[] = [];
    let position = 0;
    for (const rawChunk of rawChunks) {
        let currentContent = rawChunk.content;
        let tokenCount = countTokens(currentContent);

        // If chunk is too large, split it by paragraphs
        while (tokenCount > MAX_CHUNK_TOKENS) {
            // Find a good split point (e.g., after a paragraph)
            const splitPoint = Math.floor(currentContent.length * (MAX_CHUNK_TOKENS / tokenCount));
            let bestSplit = currentContent.lastIndexOf('. ', splitPoint) + 1;
            if (bestSplit <= 0) bestSplit = splitPoint;

            const part = currentContent.substring(0, bestSplit);
            finalChunks.push({
                id: mockUuidV4(),
                jobId,
                content: part,
                headingContext: rawChunk.headingContext,
                position: position++,
                tokenCount: countTokens(part),
            });
            currentContent = currentContent.substring(bestSplit).trim();
            tokenCount = countTokens(currentContent);
        }

        // Add the remaining part (or the original if it was small enough)
        if (tokenCount > 0) {
            finalChunks.push({
                id: mockUuidV4(),
                jobId,
                content: currentContent,
                headingContext: rawChunk.headingContext,
                position: position++,
                tokenCount: tokenCount,
            });
        }
    }
    
    // Merge small chunks
    const mergedChunks: Chunk[] = [];
    for (let i = 0; i < finalChunks.length; i++) {
        const currentChunk = finalChunks[i];
        if (i > 0 && currentChunk.tokenCount < MIN_CHUNK_TOKENS) {
            const prevChunk = mergedChunks[mergedChunks.length - 1];
            // Only merge if context is the same and size doesn't exceed max
            if (
                JSON.stringify(prevChunk.headingContext) === JSON.stringify(currentChunk.headingContext) &&
                (prevChunk.tokenCount + currentChunk.tokenCount) <= MAX_CHUNK_TOKENS
            ) {
                prevChunk.content += `\n\n${currentChunk.content}`;
                prevChunk.tokenCount += currentChunk.tokenCount;
                continue;
            }
        }
        mergedChunks.push(currentChunk);
    }
    
    logger.info(`Content chunking complete. Generated ${mergedChunks.length} chunks.`, context.traceId);

    return {
        jobId,
        chunks: mergedChunks.map((chunk, index) => ({ ...chunk, position: index })), // Re-assign position after merge
        totalChunks: mergedChunks.length,
    };
};
