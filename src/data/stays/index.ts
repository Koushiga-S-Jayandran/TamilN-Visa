/**
 * TAMIZN VISA - Verified Stays Repository (All 38 Districts)
 * Lazy dynamic loading & synchronous aggregations.
 */

export * from './types';
import { Stay } from './types';

import ariyalurStays from './ariyalur';
import chengalpattuStays from './chengalpattu';
import chennaiStays from './chennai';
import coimbatoreStays from './coimbatore';
import cuddaloreStays from './cuddalore';
import dharmapuriStays from './dharmapuri';
import dindigulStays from './dindigul';
import erodeStays from './erode';
import kallakurichiStays from './kallakurichi';
import kancheepuramStays from './kancheepuram';
import kanyakumariStays from './kanyakumari';
import karurStays from './karur';
import krishnagiriStays from './krishnagiri';
import maduraiStays from './madurai';
import mayiladuthuraiStays from './mayiladuthurai';
import nagapattinamStays from './nagapattinam';
import namakkalStays from './namakkal';
import nilgirisStays from './nilgiris';
import perambalurStays from './perambalur';
import pudukkottaiStays from './pudukkottai';
import ramanathapuramStays from './ramanathapuram';
import ranipetStays from './ranipet';
import salemStays from './salem';
import sivagangaStays from './sivaganga';
import tenkasiStays from './tenkasi';
import thanjavurStays from './thanjavur';
import theniStays from './theni';
import thoothukudiStays from './thoothukudi';
import tiruchirappalliStays from './tiruchirappalli';
import tirunelveliStays from './tirunelveli';
import tirupatturStays from './tirupattur';
import tiruppurStays from './tiruppur';
import tiruvallurStays from './tiruvallur';
import tiruvannamalaiStays from './tiruvannamalai';
import tiruvarurStays from './tiruvarur';
import velloreStays from './vellore';
import viluppuramStays from './viluppuram';
import virudhunagarStays from './virudhunagar';

export {
  ariyalurStays,
  chengalpattuStays,
  chennaiStays,
  coimbatoreStays,
  cuddaloreStays,
  dharmapuriStays,
  dindigulStays,
  erodeStays,
  kallakurichiStays,
  kancheepuramStays,
  kanyakumariStays,
  karurStays,
  krishnagiriStays,
  maduraiStays,
  mayiladuthuraiStays,
  nagapattinamStays,
  namakkalStays,
  nilgirisStays,
  perambalurStays,
  pudukkottaiStays,
  ramanathapuramStays,
  ranipetStays,
  salemStays,
  sivagangaStays,
  tenkasiStays,
  thanjavurStays,
  theniStays,
  thoothukudiStays,
  tiruchirappalliStays,
  tirunelveliStays,
  tirupatturStays,
  tiruppurStays,
  tiruvallurStays,
  tiruvannamalaiStays,
  tiruvarurStays,
  velloreStays,
  viluppuramStays,
  virudhunagarStays,
};

export const ALL_DISTRICT_STAYS: Stay[] = [
  ...ariyalurStays,
  ...chengalpattuStays,
  ...chennaiStays,
  ...coimbatoreStays,
  ...cuddaloreStays,
  ...dharmapuriStays,
  ...dindigulStays,
  ...erodeStays,
  ...kallakurichiStays,
  ...kancheepuramStays,
  ...kanyakumariStays,
  ...karurStays,
  ...krishnagiriStays,
  ...maduraiStays,
  ...mayiladuthuraiStays,
  ...nagapattinamStays,
  ...namakkalStays,
  ...nilgirisStays,
  ...perambalurStays,
  ...pudukkottaiStays,
  ...ramanathapuramStays,
  ...ranipetStays,
  ...salemStays,
  ...sivagangaStays,
  ...tenkasiStays,
  ...thanjavurStays,
  ...theniStays,
  ...thoothukudiStays,
  ...tiruchirappalliStays,
  ...tirunelveliStays,
  ...tirupatturStays,
  ...tiruppurStays,
  ...tiruvallurStays,
  ...tiruvannamalaiStays,
  ...tiruvarurStays,
  ...velloreStays,
  ...viluppuramStays,
  ...virudhunagarStays,
];

export const stayDataLoaders: Record<string, () => Promise<Stay[]>> = {
  'Ariyalur': () => import('./ariyalur').then(m => m.default || m.ariyalurStays),
  'Chengalpattu': () => import('./chengalpattu').then(m => m.default || m.chengalpattuStays),
  'Chennai': () => import('./chennai').then(m => m.default || m.chennaiStays),
  'Coimbatore': () => import('./coimbatore').then(m => m.default || m.coimbatoreStays),
  'Cuddalore': () => import('./cuddalore').then(m => m.default || m.cuddaloreStays),
  'Dharmapuri': () => import('./dharmapuri').then(m => m.default || m.dharmapuriStays),
  'Dindigul': () => import('./dindigul').then(m => m.default || m.dindigulStays),
  'Erode': () => import('./erode').then(m => m.default || m.erodeStays),
  'Kallakurichi': () => import('./kallakurichi').then(m => m.default || m.kallakurichiStays),
  'Kancheepuram': () => import('./kancheepuram').then(m => m.default || m.kancheepuramStays),
  'Kanyakumari': () => import('./kanyakumari').then(m => m.default || m.kanyakumariStays),
  'Karur': () => import('./karur').then(m => m.default || m.karurStays),
  'Krishnagiri': () => import('./krishnagiri').then(m => m.default || m.krishnagiriStays),
  'Madurai': () => import('./madurai').then(m => m.default || m.maduraiStays),
  'Mayiladuthurai': () => import('./mayiladuthurai').then(m => m.default || m.mayiladuthuraiStays),
  'Nagapattinam': () => import('./nagapattinam').then(m => m.default || m.nagapattinamStays),
  'Namakkal': () => import('./namakkal').then(m => m.default || m.namakkalStays),
  'Nilgiris': () => import('./nilgiris').then(m => m.default || m.nilgirisStays),
  'Perambalur': () => import('./perambalur').then(m => m.default || m.perambalurStays),
  'Pudukkottai': () => import('./pudukkottai').then(m => m.default || m.pudukkottaiStays),
  'Ramanathapuram': () => import('./ramanathapuram').then(m => m.default || m.ramanathapuramStays),
  'Ranipet': () => import('./ranipet').then(m => m.default || m.ranipetStays),
  'Salem': () => import('./salem').then(m => m.default || m.salemStays),
  'Sivaganga': () => import('./sivaganga').then(m => m.default || m.sivagangaStays),
  'Tenkasi': () => import('./tenkasi').then(m => m.default || m.tenkasiStays),
  'Thanjavur': () => import('./thanjavur').then(m => m.default || m.thanjavurStays),
  'Theni': () => import('./theni').then(m => m.default || m.theniStays),
  'Thoothukudi': () => import('./thoothukudi').then(m => m.default || m.thoothukudiStays),
  'Tiruchirappalli': () => import('./tiruchirappalli').then(m => m.default || m.tiruchirappalliStays),
  'Tirunelveli': () => import('./tirunelveli').then(m => m.default || m.tirunelveliStays),
  'Tirupattur': () => import('./tirupattur').then(m => m.default || m.tirupatturStays),
  'Tiruppur': () => import('./tiruppur').then(m => m.default || m.tiruppurStays),
  'Tiruvallur': () => import('./tiruvallur').then(m => m.default || m.tiruvallurStays),
  'Tiruvannamalai': () => import('./tiruvannamalai').then(m => m.default || m.tiruvannamalaiStays),
  'Tiruvarur': () => import('./tiruvarur').then(m => m.default || m.tiruvarurStays),
  'Vellore': () => import('./vellore').then(m => m.default || m.velloreStays),
  'Viluppuram': () => import('./viluppuram').then(m => m.default || m.viluppuramStays),
  'Virudhunagar': () => import('./virudhunagar').then(m => m.default || m.virudhunagarStays),
};

const staysCache = new Map<string, Stay[]>();

export async function loadDistrictStays(districtName: string): Promise<Stay[]> {
  const normalized = districtName.trim();
  if (staysCache.has(normalized)) {
    return staysCache.get(normalized)!;
  }

  const loaderKey = Object.keys(stayDataLoaders).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );

  if (!loaderKey || !stayDataLoaders[loaderKey]) {
    const strictMatches = ALL_DISTRICT_STAYS.filter((s) => s.district === districtName);
    staysCache.set(normalized, strictMatches);
    return strictMatches;
  }

  const stays = await stayDataLoaders[loaderKey]();
  const strictlyFiltered = stays.filter((s) => s.district === loaderKey);
  staysCache.set(normalized, strictlyFiltered);
  return strictlyFiltered;
}

export function getStaysForDistrict(districtName: string): Stay[] {
  return ALL_DISTRICT_STAYS.filter((s) => s.district === districtName);
}
