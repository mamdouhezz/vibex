import { Chunk, ChunkingOptions } from "../types.ts";

/**
 * Splits input text into chunks based on sentences.
 * It groups sentences together until a max chunk size is reached.
 * @param input The text to be chunked.
 * @param options Configuration for chunking, including maxChunkSize.
 * @returns An array of structured Chunk objects.
 */
export function chunkBySentence(input: string, options: ChunkingOptions): Chunk[] {
  // Regex to split by sentence-ending punctuation, keeping the delimiter.
  const sentences = input.split(/(?<=[.!?])\s+/);
  const chunks: Chunk[] = [];
  let buffer: string[] = [];
  let chunkIndex = 0;
  let currentOffset = 0;

  for (const sentence of sentences) {
    const currentBufferLength = buffer.join(" ").length;
    // If adding the new sentence exceeds the max size, finalize the current chunk.
    if (buffer.length > 0 && (currentBufferLength + sentence.length) > (options.maxChunkSize || 500)) {
      const content = buffer.join(" ").trim();
      chunks.push({
        id: `chunk_sent_${chunkIndex}`,
        content,
        meta: {
          index: chunkIndex,
          startOffset: currentOffset,
          endOffset: currentOffset + content.length,
          wordCount: content.split(/\s+/).length,
        },
      });
      currentOffset += content.length + 1; // +1 for the space
      buffer = [];
      chunkIndex++;
    }
    buffer.push(sentence);
  }

  // Add any remaining sentences in the buffer as the last chunk.
  if (buffer.length > 0) {
    const content = buffer.join(" ").trim();
    chunks.push({
      id: `chunk_sent_${chunkIndex}`,
      content,
      meta: {
        index: chunkIndex,
        startOffset: currentOffset,
        endOffset: currentOffset + content.length,
        wordCount: content.split(/\s+/).length,
      },
    });
  }

  return chunks;
}
