import { Entity, Relationship } from './types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('RelationshipExtractor');

// Define patterns to detect relationships between two entities.
// The placeholders ENTITY_A and ENTITY_B will be replaced with actual entity names.
const RELATIONSHIP_PATTERNS = [
    { type: 'co-founder_of', pattern: 'ENTITY_A is the co-founder of ENTITY_B' },
    { type: 'founder_of', pattern: 'ENTITY_A founded ENTITY_B' },
    { type: 'works_at', pattern: 'ENTITY_A works at ENTITY_B' },
    { type: 'located_in', pattern: 'ENTITY_A, based in ENTITY_B' },
    { type: 'located_in', pattern: 'ENTITY_A is located in ENTITY_B' },
    { type: 'produces', pattern: 'ENTITY_A produces ENTITY_B' },
    { type: 'related_to', pattern: 'ENTITY_A is related to ENTITY_B' },
];

// Mock hashing function
const simpleHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash-${Math.abs(hash).toString(16)}`;
};


/**
 * Extracts semantic relationships between entities from a given text.
 * This is a simplified simulation of a relationship extraction model.
 * @param text The input text to analyze.
 * @param entities An array of entities previously extracted from the text.
 * @returns A promise resolving to an array of detected relationships.
 */
export const extractRelationships = async (text: string, entities: Entity[]): Promise<Relationship[]> => {
    logger.info('Starting relationship extraction...');
    const relationships = new Map<string, Relationship>();

    // This is a naive O(n^2) approach. A real system would use more advanced NLP techniques.
    for (const entityA of entities) {
        for (const entityB of entities) {
            if (entityA.id === entityB.id) continue;

            for (const relPattern of RELATIONSHIP_PATTERNS) {
                // Create a specific pattern instance for the entity pair
                const concretePattern = relPattern.pattern
                    .replace('ENTITY_A', entityA.name)
                    .replace('ENTITY_B', entityB.name);
                
                if (text.includes(concretePattern)) {
                    const id = simpleHash(`${entityA.id}-${relPattern.type}-${entityB.id}`);
                    if (!relationships.has(id)) {
                         relationships.set(id, {
                            id,
                            sourceEntityId: entityA.id,
                            targetEntityId: entityB.id,
                            type: relPattern.type,
                            confidence: 0.85, // Confidence based on pattern match
                            timestamp: new Date().toISOString(),
                            context: concretePattern,
                        });
                    }
                }
            }
        }
    }
    
    const rels = Array.from(relationships.values());
    logger.info(`Extraction complete. Found ${rels.length} relationships.`);
    return rels;
};
