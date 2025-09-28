
/**
 * VibeX Preprocessing Engine - Type System
 *
 * Defines types specific to the preprocessing engine.
 */

/** Represents a single heading (h1, h2, etc.) extracted from the content. */
export interface Heading {
    level: number;
    text: string;
}
