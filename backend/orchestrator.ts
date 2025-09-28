/**
 * VibeX Backend - Core Orchestrator
 *
 * This file contains the central logic for the AEO/GEO analysis pipeline.
 * It coordinates the execution of various modules, from preprocessing to storage,
 * managing the flow of data and handling errors.
 */
import { Job, OrchestratorContext, OrchestrationResult } from './types.ts';
import { Logger } from './services/logger.ts';
import * as modules from './modules/index.ts';

const logger = new Logger('Orchestrator');
const PIPELINE_VERSION = '1.0.0';

/**
 * Main function to process a single job through the entire pipeline.
 * This is the entry point called by the queue consumer.
 * @param job The job to be processed.
 * @returns A promise resolving to the OrchestrationResult. Throws an error on failure.
 */
export const startJobProcessing = async (job: Job): Promise<OrchestrationResult> => {
    const context: OrchestratorContext = { traceId: job.jobId };
    logger.info(`Starting AEO/GEO analysis pipeline for URL: ${job.url}`, context.traceId);

    try {
        // --- Pipeline Step 1: Preprocessing ---
        const preprocessingOutput = await modules.preprocess.cleanContent(job, context);

        // --- Pipeline Step 2: Chunking ---
        const chunkingOutput = await modules.chunking.splitContent(preprocessingOutput, context);

        // --- Pipeline Step 3: Parallel Analysis ---
        // Run AI-powered analyses in parallel to save time.
        const [schemaAnalysis, snippetAnalysis, citationAnalysis] = await Promise.all([
            modules.schema.analyzeSchema(preprocessingOutput, context),
            modules.snippet.generateSnippets(chunkingOutput, context),
            modules.citation.analyzeCitation({ preprocessing: preprocessingOutput, chunking: chunkingOutput }, context),
        ]);

        // --- Pipeline Step 4: Recommendation Engine ---
        // This step depends on the results of the parallel analyses.
        const recommendations = await modules.recommendation.generateRecommendations({
            preprocessing: preprocessingOutput,
            chunking: chunkingOutput,
            schema: schemaAnalysis,
            snippets: snippetAnalysis,
        }, context);

        // --- Pipeline Step 5: Assemble Final Result ---
        const finalResult: OrchestrationResult = {
            jobId: job.jobId,
            url: job.url,
            analysis: {
                citation: citationAnalysis,
                recommendations: recommendations,
                schema: schemaAnalysis,
                snippets: snippetAnalysis,
            },
            data: {
                title: preprocessingOutput.metadata.title,
                description: preprocessingOutput.metadata.description,
                lang: preprocessingOutput.metadata.lang,
                chunks: chunkingOutput.chunks,
            },
            metadata: {
                processedAt: new Date().toISOString(),
                pipelineVersion: PIPELINE_VERSION,
            },
        };

        // --- Pipeline Step 6: Storage ---
        await modules.storage.saveResults(finalResult, context);

        logger.info(`Pipeline completed successfully for job ${job.jobId}`, context.traceId);
        return finalResult;

    } catch (error: any) {
        logger.error(`Critical failure in pipeline for job ${job.jobId}. Re-throwing error.`, context.traceId, error);
        // Re-throw the error so the caller (e.g., the queue consumer) can handle it.
        throw error;
    }
};
