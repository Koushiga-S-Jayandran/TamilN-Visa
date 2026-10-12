/**
 * TAMIZN VISA - Official Public Transport Guide (All 38 Districts)
 * Southern Railway & TNSTC verified schedules and hubs.
 */

export * from './types';
import { DistrictTransportHub } from './types';

import chennaiTransport from './chennai';
import coimbatoreTransport from './coimbatore';
import maduraiTransport from './madurai';
import thanjavurTransport from './thanjavur';
import kanyakumariTransport from './kanyakumari';
import nilgirisTransport from './nilgiris';
import ariyalurTransport from './ariyalur';
import chengalpattuTransport from './chengalpattu';
import cuddaloreTransport from './cuddalore';
import dharmapuriTransport from './dharmapuri';
import dindigulTransport from './dindigul';
import erodeTransport from './erode';
import kallakurichiTransport from './kallakurichi';
import kancheepuramTransport from './kancheepuram';
import karurTransport from './karur';
import krishnagiriTransport from './krishnagiri';
import mayiladuthuraiTransport from './mayiladuthurai';
import nagapattinamTransport from './nagapattinam';
import namakkalTransport from './namakkal';
import perambalurTransport from './perambalur';
import pudukkottaiTransport from './pudukkottai';
import ramanathapuramTransport from './ramanathapuram';
import ranipetTransport from './ranipet';
import salemTransport from './salem';
import sivagangaTransport from './sivaganga';
import tenkasiTransport from './tenkasi';
import theniTransport from './theni';
import thoothukudiTransport from './thoothukudi';
import tiruchirappalliTransport from './tiruchirappalli';
import tirunelveliTransport from './tirunelveli';
import tirupatturTransport from './tirupattur';
import tiruppurTransport from './tiruppur';
import tiruvallurTransport from './tiruvallur';
import tiruvannamalaiTransport from './tiruvannamalai';
import tiruvarurTransport from './tiruvarur';
import velloreTransport from './vellore';
import viluppuramTransport from './viluppuram';
import virudhunagarTransport from './virudhunagar';

export {
  chennaiTransport,
  coimbatoreTransport,
  maduraiTransport,
  thanjavurTransport,
  kanyakumariTransport,
  nilgirisTransport,
  ariyalurTransport,
  chengalpattuTransport,
  cuddaloreTransport,
  dharmapuriTransport,
  dindigulTransport,
  erodeTransport,
  kallakurichiTransport,
  kancheepuramTransport,
  karurTransport,
  krishnagiriTransport,
  mayiladuthuraiTransport,
  nagapattinamTransport,
  namakkalTransport,
  perambalurTransport,
  pudukkottaiTransport,
  ramanathapuramTransport,
  ranipetTransport,
  salemTransport,
  sivagangaTransport,
  tenkasiTransport,
  theniTransport,
  thoothukudiTransport,
  tiruchirappalliTransport,
  tirunelveliTransport,
  tirupatturTransport,
  tiruppurTransport,
  tiruvallurTransport,
  tiruvannamalaiTransport,
  tiruvarurTransport,
  velloreTransport,
  viluppuramTransport,
  virudhunagarTransport,
};

export const ALL_DISTRICT_TRANSPORT: Record<string, DistrictTransportHub> = {
  'Chennai': chennaiTransport,
  'Coimbatore': coimbatoreTransport,
  'Madurai': maduraiTransport,
  'Thanjavur': thanjavurTransport,
  'Kanyakumari': kanyakumariTransport,
  'Nilgiris': nilgirisTransport,
  'Ariyalur': ariyalurTransport,
  'Chengalpattu': chengalpattuTransport,
  'Cuddalore': cuddaloreTransport,
  'Dharmapuri': dharmapuriTransport,
  'Dindigul': dindigulTransport,
  'Erode': erodeTransport,
  'Kallakurichi': kallakurichiTransport,
  'Kancheepuram': kancheepuramTransport,
  'Karur': karurTransport,
  'Krishnagiri': krishnagiriTransport,
  'Mayiladuthurai': mayiladuthuraiTransport,
  'Nagapattinam': nagapattinamTransport,
  'Namakkal': namakkalTransport,
  'Perambalur': perambalurTransport,
  'Pudukkottai': pudukkottaiTransport,
  'Ramanathapuram': ramanathapuramTransport,
  'Ranipet': ranipetTransport,
  'Salem': salemTransport,
  'Sivaganga': sivagangaTransport,
  'Tenkasi': tenkasiTransport,
  'Theni': theniTransport,
  'Thoothukudi': thoothukudiTransport,
  'Tiruchirappalli': tiruchirappalliTransport,
  'Tirunelveli': tirunelveliTransport,
  'Tirupattur': tirupatturTransport,
  'Tiruppur': tiruppurTransport,
  'Tiruvallur': tiruvallurTransport,
  'Tiruvannamalai': tiruvannamalaiTransport,
  'Tiruvarur': tiruvarurTransport,
  'Vellore': velloreTransport,
  'Viluppuram': viluppuramTransport,
  'Virudhunagar': virudhunagarTransport,
};

export const transportDataLoaders: Record<string, () => Promise<DistrictTransportHub>> = {
  'Chennai': () => import('./chennai').then(m => m.default || m.chennaiTransport),
  'Coimbatore': () => import('./coimbatore').then(m => m.default || m.coimbatoreTransport),
  'Madurai': () => import('./madurai').then(m => m.default || m.maduraiTransport),
  'Thanjavur': () => import('./thanjavur').then(m => m.default || m.thanjavurTransport),
  'Kanyakumari': () => import('./kanyakumari').then(m => m.default || m.kanyakumariTransport),
  'Nilgiris': () => import('./nilgiris').then(m => m.default || m.nilgirisTransport),
  'Ariyalur': () => import('./ariyalur').then(m => m.default || m.ariyalurTransport),
  'Chengalpattu': () => import('./chengalpattu').then(m => m.default || m.chengalpattuTransport),
  'Cuddalore': () => import('./cuddalore').then(m => m.default || m.cuddaloreTransport),
  'Dharmapuri': () => import('./dharmapuri').then(m => m.default || m.dharmapuriTransport),
  'Dindigul': () => import('./dindigul').then(m => m.default || m.dindigulTransport),
  'Erode': () => import('./erode').then(m => m.default || m.erodeTransport),
  'Kallakurichi': () => import('./kallakurichi').then(m => m.default || m.kallakurichiTransport),
  'Kancheepuram': () => import('./kancheepuram').then(m => m.default || m.kancheepuramTransport),
  'Karur': () => import('./karur').then(m => m.default || m.karurTransport),
  'Krishnagiri': () => import('./krishnagiri').then(m => m.default || m.krishnagiriTransport),
  'Mayiladuthurai': () => import('./mayiladuthurai').then(m => m.default || m.mayiladuthuraiTransport),
  'Nagapattinam': () => import('./nagapattinam').then(m => m.default || m.nagapattinamTransport),
  'Namakkal': () => import('./namakkal').then(m => m.default || m.namakkalTransport),
  'Perambalur': () => import('./perambalur').then(m => m.default || m.perambalurTransport),
  'Pudukkottai': () => import('./pudukkottai').then(m => m.default || m.pudukkottaiTransport),
  'Ramanathapuram': () => import('./ramanathapuram').then(m => m.default || m.ramanathapuramTransport),
  'Ranipet': () => import('./ranipet').then(m => m.default || m.ranipetTransport),
  'Salem': () => import('./salem').then(m => m.default || m.salemTransport),
  'Sivaganga': () => import('./sivaganga').then(m => m.default || m.sivagangaTransport),
  'Tenkasi': () => import('./tenkasi').then(m => m.default || m.tenkasiTransport),
  'Theni': () => import('./theni').then(m => m.default || m.theniTransport),
  'Thoothukudi': () => import('./thoothukudi').then(m => m.default || m.thoothukudiTransport),
  'Tiruchirappalli': () => import('./tiruchirappalli').then(m => m.default || m.tiruchirappalliTransport),
  'Tirunelveli': () => import('./tirunelveli').then(m => m.default || m.tirunelveliTransport),
  'Tirupattur': () => import('./tirupattur').then(m => m.default || m.tirupatturTransport),
  'Tiruppur': () => import('./tiruppur').then(m => m.default || m.tiruppurTransport),
  'Tiruvallur': () => import('./tiruvallur').then(m => m.default || m.tiruvallurTransport),
  'Tiruvannamalai': () => import('./tiruvannamalai').then(m => m.default || m.tiruvannamalaiTransport),
  'Tiruvarur': () => import('./tiruvarur').then(m => m.default || m.tiruvarurTransport),
  'Vellore': () => import('./vellore').then(m => m.default || m.velloreTransport),
  'Viluppuram': () => import('./viluppuram').then(m => m.default || m.viluppuramTransport),
  'Virudhunagar': () => import('./virudhunagar').then(m => m.default || m.virudhunagarTransport),
};

const transportCache = new Map<string, DistrictTransportHub>();

export async function loadDistrictTransport(districtName: string): Promise<DistrictTransportHub | null> {
  const normalized = districtName.trim();
  if (transportCache.has(normalized)) {
    return transportCache.get(normalized)!;
  }

  const loaderKey = Object.keys(transportDataLoaders).find(
    (k) => k.toLowerCase() === normalized.toLowerCase()
  );

  if (!loaderKey || !transportDataLoaders[loaderKey]) {
    const hub = ALL_DISTRICT_TRANSPORT[districtName] || null;
    if (hub) transportCache.set(normalized, hub);
    return hub;
  }

  const hub = await transportDataLoaders[loaderKey]();
  transportCache.set(normalized, hub);
  return hub;
}

export function getTransportForDistrict(districtName: string): DistrictTransportHub | null {
  return ALL_DISTRICT_TRANSPORT[districtName] || null;
}
