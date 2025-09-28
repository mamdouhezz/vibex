import { Entity, Relationship } from './types.ts';
import { graphManager } from './graphManager.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('GraphAPI');

/**
 * Mock Graph API Service
 * This class simulates a REST/GraphQL API layer for interacting with the knowledge graph.
 * In a real backend, these methods would correspond to HTTP endpoints.
 */
class GraphAPIService {
    /**
     * Simulates POST /graph/entity
     * @param entityData The data for the new entity.
     * @returns The created entity.
     */
    async postEntity(entityData: Omit<Entity, 'id' | 'confidence'> & { confidence?: number }): Promise<Entity> {
        logger.info(`API call: postEntity with name ${entityData.name}`);
        // In a real API, you would hash here. Assuming ID is generated from name+type.
        const id = `hash-${entityData.name.toLowerCase()}-${entityData.type}`;
        const newEntity: Entity = {
            id,
            ...entityData,
            confidence: entityData.confidence || 1.0, // Default to 1.0 if manually added
        };
        graphManager.addEntity(newEntity);
        return newEntity;
    }
    
    /**
     * Simulates POST /graph/relationship
     * @param relData The data for the new relationship.
     * @returns The created relationship.
     */
    async postRelationship(relData: Omit<Relationship, 'id' | 'confidence' | 'timestamp'> & { confidence?: number }): Promise<Relationship> {
         logger.info(`API call: postRelationship from ${relData.sourceEntityId} to ${relData.targetEntityId}`);
         const id = `hash-${relData.sourceEntityId}-${relData.type}-${relData.targetEntityId}`;
         const newRelationship: Relationship = {
             id,
             ...relData,
             confidence: relData.confidence || 1.0,
             timestamp: new Date().toISOString(),
         };
         graphManager.addRelationship(newRelationship);
         return newRelationship;
    }

    /**
     * Simulates GET /graph/entity/:id
     * @param id The ID of the entity to fetch.
     * @returns The entity or null if not found.
     */
    async getEntity(id: string): Promise<Entity | null> {
         logger.info(`API call: getEntity with id ${id}`);
        return graphManager.getEntityById(id) || null;
    }

    /**
     * Simulates GET /graph/relationships/:entityId
     * @param entityId The ID of the entity.
     * @returns An array of relationships.
     */
    async getRelationships(entityId: string): Promise<Relationship[]> {
         logger.info(`API call: getRelationships for entity ${entityId}`);
        return graphManager.getRelationshipsByEntityId(entityId);
    }
    
    /**
     * Simulates GET /graph/path?source=A&target=B
     * @param source The source entity ID.
     * @param target The target entity ID.
     * @returns The shortest path or null.
     */
    async getPath(source: string, target: string) {
         logger.info(`API call: getPath from ${source} to ${target}`);
        return graphManager.findShortestPath(source, target);
    }
}

// Export a singleton instance of the service
export const graphAPI = new GraphAPIService();
