import { Chunk, ChunkingInput, ChunkingOutput } from '../../types.ts';
import { Logger } from '../../services/logger.ts';

const logger = new Logger('ChunkingEngine');

const MIN_CHUNK_TOKENS = 100;
const MAX_CHUNK_TOKENS = 768;

const mockUuidV4 = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

const countTokens = (text: string): number => Math.ceil(text.split(/\s+/).filter(Boolean).length * 1.33);

// FIX: Added a local escapeRegExp function because RegExp.escape is non-standard and caused errors.
const escapeRegExp = (s: string) => {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * Content Chunking Engine
 * Splits cleaned text into semantically coherent chunks based on heading hierarchy,
 * which is required by downstream analysis engines in the orchestrator.
 * @param input The structured output from the preprocessing module.
 * @param traceId A unique ID for tracing the request through the pipeline.
 * @returns A promise resolving to the chunking output.
 */
export const runChunking = async (input: ChunkingInput, traceId: string): Promise<ChunkingOutput> => {
    logger.info('Starting content chunking (heading-based strategy)...', traceId);
    
    const { cleanText } = input;
    const headings = [{ level: 0, text: input.metadata.title }, ...input.metadata.headings];
    
    let rawChunks: { content: string; headingContext: string[] }[] = [];
    let headingContext: string[] = [input.metadata.title];
    let currentHeadingIndex = 1;

    const sections = cleanText.split(/\n---H\d---\n/);
    
    // The first section is the intro before any formal headings
    if (sections[0] && sections[0].trim().length > 0) {
        rawChunks.push({ content: sections[0].trim(), headingContext: [...headingContext] });
    }

    for (const heading of input.metadata.headings) {
        const marker = `---H${heading.level}---`;
        const headingTextForSplit = `${heading.text}`;
        // FIX: Use the local escapeRegExp helper instead of the non-standard RegExp.escape.
        const regex = new RegExp(escapeRegExp(headingTextForSplit) + '([\\s\\S]*?)(?=\\n---H[1-6]---\\n|$)');
        const match = cleanText.match(regex);

        if (match) {
            const content = match[1].trim();
            // Update context
            while (headingContext.length > heading.level) {
                headingContext.pop();
            }
            headingContext[heading.level] = heading.text;
            headingContext = headingContext.slice(0, heading.level + 1);

            if (content) {
                rawChunks.push({ content, headingContext: [...headingContext] });
            }
        }
    }
    
    // Process raw chunks to respect token limits
    const finalChunks: Chunk[] = [];
    rawChunks.forEach(rawChunk => {
        let currentContent = rawChunk.content;
        let tokenCount = countTokens(currentContent);

        while (tokenCount > MAX_CHUNK_TOKENS) {
            const splitPoint = Math.floor(currentContent.length * (MAX_CHUNK_TOKENS / tokenCount));
            let bestSplit = currentContent.lastIndexOf('. ', splitPoint) + 1;
            if (bestSplit <= 0) bestSplit = splitPoint;

            const part = currentContent.substring(0, bestSplit);
            finalChunks.push({
                id: mockUuidV4(),
                jobId: traceId,
                content: part,
                headingContext: rawChunk.headingContext,
                position: -1,
                tokenCount: countTokens(part),
            });
            currentContent = currentContent.substring(bestSplit).trim();
            tokenCount = countTokens(currentContent);
        }

        if (tokenCount > 0) {
            finalChunks.push({
                id: mockUuidV4(),
                jobId: traceId,
                content: currentContent,
                headingContext: rawChunk.headingContext,
                position: -1,
                tokenCount: tokenCount,
            });
        }
    });
    
    // Merge small chunks
    const mergedChunks: Chunk[] = [];
    for (const chunk of finalChunks) {
        const prevChunk = mergedChunks[mergedChunks.length - 1];
        if (prevChunk && chunk.tokenCount < MIN_CHUNK_TOKENS &&
            JSON.stringify(prevChunk.headingContext) === JSON.stringify(chunk.headingContext) &&
            (prevChunk.tokenCount + chunk.tokenCount) <= MAX_CHUNK_TOKENS) 
        {
            prevChunk.content += `\n\n${chunk.content}`;
            prevChunk.tokenCount += chunk.tokenCount;
        } else {
            mergedChunks.push(chunk);
        }
    }
    
    const positionedChunks = mergedChunks.map((chunk, index) => ({ ...chunk, position: index }));

    logger.info(`Chunking complete. Generated ${positionedChunks.length} chunks.`, traceId);
    return { jobId: traceId, chunks: positionedChunks, totalChunks: positionedChunks.length };
};