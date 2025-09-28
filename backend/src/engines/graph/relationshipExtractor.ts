import { Entity, Relationship } from '../../types.ts';
import { Logger } from '../../services/logger.ts';

const logger = new Logger('RelationshipExtractor');

const RELATIONSHIP_PATTERNS = [
    { type: 'co-founder_of', pattern: 'ENTITY_A is the co-founder of ENTITY_B' },
    { type: 'founder_of', pattern: 'ENTITY_A founded ENTITY_B' },
    { type: 'works_at', pattern: 'ENTITY_A works at ENTITY_B' },
    { type: 'located_in', pattern: 'ENTITY_A is located in ENTITY_B' },
];

const simpleHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  return `hash-${Math.abs(hash).toString(16)}`;
};

/**
 * Extracts semantic relationships between entities from a given text.
 */
export const extractRelationships = async (text: string, entities: Entity[], traceId: string): Promise<Relationship[]> => {
    logger.info('Starting relationship extraction...', traceId);
    const relationships = new Map<string, Relationship>();

    for (const entityA of entities) {
        for (const entityB of entities) {
            if (entityA.id === entityB.id) continue;
            for (const relPattern of RELATIONSHIP_PATTERNS) {
                const concretePattern = relPattern.pattern.replace('ENTITY_A', entityA.name).replace('ENTITY_B', entityB.name);
                if (text.includes(concretePattern)) {
                    const id = simpleHash(`${entityA.id}-${relPattern.type}-${entityB.id}`);
                    if (!relationships.has(id)) {
                         relationships.set(id, {
                            id,
                            sourceEntityId: entityA.id,
                            targetEntityId: entityB.id,
                            type: relPattern.type,
                            confidence: 0.85,
                            timestamp: new Date().toISOString(),
                            context: concretePattern,
                        });
                    }
                }
            }
        }
    }
    
    const rels = Array.from(relationships.values());
    logger.info(`Extraction complete. Found ${rels.length} relationships.`, traceId);
    return rels;
};