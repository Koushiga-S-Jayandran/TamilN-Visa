import { Destination, FoodPlace } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';
import { getOfficialDistrict } from './itineraryEngine';

export interface SmartSearchResult {
  query: string;
  detectedDistrict?: string;
  detectedCategory?: string;
  detectedIntent: string;
  alternativeNotice?: {
    missingConcept: string;
    explanation: string;
    suggestedAlternatives: Destination[];
  };
  destinations: Destination[];
  foodPlaces: FoodPlace[];
}

// Inland districts that do not have coastal beaches
const INLAND_DISTRICTS = new Set([
  'coimbatore',
  'tiruppur',
  'erode',
  'salem',
  'namakkal',
  'karur',
  'dindigul',
  'madurai',
  'virudhunagar',
  'sivaganga',
  'theni',
  'tiruchirappalli',
  'perambalur',
  'ariyalur',
  'dharmapuri',
  'krishnagiri',
  'vellore',
  'ranipet',
  'tirupattur',
  'tiruvannamalai',
  'kallakurichi',
  'nilgiris',
]);

// Plains & coastal delta districts that do not have mountain/hill station attractions
const FLAT_COASTAL_DISTRICTS = new Set([
  'chennai',
  'nagapattinam',
  'tiruvarur',
  'thanjavur',
  'cuddalore',
  'mayiladuthurai',
  'tiruvallur',
]);

/**
 * TAMIZN VISA - Natural Language Intent Search & Strict District Filter Engine
 * Enforces strict district isolation: when a district is detected/selected,
 * all returned places strictly have place.district === detectedDistrict.
 * Never borrows or falls back to places from other districts.
 */
export function executeSmartSearch(rawQuery: string): SmartSearchResult {
  const query = rawQuery.trim().toLowerCase();

  let detectedDistrictRaw: string | undefined;
  let detectedCategory: string | undefined;
  let detectedIntent = 'General discovery';

  // Comprehensive District and City recognition across Tamil Nadu
  const cityDistrictMap: Record<string, string> = {
    tiruppur: 'Tiruppur',
    coimbatore: 'Coimbatore',
    madurai: 'Madurai',
    thanjavur: 'Thanjavur',
    tiruchirappalli: 'Tiruchirappalli',
    trichy: 'Tiruchirappalli',
    nilgiris: 'Nilgiris',
    ooty: 'Nilgiris',
    coonoor: 'Nilgiris',
    kanyakumari: 'Kanyakumari',
    salem: 'Salem',
    yercaud: 'Salem',
    tirunelveli: 'Tirunelveli',
    nellai: 'Tirunelveli',
    dindigul: 'Dindigul',
    kodaikanal: 'Dindigul',
    kodai: 'Dindigul',
    ramanathapuram: 'Ramanathapuram',
    rameswaram: 'Ramanathapuram',
    dhanushkodi: 'Ramanathapuram',
    sivaganga: 'Sivaganga',
    chettinad: 'Sivaganga',
    karaikudi: 'Sivaganga',
    cuddalore: 'Cuddalore',
    pichavaram: 'Cuddalore',
    pudukkottai: 'Pudukkottai',
    tenkasi: 'Tenkasi',
    courtallam: 'Tenkasi',
    dharmapuri: 'Dharmapuri',
    hogenakkal: 'Dharmapuri',
    viluppuram: 'Viluppuram',
    villupuram: 'Viluppuram',
    gingee: 'Viluppuram',
    mayiladuthurai: 'Mayiladuthurai',
    tranquebar: 'Mayiladuthurai',
    tharangambadi: 'Mayiladuthurai',
    chengalpattu: 'Chengalpattu',
    mahabalipuram: 'Chengalpattu',
    mamallapuram: 'Chengalpattu',
    ariyalur: 'Ariyalur',
    tiruvannamalai: 'Tiruvannamalai',
    erode: 'Erode',
    bhavani: 'Erode',
    vellore: 'Vellore',
    arcot: 'Ranipet',
    ranipet: 'Ranipet',
    thoothukudi: 'Thoothukudi',
    tuticorin: 'Thoothukudi',
    thiruchendur: 'Thoothukudi',
    kanchipuram: 'Kancheepuram',
    kancheepuram: 'Kancheepuram',
    namakkal: 'Namakkal',
    karur: 'Karur',
    sivakasi: 'Virudhunagar',
    virudhunagar: 'Virudhunagar',
    srivilliputhur: 'Virudhunagar',
    nagapattinam: 'Nagapattinam',
    velankanni: 'Nagapattinam',
    krishnagiri: 'Krishnagiri',
    hosur: 'Krishnagiri',
    theni: 'Theni',
    meghamalai: 'Theni',
    tirupattur: 'Tirupattur',
    yelagiri: 'Tirupattur',
    tiruvallur: 'Tiruvallur',
    tiruvarur: 'Tiruvarur',
    perambalur: 'Perambalur',
    kallakurichi: 'Kallakurichi',
    chennai: 'Chennai',
  };

  for (const [key, dist] of Object.entries(cityDistrictMap)) {
    if (query.includes(key)) {
      detectedDistrictRaw = dist;
      break;
    }
  }

  const detectedDistrict = detectedDistrictRaw ? getOfficialDistrict(detectedDistrictRaw) : undefined;

  // Category recognition
  if (
    query.includes('temple') ||
    query.includes('kovil') ||
    query.includes('spiritual') ||
    query.includes('darshan')
  ) {
    detectedCategory = 'temples';
  } else if (
    query.includes('beach') ||
    query.includes('coast') ||
    query.includes('sea') ||
    query.includes('ocean')
  ) {
    detectedCategory = 'beaches';
  } else if (
    query.includes('hill') ||
    query.includes('mountain') ||
    query.includes('falls') ||
    query.includes('waterfall') ||
    query.includes('trek')
  ) {
    detectedCategory = 'hills';
  } else if (
    query.includes('hidden') ||
    query.includes('secret') ||
    query.includes('peaceful') ||
    query.includes('quiet') ||
    query.includes('less crowd')
  ) {
    detectedCategory = 'hidden_gems';
  } else if (
    query.includes('food') ||
    query.includes('eat') ||
    query.includes('mess') ||
    query.includes('biryani') ||
    query.includes('dosa') ||
    query.includes('tiffin')
  ) {
    detectedCategory = 'food';
  }

  // 1. NOTICE: Searching for BEACH in an INLAND district
  if (
    detectedDistrict &&
    INLAND_DISTRICTS.has(detectedDistrict.toLowerCase()) &&
    (query.includes('beach') || query.includes('sea') || query.includes('coast'))
  ) {
    // Strictly only places from THIS district! Never borrow from other districts!
    const districtNature = DESTINATIONS_DATA.filter(
      (d) => d.district === detectedDistrict && (d.category === 'nature' || d.category === 'hills')
    );

    return {
      query: rawQuery,
      detectedDistrict,
      detectedCategory: 'beaches',
      detectedIntent: 'Coastline / Beach Request',
      alternativeNotice: {
        missingConcept: 'Coastline / Beach',
        explanation: `Beach experiences are not available in ${detectedDistrict} as it is situated inland. Recommended coastal destinations in Tamil Nadu include Chennai, Chengalpattu, Ramanathapuram, Cuddalore, or Kanyakumari.`,
        suggestedAlternatives: districtNature,
      },
      destinations: districtNature,
      foodPlaces: FOOD_PLACES_DATA.filter((f) => f.district === detectedDistrict),
    };
  }

  // 2. NOTICE: Searching for HILLS/MOUNTAINS in a FLAT/DELTA district
  if (
    detectedDistrict &&
    FLAT_COASTAL_DISTRICTS.has(detectedDistrict.toLowerCase()) &&
    (query.includes('hill') || query.includes('mountain') || query.includes('trek'))
  ) {
    // Strictly only places from THIS district!
    const districtLocalNature = DESTINATIONS_DATA.filter(
      (d) => d.district === detectedDistrict && (d.category === 'nature' || d.category === 'beaches')
    );

    return {
      query: rawQuery,
      detectedDistrict,
      detectedCategory: 'hills',
      detectedIntent: 'Mountain / Hill Station Request',
      alternativeNotice: {
        missingConcept: 'Hills & Mountains',
        explanation: `Mountain & hill experiences are not available in ${detectedDistrict} as it is situated on the coastal plains / Kaveri delta. Recommended hill destinations include Nilgiris, Dindigul, Salem, Theni, or Tirupattur.`,
        suggestedAlternatives: districtLocalNature,
      },
      destinations: districtLocalNature,
      foodPlaces: FOOD_PLACES_DATA.filter((f) => f.district === detectedDistrict),
    };
  }

  // Strict filtering
  let matchedDestinations: Destination[] = [];

  if (detectedDistrict) {
    // ENFORCE STRICT DISTRICT FILTERING: place.district === selectedDistrict (exact match)
    matchedDestinations = DESTINATIONS_DATA.filter((d) => d.district === detectedDistrict);

    if (detectedCategory) {
      if (detectedCategory === 'hidden_gems') {
        matchedDestinations = matchedDestinations.filter((d) => d.isHiddenGem);
      } else {
        matchedDestinations = matchedDestinations.filter((d) => d.category === detectedCategory);
      }
    }
  } else {
    // Global search when no district specified
    matchedDestinations = [...DESTINATIONS_DATA];
    if (detectedCategory) {
      if (detectedCategory === 'hidden_gems') {
        matchedDestinations = matchedDestinations.filter((d) => d.isHiddenGem);
      } else {
        matchedDestinations = matchedDestinations.filter((d) => d.category === detectedCategory);
      }
    }
    // Keyword match
    const keywords = query.split(/\s+/).filter((w) => w.length > 2);
    if (keywords.length > 0) {
      matchedDestinations = matchedDestinations.filter((d) => {
        const fullText = `${d.name} ${d.description} ${d.tags.join(' ')} ${d.district} ${d.cityArea}`.toLowerCase();
        return keywords.some((k) => fullText.includes(k));
      });
    }
  }

  // STRICT FOOD FILTERING
  const matchedFood = FOOD_PLACES_DATA.filter(
    (f) =>
      (!detectedDistrict || f.district === detectedDistrict) &&
      (!query.includes('veg') || f.isVegetarianOnly)
  );

  return {
    query: rawQuery,
    detectedDistrict,
    detectedCategory,
    detectedIntent,
    destinations: matchedDestinations,
    foodPlaces: matchedFood,
  };
}
