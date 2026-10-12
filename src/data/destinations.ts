import { Destination } from '../types';
import { ALL_DISTRICT_PLACES, Place } from './districts';

/**
 * Adapter mapping official Place schema to Destination structure
 */
export function placeToDestination(place: Place): Destination {
  const isHidden = place.category === 'Hidden Gems';
  const catKey =
    place.category === 'Temples & Spiritual'
      ? 'temples'
      : place.category === 'Heritage & Forts'
      ? 'heritage'
      : place.category === 'Beaches & Coastal'
      ? 'beaches'
      : place.category === 'Hills & Waterfalls'
      ? 'hills'
      : place.category === 'Nature & Wildlife'
      ? 'nature'
      : place.category === 'Hidden Gems'
      ? 'hidden_gems'
      : place.category === 'Food & Culinary'
      ? 'food'
      : 'cultural';

  const isFree = place.entryFee.toLowerCase().includes('free') || place.entryFee === '₹0';
  const costMatch = place.entryFee.match(/₹(\d+)/);
  const minCost = costMatch ? parseInt(costMatch[1], 10) : 0;

  return {
    id: place.id,
    name: place.name,
    tamilName: place.nameTamil,
    district: place.district,
    cityArea: place.locality,
    category: catKey,
    tags: [catKey, place.locality, place.district],
    description: place.description,
    coordinates: {
      lat: place.latitude,
      lng: place.longitude,
    },
    openingTime: place.visitingHours.split('-')[0]?.trim() || '06:00 AM',
    closingTime: place.visitingHours.split('-')[1]?.trim() || '08:00 PM',
    closedDays: place.visitingHours.toLowerCase().includes('closed') ? ['Designated Closed Day'] : [],
    recommendedDurationMinutes: place.recommendedDurationMins,
    bestVisitingTime: place.bestSeason,
    estimatedCostINR: {
      min: minCost,
      max: Math.round(minCost * 1.5),
      isFree,
      notes: place.entryFee,
    },
    accessibilityInfo: place.accessibilityNotes,
    rules: [place.dressCode],
    dressRequirements: place.dressCode,
    photoRestrictions: 'Standard photography rules apply',
    nearbyAttractions: [],
    nearbyFood: [],
    transportOptions: ['Local auto-rickshaw', 'State transport bus', 'Taxi / Cab'],
    crowdPatterns: {
      typicalPeakHours: ['10:00 AM - 12:30 PM', '05:00 PM - 07:00 PM'],
      lowCrowdHours: ['06:30 AM - 08:30 AM'],
      weekendSurchargeFactor: 1.25,
    },
    source: {
      sourceName: place.sourceName,
      sourceUrl: place.sourceUrl,
      sourceType: 'OFFICIAL_TOURISM',
      retrievedAt: place.lastVerified,
      lastVerifiedAt: place.lastVerified,
      confidence: place.confidence,
    },
    isHiddenGem: isHidden,
    whyHiddenGem: isHidden ? place.description : undefined,
    imageUrl:
      place.imageUrl ||
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
  };
}

/**
 * TAMIZN VISA - Complete Verified Destination Repository
 * Aggregated from all 38 individual district data modules.
 */
export const DESTINATIONS_DATA: Destination[] = ALL_DISTRICT_PLACES.map(placeToDestination);
