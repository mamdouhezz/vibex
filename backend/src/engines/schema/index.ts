import { ChunkingInput, SchemaAnalysis } from '../../types.ts';
import { Logger } from '../../services/logger.ts';
import { getGenAIClient } from '../../services/gemini.ts';

const logger = new Logger('SchemaEngine');

/**
 * Schema Validation Engine (AI-Powered)
 * Analyzes content to detect existing and suggest missing schema.org types.
 */
export const runSchemaValidation = async (input: ChunkingInput, traceId: string): Promise<SchemaAnalysis> => {
    logger.info(`Starting schema analysis...`, traceId);

    const ai = getGenAIClient();
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        Analyze the following text content and website metadata to determine relevant schema.org types.
        - Title: "${input.metadata.title}"
        - Description: "${input.metadata.description}"
        - Content Sample: "${input.cleanText.substring(0, 500)}..."

        Return a JSON object with two keys: "detected" (likely existing schemas) and "missing" (recommended schemas to add).
        Example: { "detected": ["Article"], "missing": ["FAQPage", "BreadcrumbList"] }
    `;

    try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: { responseMimeType: "application/json" }
        });
        
        const result = JSON.parse(response.text.trim());
        logger.info(`Schema analysis complete. Detected: ${result.detected.join(', ')}. Missing: ${result.missing.join(', ')}.`, traceId);
        return result;

    } catch (error) {
        logger.error('AI schema analysis failed. Returning fallback data.', traceId, error);
        return { detected: ["Article (fallback)"], missing: ["FAQPage (fallback)"] };
    }
};
