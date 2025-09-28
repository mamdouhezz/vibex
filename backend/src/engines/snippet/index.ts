import { ChunkingOutput, Snippet } from '../../types.ts';
import { Logger } from '../../services/logger.ts';
import { getGenAIClient } from '../../services/gemini.ts';

const logger = new Logger('SnippetEngine');

/**
 * Snippet Generation Engine (AI-Powered)
 * Generates concise, AI-ready snippets for each content chunk.
 * @param input The chunked content data.
 * @param traceId Orchestrator trace ID for logging.
 * @returns A promise resolving to an array of generated snippets.
 */
export const runSnippetGeneration = async (input: ChunkingOutput, traceId: string): Promise<Snippet[]> => {
    logger.info(`Starting snippet generation for ${input.totalChunks} chunks...`, traceId);

    const ai = getGenAIClient();
    const model = 'gemini-2.5-flash';

    const snippets: Snippet[] = [];

    // Process chunks in parallel for efficiency
    await Promise.all(input.chunks.map(async (chunk) => {
        const heading = chunk.headingContext[chunk.headingContext.length - 1] || 'Introduction';

        if (chunk.tokenCount > 500) {
            snippets.push({
                heading,
                snippet: "⚠️ Content too long for an effective snippet.",
                score: 0.25,
            });
            return;
        }

        const prompt = `
            Based on the following content chunk, write a concise, "answer-first" snippet of 40-60 words.
            This snippet is for AI answer engines (like ChatGPT, Gemini) and should directly answer the implied question of the heading.

            Heading: "${heading}"
            Content: "${chunk.content}"

            Return ONLY the generated snippet text, no extra formatting.
        `;
        
        try {
            const response = await ai.models.generateContent({ model, contents: prompt });
            const snippetText = response.text.trim();
            const score = Math.max(0.5, 1 - Math.abs(snippetText.split(' ').length - 50) / 50);

            snippets.push({
                heading,
                snippet: snippetText,
                score: parseFloat(score.toFixed(2)),
            });

        } catch (error) {
            logger.error(`AI snippet generation failed for chunk ${chunk.id}.`, traceId, error);
        }
    }));

    logger.info(`Snippet generation complete. Generated ${snippets.length} snippets.`, traceId);
    
    // Ensure snippets are in the correct order based on original chunk position
    snippets.sort((a, b) => {
        const findChunk = (heading: string) => input.chunks.find(c => (c.headingContext[c.headingContext.length - 1] || 'Introduction') === heading);
        return (findChunk(a.heading)?.position || 0) - (findChunk(b.heading)?.position || 0);
    });

    return snippets;
};
