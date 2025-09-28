/**
 * VibeX Chunking Engine - Type System
 *
 * Defines types specific to the new, strategy-based chunking engine.
 */

export type ChunkingStrategy = "sentence" | "paragraph" | "token";

export interface ChunkingOptions {
  strategy: ChunkingStrategy;
  maxChunkSize?: number;  // in characters or tokens
  overlap?: number;       // number of tokens/sentences to overlap
}

export interface Chunk {
  id: string;
  content: string;
  meta: {
    index: number;
    startOffset: number;
    endOffset: number;
    wordCount: number;
    tokenCount?: number;
  };
}
