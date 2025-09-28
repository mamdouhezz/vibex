import { Chunk } from "../types.ts";

/**
 * Splits input text into chunks based on paragraphs (delimited by double newlines).
 * @param input The text to be chunked.
 * @returns An array of structured Chunk objects, one for each paragraph.
 */
export function chunkByParagraph(input: string): Chunk[] {
  // Split by one or more newline characters, which typically separate paragraphs.
  const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0);
  
  let currentOffset = 0;

  return paragraphs.map((p, idx) => {
    const content = p.trim();
    const startOffset = input.indexOf(content, currentOffset);
    const endOffset = startOffset + content.length;
    currentOffset = endOffset;

    return {
      id: `chunk_para_${idx}`,
      content,
      meta: {
        index: idx,
        startOffset,
        endOffset,
        wordCount: content.split(/\s+/).length,
      },
    };
  });
}
