import { Entity, Relationship, GraphPath } from './types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('GraphManager');

/**
 * In-memory graph database simulation.
 * Manages nodes (entities) and edges (relationships).
 * In a production environment, this would be a client for Neo4j, TigerGraph, or Neptune.
 */
class GraphManager {
    private entities = new Map<string, Entity>();
    private relationships: Relationship[] = [];
    // Adjacency list for efficient pathfinding
    private adj = new Map<string, string[]>();

    /**
     * Adds an entity to the graph. If an entity with the same ID already exists,
     * it will be updated.
     * @param entity The entity to add or update.
     */
    addEntity(entity: Entity): void {
        this.entities.set(entity.id, entity);
        if (!this.adj.has(entity.id)) {
            this.adj.set(entity.id, []);
        }
        logger.info(`Added/Updated entity: ${entity.name} (${entity.id})`);
    }

    /**
     * Adds a relationship to the graph.
     * @param relationship The relationship to add.
     */
    addRelationship(relationship: Relationship): void {
        // Ensure both entities exist before adding a relationship
        if (this.entities.has(relationship.sourceEntityId) && this.entities.has(relationship.targetEntityId)) {
            this.relationships.push(relationship);
            // Update adjacency list for pathfinding
            this.adj.get(relationship.sourceEntityId)?.push(relationship.targetEntityId);
            logger.info(`Added relationship: ${relationship.sourceEntityId} -> ${relationship.targetEntityId}`);
        } else {
            logger.warn(`Could not add relationship. Source or target entity not found.`);
        }
    }

    /**
     * Retrieves an entity by its unique ID.
     * @param id The ID of the entity.
     * @returns The entity object or undefined if not found.
     */
    getEntityById(id: string): Entity | undefined {
        return this.entities.get(id);
    }
    
    /**
     * Retrieves all relationships connected to a given entity.
     * @param entityId The ID of the entity.
     * @returns An array of relationships.
     */
    getRelationshipsByEntityId(entityId: string): Relationship[] {
        return this.relationships.filter(
            r => r.sourceEntityId === entityId || r.targetEntityId === entityId
        );
    }

    /**
     * Finds the shortest path between two entities using Breadth-First Search (BFS).
     * @param sourceEntityId The starting entity ID.
     * @param targetEntityId The target entity ID.
     * @returns A GraphPath object or null if no path is found.
     */
    findShortestPath(sourceEntityId: string, targetEntityId: string): GraphPath | null {
        if (!this.adj.has(sourceEntityId) || !this.adj.has(targetEntityId)) {
            return null;
        }

        const queue: string[][] = [[sourceEntityId]];
        const visited = new Set<string>([sourceEntityId]);

        while (queue.length > 0) {
            const path = queue.shift()!;
            const lastNode = path[path.length - 1];

            if (lastNode === targetEntityId) {
                // Path found, reconstruct it with full entity and relationship objects
                const pathNodes: Entity[] = [];
                const pathEdges: Relationship[] = [];
                for(let i = 0; i < path.length; i++) {
                    pathNodes.push(this.getEntityById(path[i])!);
                    if (i > 0) {
                        const edge = this.relationships.find(
                            r => r.sourceEntityId === path[i-1] && r.targetEntityId === path[i]
                        );
                        if (edge) pathEdges.push(edge);
                    }
                }
                return { nodes: pathNodes, edges: pathEdges, length: path.length - 1 };
            }

            const neighbors = this.adj.get(lastNode) || [];
            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    const newPath = [...path, neighbor];
                    queue.push(newPath);
                }
            }
        }
        return null; // No path found
    }
    
    /** Clears the entire graph. */
    clear(): void {
        this.entities.clear();
        this.relationships = [];
        this.adj.clear();
        logger.info('Graph cleared.');
    }
}

// Export a singleton instance to be used across the application
export const graphManager = new GraphManager();
