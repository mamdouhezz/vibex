/**
 * VibeX Backend - Main Entry Point
 *
 * This file initializes the backend services and starts the job queue consumer.
 * It also includes a demo function to simulate job creation, which triggers
 * the entire orchestration pipeline. To run this, you would use a TypeScript
 * runner like `ts-node backend/index.ts`.
 */
import { Job } from './types.ts';
import { logger } from './services/logger.ts';
import { publishJob, startQueueConsumer, setJobProcessor } from './services/queue.ts';
import { startJobProcessing } from './orchestrator.ts';

/**
 * Mock UUID generation to avoid adding external dependencies.
 * @returns A pseudo-random UUID string.
 */
const mockUuid = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

/**
 * Simulates the creation of a new analysis job from an external source (e.g., API endpoint).
 */
function createDemoJob(url: string, lang: 'en' | 'ar') {
    const demoJob: Job = {
        jobId: mockUuid(),
        url,
        content: `<html><head><title>Test Page</title></head><body><h1>Welcome to VibeX</h1><p>This is a test page for ${url} in ${lang}.</p></body></html>`,
        language: lang,
        priority: 'high',
    };

    logger.info(`Creating and publishing demo job ${demoJob.jobId} for URL: ${demoJob.url}`);
    publishJob(demoJob);
}

/**
 * Main function to bootstrap the backend services.
 */
function main() {
    logger.info('VibeX Backend Core Orchestrator is starting...');
    
    // 1. Inject the job processor into the queue service to break circular dependencies.
    setJobProcessor(startJobProcessing);
    
    // 2. Start the queue consumer to listen for and process jobs.
    startQueueConsumer();
    
    // 3. Simulate a few jobs being created and published to the queue with a slight delay.
    setTimeout(() => createDemoJob('https://vibex.ai/blog/what-is-aeo', 'en'), 500);
    setTimeout(() => createDemoJob('https://vibex.ai/ar/blog/geo-guide', 'ar'), 1000);
    setTimeout(() => createDemoJob('https://vibex.ai/features', 'en'), 1500);

    logger.info('Initialization complete. Orchestrator is now live and processing jobs...');
}

// Run the main bootstrapping function.
main();