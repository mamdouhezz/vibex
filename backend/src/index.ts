/**
 * VibeX Backend - Main Entry Point & API Server
 *
 * This file initializes an Express server to expose the analysis engine via a REST API.
 * To run: `npx ts-node backend/src/index.ts`.
 */

// FIX: Simplified the express import to resolve a 'No overload matches this call' type error.
// The named type imports were not used in this file and were likely causing the type resolution to fail for app.use().
import express from 'express';
import cors from 'cors';
import apiRoutes from './api/routes.ts';
import { logger } from './services/logger.ts';
import { initializeGenAI } from './services/gemini.ts';

const app = express();
const PORT = 8080;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api', apiRoutes);

/**
 * Main function to bootstrap the server.
 * It initializes necessary cloud services before starting the Express server.
 */
const startServer = async () => {
  try {
    // 1. Initialize Google Cloud services (e.g., fetch API key from Secret Manager)
    await initializeGenAI();

    // 2. Start the Express server
    app.listen(PORT, () => {
      logger.info(`✅ VibeX Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start VibeX Backend server.', undefined, error);
    process.exit(1); // Exit if initialization fails
  }
};

// Start the server
startServer();