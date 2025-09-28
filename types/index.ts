/**
 * VibeX Type System - Single Source of Truth (SSOT)
 *
 * All shared TypeScript types, interfaces, and enums for the entire application
 * must be defined and exported from this file. This ensures consistency,
 * prevents duplication, and adheres to the unidirectional dependency architecture.
 *
 * @see /System & Coding Rules/type-system.rules.json
 */

import { IconType } from "react-icons";

/**
 * Represents the current theme of the application.
 */
export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Represents the supported languages for internationalization.
 */
export type Language = 'en' | 'ar';

/**
 * Defines the structure for a sub-page in the navigation.
 */
export interface SubNavigationItem {
    id: string;
    // label will be fetched from dashboardContent
}

/**
 * Defines the structure for a main navigation item in the sidebar.
 */
export interface NavigationItem {
    id: string;
    icon: IconType;
    subPages: SubNavigationItem[];
}


// --- VibeX Backend Types (for Frontend consumption) ---
// These types define the structure of the data received from the backend API.

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

/** Represents a single, semantically coherent block of text. */
export interface Chunk {
    id: string;
    jobId: string;
    content: string;
    headingContext: string[]; // e.g., ["Main Title", "Subheading"]
    position: number;
    tokenCount: number;
}

/** Represents detected and missing schema.org types. */
export interface SchemaAnalysis {
    detected: string[];
    missing: string[];
}

/** Output of the preprocessing engine. */
export interface PreprocessingOutput {
    jobId: string;
    cleanText: string;
    metadata: {
        title: string;
        description: string;
        canonicalUrl?: string;
        headings: { level: number; text: string; }[];
        lang: string;
    };
    wordCount: number;
    readabilityScore: number;
}

/**
 * The final, unified result from the entire orchestration pipeline.
 * This is the object received from the `/orchestrate` API endpoint.
 */
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
  graph?: any;
  multilingual?: any;
  errors: string[];
}