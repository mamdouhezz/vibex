
import { Heading } from '../../types.ts';

/**
 * VibeX Preprocessing Engine - Sanitize & Extract Utilities
 *
 * Contains functions for cleaning HTML and extracting structured data from it.
 * This simulates libraries like Cheerio.
 */

/** Extracts the <title> content from an HTML string. */
export const extractTitle = (html: string): string => (html.match(/<title>(.*?)<\/title>/i) || ['', ''])[1].trim();

/** Extracts the meta description content from an HTML string. */
export const extractMetaDescription = (html: string): string => (html.match(/<meta\s+name="description"\s+content="(.*?)"/i) || ['', ''])[1].trim();

/** Extracts the canonical URL from a <link> tag in an HTML string. */
export const extractCanonicalUrl = (html: string): string | undefined => (html.match(/<link\s+rel="canonical"\s+href="(.*?)"/i) || [])[1]?.trim();

/** Extracts heading elements (h1-h3) from an HTML string. */
export const extractHeadings = (html: string): Heading[] => {
    const matches = html.matchAll(/<(h[1-3])[^>]*>(.*?)<\/\1>/gi);
    return Array.from(matches, m => ({
        level: parseInt(m[1][1], 10),
        text: m[2].trim(),
    }));
};

/**
 * Removes unwanted tags (scripts, styles, etc.) and converts HTML to clean text.
 * It inserts special markers (---H1---) for headings to aid the chunking engine.
 * @param html The raw HTML string.
 * @returns A cleaned text string with heading markers.
 */
export const extractCleanText = (html: string): string => {
    return html
        // Remove scripts, styles, and other semantic noise elements
        .replace(/<(script|style|nav|footer|aside)[\s\S]*?<\/\1>/gi, '')
        // Convert headings to a special marker format
        .replace(/<h([1-6])[^>]*>(.*?)<\/h\1>/gi, '\n---H$1---\n$2\n')
        // Remove all remaining HTML tags
        .replace(/<[^>]+>/g, ' ')
        .trim();
};