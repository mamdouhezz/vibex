/**
 * VibeX Backend Mock Queue Service
 *
 * Simulates a message queue like Kafka or RabbitMQ for job processing.
 * This is for demonstration purposes and would be replaced by a real
 * queue client (e.g., kafkajs, amqplib) in a production environment.
 */
import { Job } from '../types.ts';
import { logger } from './logger.ts';

const jobQueue: Job[] = [];
const failedJobQueue: { job: Job, error: string }[] = [];

const MAX_CONCURRENT_JOBS = 5;
let activeJobs = 0;
let jobProcessor: (job: Job) => Promise<any>;

/**
 * Injects the job processing function to be used by the queue consumer.
 * This avoids a circular dependency between the queue and the orchestrator.
 * @param processor The function that will process a job.
 */
export const setJobProcessor = (processor: (job: Job) => Promise<any>) => {
    jobProcessor = processor;
};

/**
 * Publishes a job to the main 'content.jobs' processing queue.
 * @param job The job to be processed.
 */
export const publishJob = async (job: Job) => {
    logger.info(`Job ${job.jobId} published to queue 'content.jobs'`, job.jobId);
    jobQueue.push(job);
    processNextJob(); // Attempt to process immediately if a worker is free.
};

/**
 * Publishes a job to the 'failed.jobs' queue for manual review.
 * @param job The job that failed after all retries.
 * @param error The reason for failure.
 */
export const publishToFailedQueue = async (job: Job, error: string) => {
    logger.error(`Job ${job.jobId} moved to 'failed.jobs' queue. Reason: ${error}`, job.jobId);
    failedJobQueue.push({ job, error });
};

/**
 * Simulates a worker consuming jobs from the queue, respecting concurrency limits.
 */
const processNextJob = () => {
    if (activeJobs >= MAX_CONCURRENT_JOBS || jobQueue.length === 0) {
        return; // All workers are busy or queue is empty.
    }
    
    if (!jobProcessor) {
        logger.error('Job processor has not been set. Cannot process jobs.');
        return;
    }

    activeJobs++;
    const job = jobQueue.shift(); // Dequeue the next job
    
    if (job) {
        logger.info(`Worker picked up job ${job.jobId}. Active jobs: ${activeJobs}`, job.jobId);
        
        // Asynchronously process the job.
        jobProcessor(job)
            .catch(err => {
                // If the processor throws an error, move the job to the failed queue.
                logger.error(`Job ${job.jobId} processing failed. Moving to failed queue.`, job.jobId, err);
                publishToFailedQueue(job, err.message || 'Unknown job processor error');
            })
            .finally(() => {
                activeJobs--;
                logger.info(`Worker finished with job ${job.jobId}. Active jobs: ${activeJobs}`, job.jobId);
                processNextJob(); // A worker is free, attempt to pick up the next job.
            });
    }
};

/**
 * Starts the mock queue consumer, simulating multiple workers listening for jobs.
 */
export const startQueueConsumer = () => {
    logger.info(`Queue consumer started with ${MAX_CONCURRENT_JOBS} concurrent workers.`);
    // In a real system, this would be a long-polling listener.
    // Here, we'll kick off processing to simulate multiple workers becoming available.
    for (let i = 0; i < MAX_CONCURRENT_JOBS; i++) {
        processNextJob();
    }
};
