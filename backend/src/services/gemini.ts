/**
 * VibeX Backend - Centralized Gemini AI Service
 *
 * This service initializes and provides a singleton instance of the GoogleGenAI client.
 * This ensures that the API key is fetched only once and the client is reused
 * across all modules, which is more efficient and follows best practices.
 */
import { GoogleGenAI } from "@google/genai";
import { getGeminiApiKey } from './secrets.ts';
import { logger } from './logger.ts';

let aiClient: GoogleGenAI | null = null;

/**
 * Initializes the singleton GoogleGenAI client by fetching the API key
 * from Secret Manager. This function should be called once at server startup.
 * @throws An error if initialization fails.
 */
export const initializeGenAI = async (): Promise<void> => {
    if (aiClient) {
        logger.warn('Gemini AI client is already initialized.');
        return;
    }
    
    try {
        logger.info('Initializing GoogleGenAI client...');
        const apiKey = await getGeminiApiKey();
        aiClient = new GoogleGenAI({ apiKey });
        logger.info('GoogleGenAI client initialized successfully.');
    } catch (error) {
        logger.error('Failed to initialize GoogleGenAI client.', undefined, error);
        throw error; // Re-throw to prevent the server from starting in a bad state.
    }
};

/**
 * Provides access to the initialized GoogleGenAI client instance.
 * @returns The singleton GoogleGenAI client.
 * @throws An error if the client has not been initialized yet.
 */
export const getGenAIClient = (): GoogleGenAI => {
    if (!aiClient) {
        throw new Error('GoogleGenAI client has not been initialized. Call initializeGenAI() on startup.');
    }
    return aiClient;
};
