import { Entity } from '../../types.ts';
import { Logger } from '../../services/logger.ts';

const logger = new Logger('EntityExtractor');

const KNOWN_ENTITIES: { [key: string]: Omit<Entity, 'id' | 'name' | 'language' | 'confidence'> } = {
    'sam hogan': { type: 'person' },
    'searchable': { type: 'org' },
    'london': { type: 'location' },
    'vibex': { type: 'product' },
    'chatgpt': { type: 'product' },
    'gemini': { type: 'product' },
};

const simpleHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  return `hash-${Math.abs(hash).toString(16)}`;
};


/**
 * Extracts named entities from a given text.
 * This is a simplified simulation of a Named Entity Recognition (NER) model.
 */
export const extractEntities = async (text: string, traceId: string, language: 'en' | 'ar' = 'en'): Promise<Entity[]> => {
    logger.info('Starting entity extraction...', traceId);
    
    const detectedEntities = new Map<string, Entity>();
    
    for (const name in KNOWN_ENTITIES) {
        const regex = new RegExp(`\\b${name}\\b`, 'gi');
        if (regex.test(text)) {
            const entityData = KNOWN_ENTITIES[name];
            const id = simpleHash(`${name.toLowerCase()}-${entityData.type}`);

            if (!detectedEntities.has(id)) {
                 detectedEntities.set(id, {
                    id,
                    name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
                    type: entityData.type,
                    language,
                    confidence: 0.95,
                });
            }
        }
    }
    
    const entities = Array.from(detectedEntities.values());
    logger.info(`Extraction complete. Found ${entities.length} unique entities.`, traceId);
    return entities;
};