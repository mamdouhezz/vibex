import { Chunk, ChunkingOptions } from "../types.ts";

/**
 * Splits input text into chunks based on a fixed number of tokens (words).
 * Supports overlapping chunks to maintain context between them.
 * @param input The text to be chunked.
 * @param options Configuration for chunking, including maxChunkSize (in tokens) and overlap.
 * @returns An array of structured Chunk objects.
 */
export function chunkByTokens(input: string, options: ChunkingOptions): Chunk[] {
  // Simple whitespace tokenizer. A real implementation would use a library like tiktoken.
  const tokens = input.split(/\s+/);
  const chunkSize = options.maxChunkSize || 100;
  const overlap = options.overlap || 0;

  if (overlap >= chunkSize) {
      throw new Error("Overlap cannot be greater than or equal to chunk size.");
  }

  const chunks: Chunk[] = [];
  let chunkIndex = 0;

  for (let i = 0; i < tokens.length; i += (chunkSize - overlap)) {
    const chunkTokens = tokens.slice(i, i + chunkSize);
    if (chunkTokens.length === 0) continue;

    const content = chunkTokens.join(" ");
    
    // In a real tokenizer, offsets would be character-based, not token-index based.
    // This is a simplified representation.
    const startOffset = input.indexOf(content);
    const endOffset = startOffset + content.length;

    chunks.push({
      id: `chunk_token_${chunkIndex}`,
      content,
      meta: {
        index: chunkIndex,
        startOffset: startOffset, // Approximate
        endOffset: endOffset,     // Approximate
        wordCount: chunkTokens.length,
        tokenCount: chunkTokens.length, // Using word count as a proxy for token count
      },
    });
    chunkIndex++;
  }

  return chunks;
}
