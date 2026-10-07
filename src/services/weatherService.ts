import { Destination } from '../types';

export type TamilNaduClimatePattern = 'Monsoon' | 'Dry' | 'Humid' | 'Mountain Cool';

export interface WeatherInsight {
  pattern: TamilNaduClimatePattern;
  tamilLabel: string;
  englishLabel: string;
  tempCelsius: number;
  humidityPercent: number;
  conditionDescription: string;
  travelerAdvice: string;
  seasonContext: string;
  iconType: 'monsoon' | 'dry' | 'humid' | 'mountain';
}

/**
 * TAMIZN VISA - Regional Tamil Nadu Climate & Weather Engine
 *
 * Grounded in Tamil Nadu's distinct meteorological zones:
 * 1. Coastal Coromandel & Gulf of Mannar -> 'Humid' (High marine moisture, sea breeze)
 * 2. Western Ghats / Nilgiris / Anamalai -> 'Mountain Cool' (Sub-tropical highland, misty)
 * 3. Cascade & Rain Belts (Valparai, Courtallam, Siruvani) -> 'Monsoon' (Saral showers & lush cascades)
 * 4. Interior Deccan & Kaveri Plains (Madurai, Trichy, Dharmapuri) -> 'Dry' (Warm, low humidity, clear skies)
 */
export function getDestinationWeather(destination: Destination): WeatherInsight {
  const district = destination.district.toLowerCase();
  const id = destination.id.toLowerCase();
  const category = destination.category.toLowerCase();

  // 1. High-altitude Hill Stations & Mist Zones
  const isHighAltitude =
    district.includes('nilgiris') ||
    id.includes('ooty') ||
    id.includes('yercaud') ||
    id.includes('kodaikanal');

  if (isHighAltitude) {
    return {
      pattern: 'Mountain Cool',
      tamilLabel: 'மலைக் குளிர் / பனி',
      englishLabel: 'Mountain Cool',
      tempCelsius: 17,
      humidityPercent: 68,
      conditionDescription: 'Misty Shola highland breeze & crisp mountain air',
      travelerAdvice: 'Warm layer / light jacket advised, especially before 10 AM',
      seasonContext: 'Pleasant Highland Climate',
      iconType: 'mountain',
    };
  }

  // 2. Monsoon & High-Rainfall / Waterfall Belts
  const isMonsoonBelt =
    id.includes('courtallam') ||
    id.includes('chinna-kallar') ||
    id.includes('valparai') ||
    id.includes('siruvani') ||
    id.includes('hogenakkal');

  if (isMonsoonBelt) {
    return {
      pattern: 'Monsoon',
      tamilLabel: 'மழைக்காலம் / சாரல்',
      englishLabel: 'Monsoon',
      tempCelsius: 24,
      humidityPercent: 88,
      conditionDescription: 'Passing Ghats rain showers & high water volume',
      travelerAdvice: 'Waterproof pouch for phones & non-slip footwear near spray',
      seasonContext: 'Active Cascade & Saral Season',
      iconType: 'monsoon',
    };
  }

  // 3. Coastal Maritime Zones (Bay of Bengal & Indian Ocean)
  const isCoastal =
    district.includes('chennai') ||
    district.includes('chengalpattu') ||
    district.includes('ramanathapuram') ||
    district.includes('kanyakumari') ||
    district.includes('thoothukudi') ||
    district.includes('cuddalore') ||
    district.includes('mayiladuthurai') ||
    district.includes('nagapattinam') ||
    category === 'beaches' ||
    id.includes('marina') ||
    id.includes('shore-temple') ||
    id.includes('dhanushkodi') ||
    id.includes('tranquebar');

  if (isCoastal) {
    return {
      pattern: 'Humid',
      tamilLabel: 'கடல் ஈரப்பதம்',
      englishLabel: 'Humid',
      tempCelsius: 30,
      humidityPercent: 82,
      conditionDescription: 'Warm coastal moisture tempered by Bay of Bengal breeze',
      travelerAdvice: 'Breathable cottons; late afternoon promenade is coolest',
      seasonContext: 'Coromandel Coastal Moisture',
      iconType: 'humid',
    };
  }

  // 4. Interior Plains & Rayalaseema/Deccan Border (Madurai, Trichy, Dharmapuri, etc.)
  const isInteriorDry =
    district.includes('madurai') ||
    district.includes('tiruchirappalli') ||
    district.includes('dharmapuri') ||
    district.includes('perambalur') ||
    district.includes('ariyalur') ||
    district.includes('karur') ||
    district.includes('virudhunagar');

  if (isInteriorDry) {
    return {
      pattern: 'Dry',
      tamilLabel: 'வறண்ட வானிலை',
      englishLabel: 'Dry',
      tempCelsius: 33,
      humidityPercent: 44,
      conditionDescription: 'Clear sunny skies with dry heat & minimal cloud cover',
      travelerAdvice: 'Carry water bottle & plan temple walks before midday granite heat',
      seasonContext: 'Inland Deccan Dry Belt',
      iconType: 'dry',
    };
  }

  // 5. Kongu Plateau Default (Coimbatore, Erode, Tiruppur)
  return {
    pattern: 'Dry',
    tamilLabel: 'இதமான வறண்ட வானிலை',
    englishLabel: 'Dry',
    tempCelsius: 28,
    humidityPercent: 52,
    conditionDescription: 'Moderate Kongu valley temperatures with gentle Palghat gap wind',
    travelerAdvice: 'Pleasant daytime conditions for heritage walking',
    seasonContext: 'Kongunadu Plateau',
    iconType: 'dry',
  };
}
