import { OrchestrationResult } from '../../types.ts';
import { Logger } from '../../services/logger.ts';
import { Firestore } from '@google-cloud/firestore';

const logger = new Logger('StorageEngine');
const firestore = new Firestore();
const COLLECTION_NAME = 'analysis_results';

/**
 * Storage Engine (Google Cloud Firestore)
 * Saves the final structured results to a Firestore collection.
 * @param result The final orchestration result object.
 * @param traceId Orchestrator trace ID for logging.
 * @returns A promise that resolves when saving is complete.
 * @throws An error if the Firestore write operation fails.
 */
export const runStorage = async (result: OrchestrationResult, traceId: string): Promise<void> => {
    const docId = result.meta.requestId;
    logger.info(`Saving results to Firestore collection '${COLLECTION_NAME}' with document ID '${docId}'...`, traceId);

    try {
        const docRef = firestore.collection(COLLECTION_NAME).doc(docId);
        await docRef.set(result);
        logger.info(`Results for job ${docId} saved to Firestore successfully.`, traceId);
    } catch (error) {
        logger.error(`Failed to save results to Firestore for job ${docId}.`, traceId, error);
        // Re-throw the error to let the orchestrator know storage failed.
        throw new Error(`Firestore storage failed: ${error.message}`);
    }
};
