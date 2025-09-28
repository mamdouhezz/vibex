import { extractEntities } from './entityExtractor.ts';
import { extractRelationships } from './relationshipExtractor.ts';
import { graphManager } from './graphManager.ts';
import { Logger } from '../../services/logger.ts';

const logger = new Logger('KnowledgeGraphEngine');

/**
 * Knowledge Graph Builder Engine
 * Takes raw text, processes it, and populates the in-memory graph.
 * @param text The text content to build the graph from.
 * @param traceId The request trace ID for logging.
 * @returns A summary of the graph build process.
 */
export const runGraphBuilder = async (text: string, traceId: string) => {
    logger.info('Starting knowledge graph build process...', traceId);
    
    // In a real app, you might clear the graph based on session, but for this demo we accumulate.
    // graphManager.clear(); 
    
    const entities = await extractEntities(text, traceId);
    const relationships = await extractRelationships(text, entities, traceId);
    
    entities.forEach(entity => graphManager.addEntity(entity));
    relationships.forEach(rel => graphManager.addRelationship(rel));
    
    const summary = {
        entitiesAdded: entities.length,
        relationshipsAdded: relationships.length,
    };

    logger.info(`Knowledge graph build complete. Summary: ${JSON.stringify(summary)}`, traceId);
    return summary;
};