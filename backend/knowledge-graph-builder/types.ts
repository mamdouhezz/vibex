/**
 * VibeX Knowledge Graph - Type System
 * Defines the core data structures for entities and relationships
 * within the knowledge graph.
 */

/**
 * Represents a single node in the knowledge graph.
 */
export interface Entity {
  id: string; // A unique hash, e.g., SHA-256 of (name + type)
  name: string;
  type: "person" | "org" | "location" | "product" | "event" | "concept";
  language: "en" | "ar";
  confidence: number;
  metadata?: Record<string, any>; // For extra info like aliases, descriptions
}

/**
 * Represents a single edge (connection) between two nodes in the knowledge graph.
 */
export interface Relationship {
  id:string; // A unique hash, e.g., SHA-256 of (source + type + target)
  sourceEntityId: string;
  targetEntityId: string;
  type: string; // e.g., "works_at", "located_in", "co-founder_of"
  confidence: number;
  timestamp: string;
  context?: string; // The sentence or phrase from which the relationship was extracted
}

/**
 * Represents a path between two entities in the graph.
 */
export interface GraphPath {
    nodes: Entity[];
    edges: Relationship[];
    length: number;
}
