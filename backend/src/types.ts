/**
 * VibeX Backend Shared Type System - Single Source of Truth (SSOT)
 *
 * This file contains all shared TypeScript types and interfaces used across
 * the backend engines and orchestrator.
 */

// --- Core Engine Types ---

/** Represents a single heading (h1, h2, etc.) extracted from the content. */
export interface Heading {
    level: number;
    text: string;
}

/** Output of the preprocessing engine. */
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


// --- Knowledge Graph Types ---

/** Represents a single node in the knowledge graph. */
export interface Entity {
  id: string;
  name: string;
  type: "person" | "org" | "location" | "product" | "event" | "concept";
  language: "en" | "ar";
  confidence: number;
  metadata?: Record<string, any>;
}

/** Represents a single edge (connection) between two nodes in the knowledge graph. */
export interface Relationship {
  id:string;
  sourceEntityId: string;
  targetEntityId: string;
  type: string;
  confidence: number;
  timestamp: string;
  context?: string;
}


// --- Orchestrator & API Types ---

/** Defines the structure for an incoming analysis request to the API. */
export interface OrchestrationRequest {
  url: string;
  lang?: string;
  options?: Record<string, any>;
}

/** Defines the final, unified result object returned by the orchestrator API. */
export interface OrchestrationResult {
  meta: {
    requestId: string;
    timestamp: string;
    processedBy: string[];
  };
  preprocessed?: PreprocessingOutput;
  chunks?: Chunk[];
  schemas?: SchemaAnalysis;
  snippets?: Snippet[];
  recommendations?: Recommendation[];
  citation?: CitationAnalysis;
  graph?: {
      entitiesAdded: number;
      relationshipsAdded: number;
  };
  multilingual?: any;
  errors: string[];
}