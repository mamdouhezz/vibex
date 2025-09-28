/**
 * VibeX Backend Type System
 *
 * This file contains all shared TypeScript types and interfaces for the
 * backend orchestration pipeline.
 */

// --- Core Job & Context ---

/**
 * Represents a single analysis job request.
 * This is the initial object published to the queue.
 */
export interface Job {
    jobId: string;
    url: string;
    content: string; // Raw HTML content
    language?: 'en' | 'ar';
    priority: 'high' | 'medium' | 'low';
}

/**
 * Provides context that is passed through the entire orchestration pipeline.
 * Primarily used for logging and observability.
 */
export interface OrchestratorContext {
    traceId: string; // Same as jobId for traceability
}


// --- Preprocessing Module ---

/** Represents a single heading (h1, h2, etc.) extracted from the content. */
export interface Heading {
    level: number;
    text: string;
}

/** Output of the preprocessing module. */
export interface PreprocessingOutput {
    jobId: string;
    cleanText: string;
    metadata: {
        title: string;
        description: string;
        canonicalUrl?: string;
        headings: Heading[];
        lang: string;
    };
    wordCount: number;
    readabilityScore: number;
}


// --- Chunking Module ---

/** Input for the chunking module, which is the output of preprocessing. */
export type ChunkingInput = PreprocessingOutput;

/** Represents a single, semantically coherent block of text. */
export interface Chunk {
    id: string;
    jobId: string;
    content: string;
    headingContext: string[]; // e.g., ["Main Title", "Subheading"]
    position: number;
    tokenCount: number;
}

/** Output of the chunking module. */
export interface ChunkingOutput {
    jobId: string;
    chunks: Chunk[];
    totalChunks: number;
}


// --- Analysis Modules (Schema, Snippet, etc.) ---

/** Represents detected and missing schema.org types. */
export interface SchemaAnalysis {
    detected: string[];
    missing: string[];
}

/** Represents a generated, AI-ready snippet for a content chunk. */
export interface Snippet {
    heading: string;
    snippet: string;
    score: number;
}

/** Represents an actionable recommendation to improve content. */
export interface Recommendation {
    type: 'schema_fix' | 'content_fix' | 'trust_fix' | 'snippet_fix';
    priority: 'high' | 'medium' | 'low';
    target: string;
    message: string;
    suggested_code?: string;
    example_fix?: any;
}

/** Represents citation analysis results. */
export interface CitationAnalysis {
    citation_probability: number;
    platform_predictions: {
        [platform: string]: number;
    };
}


// --- Final Orchestration Result ---

/**
 * The final, aggregated result of the entire orchestration pipeline.
 * This is the object that will be saved to storage.
 */
export interface OrchestrationResult {
    jobId: string;
    url: string;
    analysis: {
        citation: CitationAnalysis;
        recommendations: Recommendation[];
        schema: SchemaAnalysis;
        snippets: Snippet[];
    };
    data: {
        title: string;
        description: string;
        lang: string;
        chunks: Chunk[];
    };
    metadata: {
        processedAt: string;
        pipelineVersion: string;
    };
}
