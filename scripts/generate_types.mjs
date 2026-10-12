import fs from 'fs';
import path from 'path';

const DISTRICTS_DIR = 'src/data/districts';
if (!fs.existsSync(DISTRICTS_DIR)) {
  fs.mkdirSync(DISTRICTS_DIR, { recursive: true });
}

// Write types.ts
fs.writeFileSync(
  path.join(DISTRICTS_DIR, 'types.ts'),
  `/**
 * TAMIZN VISA - Place & District Type Definitions
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
  description: string;
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
`,
  'utf8'
);

console.log('types.ts created.');
