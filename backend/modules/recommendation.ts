// FIX: Implemented missing file content.
import { OrchestrationResult, Recommendation, OrchestratorContext, PreprocessingOutput, ChunkingOutput, SchemaAnalysis, Snippet } from '../types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('RecommendationModule');

interface RecommendationInput {
    preprocessing: PreprocessingOutput;
    chunking: ChunkingOutput;
    schema: SchemaAnalysis;
    snippets: Snippet[];
}

/**
 * Recommendation Engine (Rule-Based & Heuristic)
 * Generates actionable recommendations based on the full analysis pipeline.
 * @param input The combined analysis data.
 * @param context Orchestrator context for logging.
 * @returns A promise resolving to an array of recommendations.
 */
export const generateRecommendations = async (input: RecommendationInput, context: OrchestratorContext): Promise<Recommendation[]> => {
    logger.info(`Starting recommendation engine for job ${input.preprocessing.jobId}...`, context.traceId);

    const recommendations: Recommendation[] = [];
    const { preprocessing, chunking, schema, snippets } = input;

    // Rule 1: Missing critical schema
    if (schema.missing.includes("FAQPage")) {
        recommendations.push({
            type: "schema_fix",
            priority: "high",
            target: "page",
            message: "Add FAQPage schema to capture common questions and improve your chances of being featured in AI answers.",
            suggested_code: `{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "What is AEO?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Answer Engine Optimization (AEO) is the process of optimizing your content to appear directly in the answers provided by AI engines."
    }
  }]
}`
        });
    }
    
    // Rule 2: Trust signals
    if (!preprocessing.metadata.description) {
        recommendations.push({
            type: "trust_fix",
            priority: "high",
            target: "page",
            message: "Add a meta description. This is a key signal for search and AI engines to understand the page's purpose.",
            example_fix: '<meta name="description" content="A concise summary of the page content, under 160 characters.">'
        });
    }

    // Rule 3: Long chunks
    const longChunk = chunking.chunks.find(c => c.tokenCount > 700); // approx 500 words
    if (longChunk) {
        recommendations.push({
            type: "content_fix",
            priority: "medium",
            target: `Section: '${longChunk.headingContext.slice(1).join(' > ')}'`,
            message: `Split this long section into smaller, more focused chunks. AI engines prefer to cite paragraphs under 150 words.`,
            example_fix: ["Benefit 1: ...", "Benefit 2: ..."]
        });
    }

    // Rule 4: Poor snippets
    const lowScoreSnippet = snippets.find(s => s.score < 0.5);
    if (lowScoreSnippet) {
         recommendations.push({
            type: "snippet_fix",
            priority: "low",
            target: `Section: '${lowScoreSnippet.heading}'`,
            message: "Rewrite the introductory paragraph to be a more direct, 'answer-first' snippet of about 40-60 words.",
            example_fix: "AEO is crucial because user behavior is shifting from clicking links to consuming direct answers from AI. Optimizing for AEO makes your brand the authoritative source."
        });
    }

    logger.info(`Recommendation engine complete. Generated ${recommendations.length} recommendations.`, context.traceId);
    
    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    
    return recommendations;
};
