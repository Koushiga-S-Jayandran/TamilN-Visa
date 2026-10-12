/**
 * TAMIZN VISA - Complete 38 District Repository
 * Exports all 38 districts, unified place array, and lazy dynamic loaders.
 */

export * from './types';
import { Place } from './types';
import type { DistrictInfo } from '../districts_info';
import { TN_DISTRICTS_DATA } from '../districts_info';

// Synchronous imports of all 38 district datasets
import ariyalurPlaces from './ariyalur';
import chengalpattuPlaces from './chengalpattu';
import chennaiPlaces from './chennai';
import coimbatorePlaces from './coimbatore';
import cuddalorePlaces from './cuddalore';
import dharmapuriPlaces from './dharmapuri';
import dindigulPlaces from './dindigul';
import erodePlaces from './erode';
import kallakurichiPlaces from './kallakurichi';
import kancheepuramPlaces from './kancheepuram';
import kanyakumariPlaces from './kanyakumari';
import karurPlaces from './karur';
import krishnagiriPlaces from './krishnagiri';
import maduraiPlaces from './madurai';
import mayiladuthuraiPlaces from './mayiladuthurai';
import nagapattinamPlaces from './nagapattinam';
import namakkalPlaces from './namakkal';
import nilgirisPlaces from './nilgiris';
import perambalurPlaces from './perambalur';
import pudukkottaiPlaces from './pudukkottai';
import ramanathapuramPlaces from './ramanathapuram';
import ranipetPlaces from './ranipet';
import salemPlaces from './salem';
import sivagangaPlaces from './sivaganga';
import tenkasiPlaces from './tenkasi';
import thanjavurPlaces from './thanjavur';
import theniPlaces from './theni';
import thoothukudiPlaces from './thoothukudi';
import tiruchirappalliPlaces from './tiruchirappalli';
import tirunelveliPlaces from './tirunelveli';
import tirupatturPlaces from './tirupattur';
import tiruppurPlaces from './tiruppur';
import tiruvallurPlaces from './tiruvallur';
import tiruvannamalaiPlaces from './tiruvannamalai';
import tiruvarurPlaces from './tiruvarur';
import vellorePlaces from './vellore';
import viluppuramPlaces from './viluppuram';
import virudhunagarPlaces from './virudhunagar';

// Export individual district datasets
export {
  ariyalurPlaces,
  chengalpattuPlaces,
  chennaiPlaces,
  coimbatorePlaces,
  cuddalorePlaces,
  dharmapuriPlaces,
  dindigulPlaces,
  erodePlaces,
  kallakurichiPlaces,
  kancheepuramPlaces,
  kanyakumariPlaces,
  karurPlaces,
  krishnagiriPlaces,
  maduraiPlaces,
  mayiladuthuraiPlaces,
  nagapattinamPlaces,
  namakkalPlaces,
  nilgirisPlaces,
  perambalurPlaces,
  pudukkottaiPlaces,
  ramanathapuramPlaces,
  ranipetPlaces,
  salemPlaces,
  sivagangaPlaces,
  tenkasiPlaces,
  thanjavurPlaces,
  theniPlaces,
  thoothukudiPlaces,
  tiruchirappalliPlaces,
  tirunelveliPlaces,
  tirupatturPlaces,
  tiruppurPlaces,
  tiruvallurPlaces,
  tiruvannamalaiPlaces,
  tiruvarurPlaces,
  vellorePlaces,
  viluppuramPlaces,
  virudhunagarPlaces,
};

// All places aggregated into one verified repository
export const ALL_DISTRICT_PLACES: Place[] = [
  ...ariyalurPlaces,
  ...chengalpattuPlaces,
  ...chennaiPlaces,
  ...coimbatorePlaces,
  ...cuddalorePlaces,
  ...dharmapuriPlaces,
  ...dindigulPlaces,
  ...erodePlaces,
  ...kallakurichiPlaces,
  ...kancheepuramPlaces,
  ...kanyakumariPlaces,
  ...karurPlaces,
  ...krishnagiriPlaces,
  ...maduraiPlaces,
  ...mayiladuthuraiPlaces,
  ...nagapattinamPlaces,
  ...namakkalPlaces,
  ...nilgirisPlaces,
  ...perambalurPlaces,
  ...pudukkottaiPlaces,
  ...ramanathapuramPlaces,
  ...ranipetPlaces,
  ...salemPlaces,
  ...sivagangaPlaces,
  ...tenkasiPlaces,
  ...thanjavurPlaces,
  ...theniPlaces,
  ...thoothukudiPlaces,
  ...tiruchirappalliPlaces,
  ...tirunelveliPlaces,
  ...tirupatturPlaces,
  ...tiruppurPlaces,
  ...tiruvallurPlaces,
  ...tiruvannamalaiPlaces,
  ...tiruvarurPlaces,
  ...vellorePlaces,
  ...viluppuramPlaces,
  ...virudhunagarPlaces,
];

// Lazy dynamic loaders for all 38 districts (Dynamic Imports)
export const districtDataLoaders: Record<string, () => Promise<Place[]>> = {
  'Ariyalur': () => import('./ariyalur').then(m => m.default || m.ariyalurPlaces),
  'Chengalpattu': () => import('./chengalpattu').then(m => m.default || m.chengalpattuPlaces),
  'Chennai': () => import('./chennai').then(m => m.default || m.chennaiPlaces),
  'Coimbatore': () => import('./coimbatore').then(m => m.default || m.coimbatorePlaces),
  'Cuddalore': () => import('./cuddalore').then(m => m.default || m.cuddalorePlaces),
  'Dharmapuri': () => import('./dharmapuri').then(m => m.default || m.dharmapuriPlaces),
  'Dindigul': () => import('./dindigul').then(m => m.default || m.dindigulPlaces),
  'Erode': () => import('./erode').then(m => m.default || m.erodePlaces),
  'Kallakurichi': () => import('./kallakurichi').then(m => m.default || m.kallakurichiPlaces),
  'Kancheepuram': () => import('./kancheepuram').then(m => m.default || m.kancheepuramPlaces),
  'Kanyakumari': () => import('./kanyakumari').then(m => m.default || m.kanyakumariPlaces),
  'Karur': () => import('./karur').then(m => m.default || m.karurPlaces),
  'Krishnagiri': () => import('./krishnagiri').then(m => m.default || m.krishnagiriPlaces),
  'Madurai': () => import('./madurai').then(m => m.default || m.maduraiPlaces),
  'Mayiladuthurai': () => import('./mayiladuthurai').then(m => m.default || m.mayiladuthuraiPlaces),
  'Nagapattinam': () => import('./nagapattinam').then(m => m.default || m.nagapattinamPlaces),
  'Namakkal': () => import('./namakkal').then(m => m.default || m.namakkalPlaces),
  'Nilgiris': () => import('./nilgiris').then(m => m.default || m.nilgirisPlaces),
  'Perambalur': () => import('./perambalur').then(m => m.default || m.perambalurPlaces),
  'Pudukkottai': () => import('./pudukkottai').then(m => m.default || m.pudukkottaiPlaces),
  'Ramanathapuram': () => import('./ramanathapuram').then(m => m.default || m.ramanathapuramPlaces),
  'Ranipet': () => import('./ranipet').then(m => m.default || m.ranipetPlaces),
  'Salem': () => import('./salem').then(m => m.default || m.salemPlaces),
  'Sivaganga': () => import('./sivaganga').then(m => m.default || m.sivagangaPlaces),
  'Tenkasi': () => import('./tenkasi').then(m => m.default || m.tenkasiPlaces),
  'Thanjavur': () => import('./thanjavur').then(m => m.default || m.thanjavurPlaces),
  'Theni': () => import('./theni').then(m => m.default || m.theniPlaces),
  'Thoothukudi': () => import('./thoothukudi').then(m => m.default || m.thoothukudiPlaces),
  'Tiruchirappalli': () => import('./tiruchirappalli').then(m => m.default || m.tiruchirappalliPlaces),
  'Tirunelveli': () => import('./tirunelveli').then(m => m.default || m.tirunelveliPlaces),
  'Tirupattur': () => import('./tirupattur').then(m => m.default || m.tirupatturPlaces),
  'Tiruppur': () => import('./tiruppur').then(m => m.default || m.tiruppurPlaces),
  'Tiruvallur': () => import('./tiruvallur').then(m => m.default || m.tiruvallurPlaces),
  'Tiruvannamalai': () => import('./tiruvannamalai').then(m => m.default || m.tiruvannamalaiPlaces),
  'Tiruvarur': () => import('./tiruvarur').then(m => m.default || m.tiruvarurPlaces),
  'Vellore': () => import('./vellore').then(m => m.default || m.vellorePlaces),
  'Viluppuram': () => import('./viluppuram').then(m => m.default || m.viluppuramPlaces),
  'Virudhunagar': () => import('./virudhunagar').then(m => m.default || m.virudhunagarPlaces),
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
export { TN_DISTRICTS_DATA, type DistrictInfo };
