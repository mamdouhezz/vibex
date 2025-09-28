import { Entity } from './types.ts';
import { Logger } from '../services/logger.ts';

const logger = new Logger('EntityExtractor');

// Mock a simple dictionary for known entities to improve accuracy.
const KNOWN_ENTITIES: { [key: string]: Omit<Entity, 'id' | 'name' | 'language' | 'confidence'> } = {
    'sam hogan': { type: 'person' },
    'searchable': { type: 'org' },
    'london': { type: 'location' },
    'vibex': { type: 'product' },
    'chatgpt': { type: 'product' },
    'gemini': { type: 'product' },
};

// Mock hashing function
const simpleHash = (text: string): string => {
  // A simple, non-crypto hash for demonstration. In production, use SHA-256.
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `hash-${Math.abs(hash).toString(16)}`;
};


/**
 * Extracts named entities from a given text.
 * This is a simplified simulation of a Named Entity Recognition (NER) model.
 * @param text The input text to analyze.
 * @param language The language of the text.
 * @returns A promise resolving to an array of detected entities.
 */
export const extractEntities = async (text: string, language: 'en' | 'ar' = 'en'): Promise<Entity[]> => {
    logger.info('Starting entity extraction...');
    
    const detectedEntities = new Map<string, Entity>();
    
    // 1. Find known entities from our dictionary
    for (const name in KNOWN_ENTITIES) {
        const regex = new RegExp(`\\b${name}\\b`, 'gi');
        if (regex.test(text)) {
            const entityData = KNOWN_ENTITIES[name];
            const id = simpleHash(`${name.toLowerCase()}-${entityData.type}`);

            if (!detectedEntities.has(id)) {
                 detectedEntities.set(id, {
                    id,
                    name: name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), // Capitalize
                    type: entityData.type,
                    language,
                    confidence: 0.95, // High confidence for known entities
                });
            }
        }
    }

    // 2. A simple regex for capitalized words as potential concepts/orgs (for English)
    if (language === 'en') {
        const potentialEntities = text.match(/\b([A-Z][a-z]+(?:\s[A-Z][a-z]+)*)\b/g) || [];
        for (const name of potentialEntities) {
            const lowerName = name.toLowerCase();
            if (KNOWN_ENTITIES[lowerName] || ['Is', 'The', 'A', 'An'].includes(name)) continue;

            const id = simpleHash(`${lowerName}-concept`);
             if (!detectedEntities.has(id)) {
                detectedEntities.set(id, {
                    id,
                    name,
                    type: 'concept',
                    language,
                    confidence: 0.60, // Lower confidence for generic matches
                });
            }
        }
    }

    const entities = Array.from(detectedEntities.values());
    logger.info(`Extraction complete. Found ${entities.length} unique entities.`);
    return entities;
};
