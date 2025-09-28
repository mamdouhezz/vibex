import { extractEntities } from './entityExtractor.ts';
import { extractRelationships } from './relationshipExtractor.ts';
import { graphManager } from './graphManager.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('KnowledgeGraphBuilder');

/**
 * Main orchestration function for the Knowledge Graph Builder module.
 * Takes raw text, processes it, and populates the graph.
 * @param text The text content to build the graph from.
 * @param language The language of the content.
 * @returns A summary of the build process.
 */
export const buildGraphFromText = async (text: string, language: 'en' | 'ar' = 'en') => {
    logger.info('Starting knowledge graph build process...');
    
    // 1. Extract entities
    const entities = await extractEntities(text, language);
    
    // 2. Extract relationships
    const relationships = await extractRelationships(text, entities);
    
    // 3. Populate the graph database (in-memory manager)
    entities.forEach(entity => graphManager.addEntity(entity));
    relationships.forEach(rel => graphManager.addRelationship(rel));
    
    const summary = {
        entitiesAdded: entities.length,
        relationshipsAdded: relationships.length,
    };

    logger.info(`Knowledge graph build complete. Summary: ${JSON.stringify(summary)}`);
    return summary;
};
