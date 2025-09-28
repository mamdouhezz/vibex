import { OrchestrationRequest, OrchestrationResult } from "../types.ts";
import { runPreprocessing } from "../engines/preprocessing/index.ts";
import { runChunking } from "../engines/chunking/index.ts";
import { runSchemaValidation } from "../engines/schema/index.ts";
import { runSnippetGeneration } from "../engines/snippet/index.ts";
import { runRecommendationGeneration } from "../engines/recommendation/index.ts";
import { runCitationAnalysis } from "../engines/citation/index.ts";
import { runGraphBuilder } from "../engines/graph/index.ts";
import { runMultilingual } from "../engines/multilingual/index.ts";
import { runStorage } from "../engines/storage/index.ts";
import { logger } from "../services/logger.ts";

export async function orchestrate(
  request: OrchestrationRequest
): Promise<OrchestrationResult> {
  const requestId = crypto.randomUUID();
  logger.info(`Orchestration started for request ${requestId} (URL: ${request.url})`, requestId);
  
  const result: OrchestrationResult = {
    meta: {
      requestId,
      timestamp: new Date().toISOString(),
      processedBy: [],
    },
    errors: [],
  };

  try {
    // Stage 1: Preprocessing
    const preprocessed = await runPreprocessing(request.url, requestId);
    result.preprocessed = preprocessed;
    result.meta.processedBy.push("Preprocessing");

    // Stage 2: Chunking
    const chunks = await runChunking(preprocessed, requestId);
    result.chunks = chunks.chunks;
    result.meta.processedBy.push("Chunking");

    // Stage 3: Parallel Analysis (Schema, Snippets, Citation)
    const [schemas, snippets, citation] = await Promise.all([
        runSchemaValidation(preprocessed, requestId),
        runSnippetGeneration(chunks, requestId),
        runCitationAnalysis({ preprocessing: preprocessed, chunking: chunks }, requestId),
    ]);
    result.schemas = schemas;
    result.snippets = snippets;
    result.citation = citation;
    result.meta.processedBy.push("Schema Validation", "Snippet Generation", "Citation Analysis");

    // Stage 4: Recommendations (depends on parallel results)
    const recommendations = await runRecommendationGeneration({
        preprocessing: preprocessed,
        chunking: chunks,
        schema: schemas,
        snippets: snippets,
    }, requestId);
    result.recommendations = recommendations;
    result.meta.processedBy.push("Recommendation Generation");

    // Stage 5: Knowledge Graph
    const graph = await runGraphBuilder(preprocessed.cleanText, requestId);
    result.graph = graph;
    result.meta.processedBy.push("Knowledge Graph Builder");

    // Stage 6: Multilingual (Mock)
    const multilingual = await runMultilingual(result.chunks || [], request.lang, requestId);
    result.multilingual = multilingual;
    result.meta.processedBy.push("Multilingual Processing");
    
    // Stage 7: Storage (fire-and-forget, does not block API response)
    runStorage(result, requestId).catch(err => {
        logger.error(`Failed to save results for request ${requestId}`, requestId, err);
    });
    result.meta.processedBy.push("Storage");

    logger.info(`Orchestration successful for request ${requestId}`, requestId);
    return result;
    
  } catch (err: any) {
    logger.error(`Orchestration failed for request ${requestId}`, requestId, err);
    result.errors?.push(err.message || "Unknown error in orchestration");
    return result;
  }
}