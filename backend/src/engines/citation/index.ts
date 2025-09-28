import { ChunkingOutput, CitationAnalysis, PreprocessingOutput } from '../../types.ts';
import { Logger } from '../../services/logger.ts';
import { getGenAIClient } from '../../services/gemini.ts';

const logger = new Logger('CitationEngine');

interface CitationInput {
    preprocessing: PreprocessingOutput;
    chunking: ChunkingOutput;
}
/**
 * Citation Probability Engine (AI-Powered)
 * Estimates the likelihood that the content will be cited by major AI platforms.
 * @param input The combined preprocessed and chunked data.
 * @param traceId Orchestrator trace ID for logging.
 * @returns A promise resolving to the citation analysis.
 */
export const runCitationAnalysis = async (input: CitationInput, traceId: string): Promise<CitationAnalysis> => {
    logger.info(`Starting citation probability analysis...`, traceId);

    const ai = getGenAIClient();
    const model = 'gemini-2.5-flash';

    const contentSummary = input.chunking.chunks.map(c => `H: ${c.headingContext.join(' > ')}\n${c.content.substring(0, 100)}...`).join('\n\n');

    const prompt = `
        You are an expert in Answer Engine Optimization (AEO).
        Analyze the following content structure and metadata for its likelihood of being cited by AI models like ChatGPT, Gemini, and Perplexity.

        - Title: ${input.preprocessing.metadata.title}
        - Description: ${input.preprocessing.metadata.description}
        - Word Count: ${input.preprocessing.wordCount}
        - Content Summary: ${contentSummary.substring(0, 2000)}

        Return a JSON object with a probability score (0.00 to 1.00) for the overall content and for each platform.
        The JSON object must have this exact structure:
        {
            "citation_probability": 0.82,
            "platform_predictions": { "ChatGPT": 0.85, "Gemini": 0.78, "Perplexity": 0.83 }
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: { responseMimeType: "application/json" }
        });
        
        const result = JSON.parse(response.text.trim());
        logger.info(`Citation analysis complete. Overall score: ${result.citation_probability}.`, traceId);
        return result;

    } catch (error) {
        logger.error('AI citation analysis failed. Returning fallback data.', traceId, error);
        return {
            citation_probability: 0.65,
            platform_predictions: { ChatGPT: 0.70, Gemini: 0.68, Perplexity: 0.60 },
        };
    }
};
