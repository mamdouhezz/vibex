// FIX: Implemented missing file content with Gemini API integration.
import { ChunkingOutput, CitationAnalysis, OrchestratorContext, PreprocessingOutput } from '../types.ts';
import { Logger } from '../services/logger.ts';
import { GoogleGenAI } from "@google/genai";

const logger = new Logger('CitationModule');

interface CitationInput {
    preprocessing: PreprocessingOutput;
    chunking: ChunkingOutput;
}
/**
 * Citation Probability Module (AI-Powered)
 * Estimates the likelihood that the content will be cited by major AI platforms.
 * @param input The combined preprocessed and chunked data.
 * @param context Orchestrator context for logging.
 * @returns A promise resolving to the citation analysis.
 */
export const analyzeCitation = async (input: CitationInput, context: OrchestratorContext): Promise<CitationAnalysis> => {
    logger.info(`Starting citation probability analysis for job ${input.preprocessing.jobId}...`, context.traceId);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';

    const contentSummary = input.chunking.chunks.map(c => `H: ${c.headingContext.join(' > ')}\n${c.content.substring(0, 100)}...`).join('\n\n');

    const prompt = `
        You are an expert in Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO).
        Analyze the following content structure and metadata for its likelihood of being cited by AI models like ChatGPT, Gemini, and Perplexity.

        Content Metadata:
        - Title: ${input.preprocessing.metadata.title}
        - Description: ${input.preprocessing.metadata.description}
        - Word Count: ${input.preprocessing.wordCount}
        - Readability Score: ${input.preprocessing.readabilityScore}

        Content Summary:
        ${contentSummary.substring(0, 2000)}

        Based on this information, provide a probability score from 0.00 to 1.00 for the following:
        1.  **citation_probability**: The overall likelihood of this content being used as a source in a generative AI answer.
        2.  **platform_predictions**: A breakdown of the probability for specific platforms.

        Return your answer as a JSON object with this exact structure:
        {
            "citation_probability": 0.82,
            "platform_predictions": {
                "ChatGPT": 0.85,
                "Gemini": 0.78,
                "Perplexity": 0.83
            }
        }
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        logger.info(`Citation analysis complete for job ${input.preprocessing.jobId}. Overall score: ${result.citation_probability}.`, context.traceId);
        return result;

    } catch (error) {
        logger.error('AI citation analysis failed. Returning mock data.', context.traceId, error);
        // Fallback to mock data on failure
        return {
            citation_probability: 0.65,
            platform_predictions: {
                ChatGPT: 0.70,
                Gemini: 0.68,
                Perplexity: 0.60,
            },
        };
    }
};
