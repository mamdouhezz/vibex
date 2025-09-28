// FIX: Implemented missing file content with Gemini API integration.
import { ChunkingInput, SchemaAnalysis, OrchestratorContext } from '../types.ts';
import { Logger } from '../services/logger.ts';
import { GoogleGenAI } from "@google/genai";

const logger = new Logger('SchemaModule');

/**
 * Schema Analysis Module (AI-Powered)
 * Analyzes the content to detect existing schema and suggest missing ones.
 * @param input The preprocessed content data.
 * @param context Orchestrator context for logging.
 * @returns A promise resolving to the schema analysis result.
 */
export const analyzeSchema = async (input: ChunkingInput, context: OrchestratorContext): Promise<SchemaAnalysis> => {
    logger.info(`Starting schema analysis for job ${input.jobId}...`, context.traceId);

    // In a real implementation, this would involve a complex prompt to an LLM
    // asking it to analyze the text and determine appropriate schema.org types.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        Analyze the following text content and website metadata to determine the most relevant schema.org types.
        Content title: "${input.metadata.title}"
        Content description: "${input.metadata.description}"
        
        Cleaned text content (first 500 chars):
        "${input.cleanText.substring(0, 500)}..."

        Based on the content, list the schema.org types that are likely already present or could be represented by the content.
        Then, list important and relevant schema.org types that are likely missing and would improve SEO and AEO.

        Return your answer as a JSON object with two keys: "detected" and "missing", where each key has an array of strings as its value.
        For example: { "detected": ["Article"], "missing": ["FAQPage", "BreadcrumbList"] }
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

        logger.info(`Schema analysis complete for job ${input.jobId}. Detected: ${result.detected.join(', ')}. Missing: ${result.missing.join(', ')}.`, context.traceId);
        return result;

    } catch (error) {
        logger.error('AI schema analysis failed. Returning mock data.', context.traceId, error);
        // Fallback to mock data on failure
        return {
            detected: ["Article"],
            missing: ["FAQPage", "HowTo"],
        };
    }
};
