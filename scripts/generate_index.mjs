import fs from 'fs';
import path from 'path';

const files = fs
  .readdirSync('src/data/districts')
  .filter((f) => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts')
  .sort();

const imports = [];
const exportsList = [];
const allPlacesItems = [];
const loaders = [];

files.forEach((f) => {
  const base = f.replace('.ts', '');
  const varName = base.replace(/-([a-z])/g, (g) => g[1].toUpperCase()) + 'Places';
  imports.push(`import ${varName} from './${base}';`);
  exportsList.push(`  ${varName},`);
  allPlacesItems.push(`  ...${varName},`);
  // Capitalized district key for loader
  const distName = base.charAt(0).toUpperCase() + base.slice(1);
  loaders.push(`  '${distName}': () => import('./${base}').then(m => m.default || m.${varName}),`);
});

// Also keep TN_DISTRICTS_DATA so any existing imports from '../data/districts' or './data/districts' work 100%
const indexContent = `/**
 * TAMIZN VISA - Complete 38 District Repository
 * Exports all 38 districts, unified place array, and lazy dynamic loaders.
 */

export * from './types';
import { Place } from './types';
import { DistrictInfo, TN_DISTRICTS_DATA } from '../districts_info';

// Synchronous imports of all 38 district datasets
${imports.join('\n')}

// Export individual district datasets
export {
${exportsList.join('\n')}
};

// All places aggregated into one verified repository
export const ALL_DISTRICT_PLACES: Place[] = [
${allPlacesItems.join('\n')}
];

// Lazy dynamic loaders for all 38 districts (Dynamic Imports)
export const districtDataLoaders: Record<string, () => Promise<Place[]>> = {
${loaders.join('\n')}
};

// In-memory cache for lazily loaded district places
const districtCache = new Map<string, Place[]>();

/**
 * Load a district's places lazily with strict filtering
 */
export async function loadDistrictPlaces(districtName: string): Promise<Place[]> {
  const normalized = districtName.trim();
  if (districtCache.has(normalized)) {
    return districtCache.get(normalized)!;
  }

  // Find loader by exact district name
  const loaderKey = Object.keys(districtDataLoaders).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );

  if (!loaderKey || !districtDataLoaders[loaderKey]) {
    // If not found in dynamic loaders, fallback to strict search in ALL_DISTRICT_PLACES
    const strictMatches = ALL_DISTRICT_PLACES.filter((p) => p.district === districtName);
    districtCache.set(normalized, strictMatches);
    return strictMatches;
  }

  const places = await districtDataLoaders[loaderKey]();
  // Enforce strict filtering: place.district === selectedDistrict (exact match)
  const strictlyFiltered = places.filter((p) => p.district === loaderKey);
  districtCache.set(normalized, strictlyFiltered);
  return strictlyFiltered;
}

/**
 * Synchronous strict lookup by district name
 */
export function getPlacesForDistrict(districtName: string): Place[] {
  return ALL_DISTRICT_PLACES.filter((p) => p.district === districtName);
}

// Re-export District Info metadata for UI presentation
export { TN_DISTRICTS_DATA, DistrictInfo };
`;

fs.writeFileSync('src/data/districts/index.ts', indexContent, 'utf8');
console.log('Created src/data/districts/index.ts');
