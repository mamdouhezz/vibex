import express from "express";
import { orchestrate } from "../orchestrator/index.ts";
import { OrchestrationRequest } from "../types.ts";
import { logger } from '../services/logger.ts';

const router = express.Router();

router.post("/orchestrate", async (req, res) => {
  try {
    const { url, lang, options } = req.body;
    if (!url) {
        return res.status(400).json({ error: "URL is required in the request body." });
    }
    
    const request: OrchestrationRequest = { url, lang, options };
    logger.info(`API request received for /orchestrate with URL: ${url}`);
    
    const result = await orchestrate(request);
    
    if (result.errors.length > 0) {
        logger.warn(`Orchestration for ${url} completed with errors.`, undefined);
        return res.status(500).json(result);
    }
    
    res.json(result);

  } catch (err: any) {
    logger.error(`Unhandled exception in /orchestrate endpoint.`, undefined, err);
    res.status(500).json({ 
        errors: ["Orchestration failed due to an unexpected error.", err.message] 
    });
  }
});

export default router;