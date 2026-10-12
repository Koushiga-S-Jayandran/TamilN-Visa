import fs from 'fs';
import path from 'path';

const DISTRICTS_DIR = 'src/data/districts';
if (!fs.existsSync(DISTRICTS_DIR)) {
  fs.mkdirSync(DISTRICTS_DIR, { recursive: true });
}

// 1. Write types.ts
const typesContent = `/**
 * TAMIZN VISA - District & Place Schemas
 * Official 38-District Schema
 */

export type PlaceCategory =
  | 'Temples & Spiritual'
  | 'Heritage & Forts'
  | 'Beaches & Coastal'
  | 'Hills & Waterfalls'
  | 'Nature & Wildlife'
  | 'Hidden Gems'
  | 'Food & Culinary'
  | 'Culture & Crafts';

export interface Place {
  id: string;
  name: string;
  nameTamil: string;
  district: string;
  locality: string;
  category: PlaceCategory;
  latitude: number;
  longitude: number;
  description: string; // max 40 words
  visitingHours: string;
  entryFee: string;
  bestSeason: string;
  dressCode: string;
  recommendedDurationMins: number;
  accessibilityNotes: string;
  sourceName: string;
  sourceUrl: string;
  confidence: 'High' | 'Medium';
  lastVerified: string;
  imageUrl?: string;
}

export interface DistrictInfo {
  name: string;
  headquarters: string;
  region: 'Kongu Nadu' | 'Pandya Nadu' | 'Chola Nadu' | 'Thondai Nadu' | 'Chera / Southern';
  culturalTagline: string;
  popularFor: string;
  knownSpecialty: string;
  avgDailyBudgetINR: number;
  imageUrl?: string;
}
`;

fs.writeFileSync(path.join(DISTRICTS_DIR, 'types.ts'), typesContent, 'utf8');
console.log('Wrote types.ts');
