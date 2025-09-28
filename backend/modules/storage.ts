import { OrchestrationResult, OrchestratorContext } from '../types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('StorageModule');

/**
 * Storage Layer (Mock)
 * Simulates saving the final structured results to a database (Postgres)
 * and a search index (ElasticSearch).
 * @param result The final orchestration result object.
 * @param context Orchestrator context with traceId for logging.
 * @returns A promise that resolves when saving is complete.
 */
export const saveResults = async (result: OrchestrationResult, context: OrchestratorContext): Promise<void> => {
    logger.info(`Starting to save results to DB and ElasticSearch for job ${result.jobId}...`, context.traceId);

    // Simulate async database and search index writes
    await Promise.all([
        new Promise(resolve => setTimeout(resolve, 150)), // Simulate Postgres write
        new Promise(resolve => setTimeout(resolve, 200)), // Simulate ElasticSearch write
    ]);

    logger.info(`Results for job ${result.jobId} saved successfully.`, context.traceId);
};
