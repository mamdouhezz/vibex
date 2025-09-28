// FIX: Implemented missing file content with Gemini API integration.
import { ChunkingOutput, Snippet, OrchestratorContext } from '../types.ts';
import { Logger } from '../services/logger.ts';
import { GoogleGenAI } from "@google/genai";

const logger = new Logger('SnippetModule');

/**
 * Snippet Generation Module (AI-Powered)
 * Generates concise, AI-ready snippets for each content chunk.
 * @param input The chunked content data.
 * @param context Orchestrator context for logging.
 * @returns A promise resolving to an array of generated snippets.
 */
export const generateSnippets = async (input: ChunkingOutput, context: OrchestratorContext): Promise<Snippet[]> => {
    logger.info(`Starting snippet generation for ${input.totalChunks} chunks in job ${input.jobId}...`, context.traceId);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';

    const snippets: Snippet[] = [];

    // Process chunks in parallel for efficiency
    await Promise.all(input.chunks.map(async (chunk) => {
        const heading = chunk.headingContext[chunk.headingContext.length - 1] || 'Introduction';

        // Simple rule-based check for suitability
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
            This snippet will be used by AI answer engines (like ChatGPT, Gemini). It should directly answer the implied question of the heading.

            Heading: "${heading}"
            Content: "${chunk.content}"

            Return ONLY the generated snippet text, with no extra formatting or explanations.
        `;
        
        try {
            const response = await ai.models.generateContent({
                model,
                contents: prompt,
            });

            const snippetText = response.text.trim();
            
            // A simple scoring heuristic
            const score = Math.max(0.5, 1 - Math.abs(snippetText.split(' ').length - 50) / 50);

            snippets.push({
                heading,
                snippet: snippetText,
                score: parseFloat(score.toFixed(2)),
            });

        } catch (error) {
            // FIX: Changed logger.warn to logger.error to correctly log the error object, which accepts three arguments. This is consistent with other modules.
            logger.error(`AI snippet generation failed for chunk ${chunk.id}. Skipping.`, context.traceId, error);
        }
    }));

    logger.info(`Snippet generation complete for job ${input.jobId}. Generated ${snippets.length} snippets.`, context.traceId);
    
    // Ensure snippets are in the correct order
    snippets.sort((a, b) => {
        const chunkA = input.chunks.find(c => (c.headingContext[c.headingContext.length - 1] || 'Introduction') === a.heading);
        const chunkB = input.chunks.find(c => (c.headingContext[c.headingContext.length - 1] || 'Introduction') === b.heading);
        return (chunkA?.position || 0) - (chunkB?.position || 0);
    });

    return snippets;
};