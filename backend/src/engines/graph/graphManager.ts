import { Entity, Relationship } from '../../types.ts';
import { Logger } from '../../services/logger.ts';

const logger = new Logger('GraphManager');

/**
 * In-memory graph database simulation.
 * Manages nodes (entities) and edges (relationships).
 */
class GraphManager {
    private entities = new Map<string, Entity>();
    private relationships = new Map<string, Relationship>();

    addEntity(entity: Entity): void {
        this.entities.set(entity.id, entity);
    }

    addRelationship(relationship: Relationship): void {
        if (this.entities.has(relationship.sourceEntityId) && this.entities.has(relationship.targetEntityId)) {
            this.relationships.set(relationship.id, relationship);
        } else {
            logger.warn(`Could not add relationship. Source or target entity not found.`);
        }
    }
    
    clear(): void {
        this.entities.clear();
        this.relationships.clear();
        logger.info('Graph cleared.');
    }
}

// Export a singleton instance to be used across the application
export const graphManager = new GraphManager();