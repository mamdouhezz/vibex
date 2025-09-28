/**
 * VibeX Backend - Google Secret Manager Service
 *
 * This service provides a secure way to access secrets, like API keys,
 * from Google Cloud Secret Manager. It includes in-memory caching to reduce
 * latency and cost.
 */
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { logger } from './logger.ts';

// Cache the secret in memory to avoid fetching it on every request.
let cachedApiKey: string | null = null;

const client = new SecretManagerServiceClient();

/**
 * Fetches the Gemini API key from Google Cloud Secret Manager.
 * It uses environment variables to configure the secret's location.
 * @returns A promise that resolves to the API key string.
 * @throws An error if the required environment variables are not set or if the secret cannot be accessed.
 */
export const getGeminiApiKey = async (): Promise<string> => {
    if (cachedApiKey) {
        logger.info('Returning cached Gemini API key from memory.');
        return cachedApiKey;
    }

    const projectId = process.env.GCP_PROJECT_ID;
    const secretName = process.env.GEMINI_API_KEY_SECRET_NAME;

    if (!projectId || !secretName) {
        const errorMsg = 'GCP_PROJECT_ID and GEMINI_API_KEY_SECRET_NAME environment variables must be set.';
        logger.error(errorMsg);
        throw new Error(errorMsg);
    }

    const secretPath = `projects/${projectId}/secrets/${secretName}/versions/latest`;

    logger.info(`Fetching Gemini API key from Secret Manager: ${secretPath}`);

    try {
        const [version] = await client.accessSecretVersion({
            name: secretPath,
        });

        const apiKey = version.payload?.data?.toString();
        if (!apiKey) {
            throw new Error('Secret payload is empty or invalid.');
        }

        cachedApiKey = apiKey;
        logger.info('Successfully fetched and cached Gemini API key.');
        return apiKey;

    } catch (error) {
        logger.error('Failed to access secret from Google Cloud Secret Manager.', undefined, error);
        throw new Error('Could not retrieve Gemini API key from Secret Manager. Check permissions and configuration.');
    }
};
