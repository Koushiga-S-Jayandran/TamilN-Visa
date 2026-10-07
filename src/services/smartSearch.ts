import { Destination, FoodPlace } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';

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

/**
 * TAMIZN VISA - Natural Language Intent Search & Smart Alternative Engine
 */
export function executeSmartSearch(rawQuery: string): SmartSearchResult {
  const query = rawQuery.trim().toLowerCase();

  let detectedDistrict: string | undefined;
  let detectedCategory: string | undefined;
  let detectedIntent = 'General discovery';

  // District recognition
  const districts = [
    'chennai',
    'coimbatore',
    'madurai',
    'thanjavur',
    'tiruchirappalli',
    'trichy',
    'nilgiris',
    'ooty',
    'kanyakumari',
    'salem',
    'tirunelveli',
    'dindigul',
    'kodaikanal',
    'ramanathapuram',
    'rameswaram',
    'sivaganga',
    'chettinad',
    'cuddalore',
    'pudukkottai',
    'tenkasi',
    'dharmapuri',
    'viluppuram',
    'gingee',
    'mayiladuthurai',
    'tranquebar',
    'chengalpattu',
    'mahabalipuram',
    'ariyalur',
    'tiruvannamalai',
  ];

  for (const d of districts) {
    if (query.includes(d)) {
      if (d === 'trichy') detectedDistrict = 'Tiruchirappalli';
      else if (d === 'ooty') detectedDistrict = 'Nilgiris';
      else if (d === 'kodaikanal') detectedDistrict = 'Dindigul';
      else if (d === 'rameswaram') detectedDistrict = 'Ramanathapuram';
      else if (d === 'chettinad') detectedDistrict = 'Sivaganga';
      else if (d === 'gingee') detectedDistrict = 'Viluppuram';
      else if (d === 'tranquebar') detectedDistrict = 'Mayiladuthurai';
      else if (d === 'mahabalipuram') detectedDistrict = 'Chengalpattu';
      else detectedDistrict = d.charAt(0).toUpperCase() + d.slice(1);
      break;
    }
  }

  // Category recognition
  if (query.includes('temple') || query.includes('kovil') || query.includes('spiritual') || query.includes('darshan')) {
    detectedCategory = 'temples';
  } else if (query.includes('beach') || query.includes('coast') || query.includes('sea')) {
    detectedCategory = 'beaches';
  } else if (query.includes('hill') || query.includes('mountain') || query.includes('falls') || query.includes('waterfall')) {
    detectedCategory = 'hills';
  } else if (query.includes('hidden') || query.includes('secret') || query.includes('peaceful') || query.includes('quiet') || query.includes('less crowd')) {
    detectedCategory = 'hidden_gems';
  } else if (query.includes('food') || query.includes('eat') || query.includes('mess') || query.includes('biryani') || query.includes('dosa')) {
    detectedCategory = 'food';
  }

  // Check SMART ALTERNATIVE case (e.g., "beaches in coimbatore" or "beaches near coimbatore")
  if (
    detectedDistrict === 'Coimbatore' &&
    (query.includes('beach') || query.includes('sea') || query.includes('coast'))
  ) {
    const natureAlternatives = DESTINATIONS_DATA.filter(
      (d) => d.district === 'Coimbatore' && (d.category === 'nature' || d.category === 'hidden_gems')
    );

    return {
      query: rawQuery,
      detectedDistrict: 'Coimbatore',
      detectedCategory: 'beaches',
      detectedIntent: 'Water / Outdoor Recreation Request',
      alternativeNotice: {
        missingConcept: 'Coastline / Beach',
        explanation:
          'Coimbatore is situated at the foothills of the Western Ghats and does not have a coastal beach. However, here are verified freshwater cascades, mountain streams, and scenic lake alternatives in the region:',
        suggestedAlternatives: natureAlternatives,
      },
      destinations: natureAlternatives,
      foodPlaces: FOOD_PLACES_DATA.filter((f) => f.district === 'Coimbatore'),
    };
  }

  // General filtering
  let matchedDestinations = [...DESTINATIONS_DATA];

  if (detectedDistrict) {
    matchedDestinations = matchedDestinations.filter(
      (d) => d.district.toLowerCase() === detectedDistrict?.toLowerCase()
    );
  }

  if (detectedCategory) {
    if (detectedCategory === 'hidden_gems') {
      matchedDestinations = matchedDestinations.filter((d) => d.isHiddenGem);
      detectedIntent = 'Hidden gems & quiet explorations';
    } else {
      matchedDestinations = matchedDestinations.filter((d) => d.category === detectedCategory);
    }
  }

  // If search terms remain and we have few matches, do keyword search across description, tags
  if (matchedDestinations.length === 0 || (!detectedDistrict && !detectedCategory)) {
    const keywords = query.split(/\s+/).filter((w) => w.length > 2);
    matchedDestinations = DESTINATIONS_DATA.filter((d) => {
      const fullText = `${d.name} ${d.description} ${d.tags.join(' ')} ${d.district} ${d.cityArea}`.toLowerCase();
      return keywords.some((k) => fullText.includes(k));
    });
  }

  // If still empty, return top rated destinations
  if (matchedDestinations.length === 0) {
    matchedDestinations = DESTINATIONS_DATA.slice(0, 6);
  }

  const matchedFood = FOOD_PLACES_DATA.filter(
    (f) =>
      (!detectedDistrict || f.district.toLowerCase() === detectedDistrict.toLowerCase()) &&
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
