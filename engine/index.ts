import { OrchestrationResult } from '../types/index.ts';

/**
 * Triggers a backend analysis for a given URL via an API call.
 * This function communicates with the Node.js server's Core Orchestrator.
 * @param url The URL to analyze.
 * @returns A promise that resolves with the full OrchestrationResult.
 */
export const analyzeUrl = async (url: string): Promise<OrchestrationResult> => {
    console.log(`[Frontend] Sending analysis request to Core Orchestrator for: ${url}`);
    
    const API_ENDPOINT = "http://localhost:8080/api/orchestrate";
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30-second timeout

    try {
        const response = await fetch(API_ENDPOINT, {
            method: "POST",
            signal: controller.signal, // Add abort signal for timeout
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }), // The orchestrator expects an object with a 'url' key
        });

        clearTimeout(timeoutId); // Clear timeout if fetch succeeds

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: "Failed to parse error response" }));
            throw new Error(`API request failed with status ${response.status}: ${errorData.error || response.statusText}`);
        }

        const result: OrchestrationResult = await response.json();
        console.log("[Frontend] Orchestration complete. Result received:", result);
        
        if (result.errors && result.errors.length > 0) {
            console.error("[Frontend] Orchestration returned errors:", result.errors);
            throw new Error(result.errors.join(', '));
        }

        return result;

    } catch (error: any) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
             console.error("[Frontend] Fetch request timed out.", error);
             throw new Error("The analysis request timed out. The server might be busy. Please try again later.");
        }
        console.error("[Frontend] Could not connect to the backend server or an orchestration error occurred.", error);
        // Provide a more user-friendly error message
        throw new Error("Could not connect to the VibeX analysis engine. Please ensure the backend server is running and accessible.");
    }
};