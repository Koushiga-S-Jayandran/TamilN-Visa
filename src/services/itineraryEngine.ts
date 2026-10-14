import {
  ActivitySlot,
  ItineraryDay,
  TripPlannerInput,
  Destination,
  Restaurant,
  MealType,
} from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { ALL_RESTAURANTS, getDistrictRestaurants } from '../data/restaurants';
import { TN_DISTRICTS } from '../config/appConfig';
import { evaluateCrowd } from './crowdEngine';
import { TRAVEL_CONFIG, estimateTravelTimeMinutes } from '../config/travel';
import { buildGoogleMapsUrl } from '../utils/maps';

/**
 * Calculate geographical distance between coordinates (Haversine Formula) in KM
 */
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Normalizes entity name for near-duplicate duplicate detection
 */
export function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Deterministic pseudo-random number generator (Mulberry32)
 */
function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Simple string hash to generate initial deterministic seed
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Map user selected or search alias to the official Tamil Nadu district
 */
export function getOfficialDistrict(inputDistrict: string): string {
  if (!inputDistrict) return 'Chennai';
  const cleaned = inputDistrict.trim().toLowerCase();
  const directMatch = TN_DISTRICTS.find((d) => d.toLowerCase() === cleaned);
  if (directMatch) return directMatch;

  if (cleaned === 'kanchipuram') return 'Kancheepuram';
  if (cleaned === 'villupuram') return 'Viluppuram';
  if (cleaned === 'sivakasi') return 'Virudhunagar';
  if (cleaned === 'ooty') return 'Nilgiris';
  if (cleaned === 'kodaikanal') return 'Dindigul';
  if (cleaned === 'rameswaram') return 'Ramanathapuram';
  if (cleaned === 'mahabalipuram' || cleaned === 'mamallapuram') return 'Chengalpattu';
  if (cleaned === 'hosur') return 'Krishnagiri';
  if (cleaned === 'yercaud') return 'Salem';
  if (cleaned === 'trichy') return 'Tiruchirappalli';
  if (cleaned === 'tuticorin') return 'Thoothukudi';
  if (cleaned === 'courtallam') return 'Tenkasi';
  if (cleaned === 'yelagiri') return 'Tirupattur';
  if (cleaned === 'hogenakkal') return 'Dharmapuri';
  if (cleaned === 'pichavaram' || cleaned === 'chidambaram') return 'Cuddalore';
  if (cleaned === 'velankanni') return 'Nagapattinam';

  return inputDistrict;
}

/**
 * Calculates district maximum allowable days according to data capacity (Part 2.5)
 * maxDays = min(7, floor(verifiedPlaces / 5), floor(verifiedRestaurants / 3))
 */
export function calculateDistrictMaxDays(district: string): {
  district: string;
  placesCount: number;
  restaurantsCount: number;
  maxDays: number;
} {
  const norm = getOfficialDistrict(district);
  const places = DESTINATIONS_DATA.filter((p) => p.district === norm);
  const restaurants = getDistrictRestaurants(norm);
  const calculatedMax = Math.min(
    7,
    Math.floor(places.length / 5),
    Math.floor(restaurants.length / 3)
  );
  const maxDays = Math.max(1, calculatedMax);
  return {
    district: norm,
    placesCount: places.length,
    restaurantsCount: restaurants.length,
    maxDays,
  };
}

/**
 * Parse daytime string like "06:00 AM" or "08:30 PM" into minutes from midnight
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr) return null;
  const match = timeStr.trim().match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return null;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

/**
 * Format minutes from midnight to "HH:MM AM/PM"
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const normalized = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes)));
  let hours = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours >= 12 ? 'PM' : 'AM';

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  const minStr = mins < 10 ? `0${mins}` : `${mins}`;
  const hrStr = hours < 10 ? `0${hours}` : `${hours}`;
  return `${hrStr}:${minStr} ${period}`;
}

/**
 * Check if destination is closed on given day of week
 */
function isClosedOnDay(dest: Destination, date: Date): boolean {
  if (!dest.closedDays || dest.closedDays.length === 0) return false;
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[date.getDay()];
  return dest.closedDays.some((c) => c.toLowerCase().includes(dayName.toLowerCase()));
}

/**
 * Order places to minimize back-tracking (Nearest Neighbor Greedy Path)
 */
function optimizePlaceOrder(places: Destination[]): Destination[] {
  if (places.length <= 1) return places;

  // Separate temples (prefer early morning or evening) from indoor/monument sites
  const temples = places.filter((p) => p.category === 'temples');
  const others = places.filter((p) => p.category !== 'temples');

  // Start with a morning temple if available, or first attraction
  const result: Destination[] = [];
  const remaining = [...places];

  if (temples.length > 0) {
    const start = temples[0];
    result.push(start);
    const idx = remaining.findIndex((r) => r.id === start.id);
    if (idx !== -1) remaining.splice(idx, 1);
  } else {
    result.push(remaining.shift()!);
  }

  while (remaining.length > 0) {
    const last = result[result.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = getDistanceKm(
        last.coordinates.lat,
        last.coordinates.lng,
        remaining[i].coordinates.lat,
        remaining[i].coordinates.lng
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    result.push(remaining.splice(nearestIdx, 1)[0]);
  }

  return result;
}

/**
 * Find unused restaurant in district nearest to given coordinates
 */
function findNearestRestaurant(
  districtRestaurants: Restaurant[],
  mealType: MealType,
  lat: number,
  lng: number,
  usedIds: Set<string>,
  usedNames: Set<string>,
  isVegetarian: boolean
): {
  chosen: Restaurant | null;
  alternatives: { restaurant: Restaurant; distanceKm: number }[];
  distanceKm: number;
} {
  // Filter restaurants matching this meal type and district
  const candidates = districtRestaurants.filter((r) => {
    if (!r.mealTypes.includes(mealType)) return false;
    if (isVegetarian && r.dietType !== 'Pure Veg') return false;
    if (usedIds.has(r.id)) return false;
    if (usedNames.has(normalizeName(r.name))) return false;
    return true;
  });

  if (candidates.length === 0) {
    // If strict veg filter exhausted, fallback to veg & non-veg options that serve pure veg items
    const fallbackCandidates = districtRestaurants.filter((r) => {
      if (!r.mealTypes.includes(mealType)) return false;
      if (usedIds.has(r.id)) return false;
      if (usedNames.has(normalizeName(r.name))) return false;
      return true;
    });

    if (fallbackCandidates.length === 0) {
      return { chosen: null, alternatives: [], distanceKm: 0 };
    }

    // Sort by distance
    const withDist = fallbackCandidates.map((r) => ({
      restaurant: r,
      distanceKm: getDistanceKm(lat, lng, r.latitude, r.longitude),
    }));
    withDist.sort((a, b) => a.distanceKm - b.distanceKm);

    return {
      chosen: withDist[0].restaurant,
      alternatives: withDist.slice(1, 4),
      distanceKm: withDist[0].distanceKm,
    };
  }

  // Sort candidates by distance from current stop
  const withDist = candidates.map((r) => ({
    restaurant: r,
    distanceKm: getDistanceKm(lat, lng, r.latitude, r.longitude),
  }));
  withDist.sort((a, b) => a.distanceKm - b.distanceKm);

  const chosen = withDist[0].restaurant;
  // Alternatives: up to 3 within 5 km or nearest unused
  const alternatives = withDist.slice(1, 4);

  return {
    chosen,
    alternatives,
    distanceKm: withDist[0].distanceKm,
  };
}

/**
 * TAMIZN VISA - High-Precision No-Repeat Itinerary Engine (Part 3)
 * 
 * Rules:
 * 1. Strict District Rule: place.district === selectedDistrict (exact match).
 * 2. Uniqueness: usedPlaceIds and usedRestaurantIds tracked for the WHOLE trip.
 * 3. Daily Structure: 06:30 to 21:00 with at least 5 places per day when data permits.
 * 4. Realistic transit buffers, temple midday closure (12:30-16:00), and nearby restaurant options.
 * 5. Deterministic with seed, supports instant Shuffle.
 */
export function generateItinerary(input: TripPlannerInput): ItineraryDay[] {
  const {
    destinationDistrict,
    travelDate,
    numberOfDays,
    travelerType,
    budgetTier,
    selectedInterests = [],
    selectedPreferences = [],
    seed,
    isVegetarian,
  } = input;

  const officialDistrict = getOfficialDistrict(destinationDistrict);

  // Initialize PRNG with deterministic seed or string hash
  const initialSeed =
    typeof seed === 'number'
      ? seed
      : hashString(
          `${officialDistrict}-${travelDate}-${travelerType}-${budgetTier}-${selectedPreferences.join(',')}`
        );
  const random = createPRNG(initialSeed);

  // 1. STRICT FILTERING: All places strictly belong to this district
  const allDistrictDestinations = DESTINATIONS_DATA.filter(
    (d) => d.district === officialDistrict
  );

  // 2. Verified restaurants strictly belonging to this district
  const districtRestaurants = getDistrictRestaurants(officialDistrict);

  // Track used places and restaurants across the WHOLE multi-day trip
  const usedPlaceIds = new Set<string>();
  const usedPlaceNames = new Set<string>();
  const usedRestaurantIds = new Set<string>();
  const usedRestaurantNames = new Set<string>();

  // Determine user constraints & pace
  const isSlowTravel =
    selectedPreferences.includes('Slow travel') || travelerType === 'Senior-friendly';
  const finishEarly = selectedPreferences.includes('Finish before 6 PM');
  const wantsVegetarian =
    isVegetarian ||
    selectedPreferences.includes('Food focused') && selectedInterests.some((i) => i.toLowerCase().includes('veg'));

  // Target places per day: 5 for normal trips; 3 for slow/senior/early-finish
  const targetPlacesPerDay = isSlowTravel || finishEarly ? 3 : 5;

  // Shuffle candidate places using seed for variety
  const pool = [...allDistrictDestinations];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const days: ItineraryDay[] = [];
  const baseDate = new Date(travelDate || new Date().toISOString().split('T')[0]);

  for (let dayIdx = 0; dayIdx < numberOfDays; dayIdx++) {
    const currentDayDate = new Date(baseDate);
    currentDayDate.setDate(baseDate.getDate() + dayIdx);
    const dateStr = currentDayDate.toISOString().split('T')[0];

    // Filter available places for today: not used anywhere yet & not closed today
    const availableForDay = pool.filter((dest) => {
      if (usedPlaceIds.has(dest.id)) return false;
      if (usedPlaceNames.has(normalizeName(dest.name))) return false;
      if (isClosedOnDay(dest, currentDayDate)) return false;
      return true;
    });

    // Select places for this day up to targetPlacesPerDay
    const placesToTake = Math.min(targetPlacesPerDay, availableForDay.length);
    const selectedForToday = availableForDay.slice(0, placesToTake);

    // Mark as used for the whole trip
    selectedForToday.forEach((p) => {
      usedPlaceIds.add(p.id);
      usedPlaceNames.add(normalizeName(p.name));
    });

    // Optimize route order to minimize backtracking
    const orderedStops = optimizePlaceOrder(selectedForToday);

    const activities: ActivitySlot[] = [];
    let dayEstimatedCost = 0;
    let currentMinutes = 6 * 60 + 30; // 06:30 AM start
    let lastLat = orderedStops[0]?.coordinates.lat ?? 13.0827;
    let lastLng = orderedStops[0]?.coordinates.lng ?? 80.2707;
    let totalKmTraveled = 0;

    // Track exception note if district has fewer verified places
    let exceptionNote: string | undefined = undefined;
    if (orderedStops.length < 5) {
      if (isSlowTravel) {
        exceptionNote = 'Paced schedule (3 stops) for comfortable, unhurried exploration.';
      } else if (finishEarly) {
        exceptionNote = 'Daytime schedule designed to complete before 06:00 PM.';
      } else {
        exceptionNote = `District currently has ${allDistrictDestinations.length} verified places. Showing ${orderedStops.length} verified stops without cross-district borrowing.`;
      }
    }

    // --- STOP 1: 06:30 AM Early Morning Attraction ---
    if (orderedStops[0]) {
      const stop1 = orderedStops[0];
      const crowd = evaluateCrowd(stop1, dateStr, 7);
      const duration = Math.min(90, Math.max(60, stop1.recommendedDurationMinutes || 75));
      const endTimeMinutes = currentMinutes + duration;

      activities.push({
        timeWindow: `${formatMinutesToTime(currentMinutes)} - ${formatMinutesToTime(endTimeMinutes)}`,
        activityType: 'DESTINATION',
        title: stop1.name,
        nameTamil: stop1.tamilName,
        category: stop1.category,
        destinationId: stop1.id,
        district: stop1.district,
        locality: stop1.cityArea,
        latitude: stop1.coordinates.lat,
        longitude: stop1.coordinates.lng,
        durationMinutes: duration,
        travelBufferMinutes: 15,
        crowdLevel: crowd.crowdLevel,
        crowdPredictionType: crowd.predictionType,
        estimatedCostINR: stop1.estimatedCostINR.min,
        whyNowReason:
          stop1.category === 'temples'
            ? 'Scheduled at dawn (06:30 AM) to experience morning darshan before midday heat and temple sanctum closure.'
            : 'Pleasant cool morning temperature and peaceful golden hour lighting.',
        transportInfo: `Start point in ${stop1.cityArea}`,
        notes: stop1.rules[0] || 'Modest clothing recommended',
        googleMapsUrl: buildGoogleMapsUrl({
          name: stop1.name,
          locality: stop1.cityArea,
          district: stop1.district,
        }),
      });

      dayEstimatedCost += stop1.estimatedCostINR.min;
      currentMinutes = endTimeMinutes;
      lastLat = stop1.coordinates.lat;
      lastLng = stop1.coordinates.lng;
    }

    // --- MEAL 1: BREAKFAST (08:00 - 09:00 AM window) ---
    // Advance to at least 08:00 AM
    if (currentMinutes < 8 * 60) {
      currentMinutes = 8 * 60;
    }

    const bfRest = findNearestRestaurant(
      districtRestaurants,
      'breakfast',
      lastLat,
      lastLng,
      usedRestaurantIds,
      usedRestaurantNames,
      wantsVegetarian
    );

    const bfRestaurant = bfRest.chosen;
    if (bfRestaurant) {
      usedRestaurantIds.add(bfRestaurant.id);
      usedRestaurantNames.add(normalizeName(bfRestaurant.name));
    }

    const bfTransit = bfRestaurant
      ? estimateTravelTimeMinutes(bfRest.distanceKm)
      : { roadDistanceKm: 1, travelTimeMinutes: 10, bufferMinutes: 10 };
    totalKmTraveled += bfTransit.roadDistanceKm;

    const bfStart = currentMinutes + bfTransit.travelTimeMinutes;
    const bfDuration = 45;
    const bfEnd = bfStart + bfDuration;

    activities.push({
      timeWindow: `${formatMinutesToTime(bfStart)} - ${formatMinutesToTime(bfEnd)}`,
      activityType: 'MEAL',
      mealType: 'breakfast',
      title: bfRestaurant ? `Breakfast at ${bfRestaurant.name}` : `Breakfast Break in ${officialDistrict}`,
      nameTamil: bfRestaurant?.nameTamil,
      category: 'food',
      restaurantId: bfRestaurant?.id,
      district: officialDistrict,
      locality: bfRestaurant?.locality,
      latitude: bfRestaurant?.latitude,
      longitude: bfRestaurant?.longitude,
      durationMinutes: bfDuration,
      travelBufferMinutes: bfTransit.bufferMinutes,
      estimatedCostINR: bfRestaurant?.avgCostPerPerson || 120,
      whyNowReason: 'Energy replenishment window with authentic regional tiffin specialties.',
      notes: bfRestaurant?.signatureDishes?.join(', ') || 'Hot filter coffee and fresh tiffin',
      chosenRestaurant: bfRestaurant || undefined,
      alternativeRestaurants: bfRest.alternatives,
      googleMapsUrl: bfRestaurant
        ? buildGoogleMapsUrl({
            name: bfRestaurant.name,
            locality: bfRestaurant.locality,
            district: bfRestaurant.district,
          })
        : undefined,
    });

    dayEstimatedCost += bfRestaurant?.avgCostPerPerson || 120;
    currentMinutes = bfEnd;
    if (bfRestaurant) {
      lastLat = bfRestaurant.latitude;
      lastLng = bfRestaurant.longitude;
    }

    // --- STOP 2: 09:15 AM - 10:45 AM Exploration ---
    if (orderedStops[1]) {
      const stop2 = orderedStops[1];
      const dist = getDistanceKm(lastLat, lastLng, stop2.coordinates.lat, stop2.coordinates.lng);
      const transit = estimateTravelTimeMinutes(dist);
      totalKmTraveled += transit.roadDistanceKm;

      const start = currentMinutes + transit.travelTimeMinutes;
      const duration = Math.min(90, Math.max(60, stop2.recommendedDurationMinutes || 75));
      const end = start + duration;
      const crowd = evaluateCrowd(stop2, dateStr, 10);

      activities.push({
        timeWindow: `${formatMinutesToTime(start)} - ${formatMinutesToTime(end)}`,
        activityType: 'DESTINATION',
        title: stop2.name,
        nameTamil: stop2.tamilName,
        category: stop2.category,
        destinationId: stop2.id,
        district: stop2.district,
        locality: stop2.cityArea,
        latitude: stop2.coordinates.lat,
        longitude: stop2.coordinates.lng,
        durationMinutes: duration,
        travelBufferMinutes: transit.bufferMinutes,
        crowdLevel: crowd.crowdLevel,
        crowdPredictionType: crowd.predictionType,
        estimatedCostINR: stop2.estimatedCostINR.min,
        whyNowReason: 'Comfortable morning window coinciding with primary operating hours.',
        transportInfo: `Transit approx ${transit.roadDistanceKm} km (${transit.travelTimeMinutes} min)`,
        notes: stop2.accessibilityInfo,
        googleMapsUrl: buildGoogleMapsUrl({
          name: stop2.name,
          locality: stop2.cityArea,
          district: stop2.district,
        }),
      });

      dayEstimatedCost += stop2.estimatedCostINR.min;
      currentMinutes = end;
      lastLat = stop2.coordinates.lat;
      lastLng = stop2.coordinates.lng;
    }

    // --- STOP 3: 11:00 AM - 12:30 PM Pre-Lunch Site ---
    if (orderedStops[2]) {
      const stop3 = orderedStops[2];
      const dist = getDistanceKm(lastLat, lastLng, stop3.coordinates.lat, stop3.coordinates.lng);
      const transit = estimateTravelTimeMinutes(dist);
      totalKmTraveled += transit.roadDistanceKm;

      const start = currentMinutes + transit.travelTimeMinutes;
      const duration = Math.min(90, Math.max(60, stop3.recommendedDurationMinutes || 75));
      const end = start + duration;
      const crowd = evaluateCrowd(stop3, dateStr, 11);

      activities.push({
        timeWindow: `${formatMinutesToTime(start)} - ${formatMinutesToTime(end)}`,
        activityType: 'DESTINATION',
        title: stop3.name,
        nameTamil: stop3.tamilName,
        category: stop3.category,
        destinationId: stop3.id,
        district: stop3.district,
        locality: stop3.cityArea,
        latitude: stop3.coordinates.lat,
        longitude: stop3.coordinates.lng,
        durationMinutes: duration,
        travelBufferMinutes: transit.bufferMinutes,
        crowdLevel: crowd.crowdLevel,
        crowdPredictionType: crowd.predictionType,
        estimatedCostINR: stop3.estimatedCostINR.min,
        whyNowReason:
          stop3.category === 'temples'
            ? 'Visit scheduled before temple sanctum midday closure (12:30 PM).'
            : 'Indoor or sheltered cultural exploration during rising midday temperatures.',
        transportInfo: `Transit approx ${transit.roadDistanceKm} km`,
        notes: stop3.rules[0] || stop3.accessibilityInfo,
        googleMapsUrl: buildGoogleMapsUrl({
          name: stop3.name,
          locality: stop3.cityArea,
          district: stop3.district,
        }),
      });

      dayEstimatedCost += stop3.estimatedCostINR.min;
      currentMinutes = end;
      lastLat = stop3.coordinates.lat;
      lastLng = stop3.coordinates.lng;
    }

    // --- MEAL 2: LUNCH (12:30 - 02:00 PM window) ---
    // Snap to lunch window
    if (currentMinutes < 12 * 60 + 30) {
      currentMinutes = 12 * 60 + 30;
    }

    const lunchRest = findNearestRestaurant(
      districtRestaurants,
      'lunch',
      lastLat,
      lastLng,
      usedRestaurantIds,
      usedRestaurantNames,
      wantsVegetarian
    );

    const lunchRestaurant = lunchRest.chosen;
    if (lunchRestaurant) {
      usedRestaurantIds.add(lunchRestaurant.id);
      usedRestaurantNames.add(normalizeName(lunchRestaurant.name));
    }

    const lunchTransit = lunchRestaurant
      ? estimateTravelTimeMinutes(lunchRest.distanceKm)
      : { roadDistanceKm: 1.5, travelTimeMinutes: 12, bufferMinutes: 10 };
    totalKmTraveled += lunchTransit.roadDistanceKm;

    const lunchStart = currentMinutes + lunchTransit.travelTimeMinutes;
    const lunchDuration = 60;
    const lunchEnd = lunchStart + lunchDuration;

    activities.push({
      timeWindow: `${formatMinutesToTime(lunchStart)} - ${formatMinutesToTime(lunchEnd)}`,
      activityType: 'MEAL',
      mealType: 'lunch',
      title: lunchRestaurant ? `Lunch at ${lunchRestaurant.name}` : `Regional Lunch Feast (${officialDistrict})`,
      nameTamil: lunchRestaurant?.nameTamil,
      category: 'food',
      restaurantId: lunchRestaurant?.id,
      district: officialDistrict,
      locality: lunchRestaurant?.locality,
      latitude: lunchRestaurant?.latitude,
      longitude: lunchRestaurant?.longitude,
      durationMinutes: lunchDuration,
      travelBufferMinutes: lunchTransit.bufferMinutes,
      estimatedCostINR: lunchRestaurant?.avgCostPerPerson || 220,
      whyNowReason:
        'Midday rest and regional feast while temple sanctums are traditionally closed (12:30 - 04:00 PM).',
      notes: lunchRestaurant?.signatureDishes?.join(', ') || 'Full South Indian Meals on Banana Leaf',
      chosenRestaurant: lunchRestaurant || undefined,
      alternativeRestaurants: lunchRest.alternatives,
      googleMapsUrl: lunchRestaurant
        ? buildGoogleMapsUrl({
            name: lunchRestaurant.name,
            locality: lunchRestaurant.locality,
            district: lunchRestaurant.district,
          })
        : undefined,
    });

    dayEstimatedCost += lunchRestaurant?.avgCostPerPerson || 220;
    currentMinutes = Math.max(14 * 60, lunchEnd); // At least 02:00 PM
    if (lunchRestaurant) {
      lastLat = lunchRestaurant.latitude;
      lastLng = lunchRestaurant.longitude;
    }

    // --- STOP 4: 02:30 PM - 04:15 PM Afternoon Exploration ---
    if (orderedStops[3]) {
      const stop4 = orderedStops[3];
      const dist = getDistanceKm(lastLat, lastLng, stop4.coordinates.lat, stop4.coordinates.lng);
      const transit = estimateTravelTimeMinutes(dist);
      totalKmTraveled += transit.roadDistanceKm;

      const start = currentMinutes + transit.travelTimeMinutes;
      const duration = Math.min(90, Math.max(60, stop4.recommendedDurationMinutes || 75));
      const end = start + duration;
      const crowd = evaluateCrowd(stop4, dateStr, 15);

      activities.push({
        timeWindow: `${formatMinutesToTime(start)} - ${formatMinutesToTime(end)}`,
        activityType: 'DESTINATION',
        title: stop4.name,
        nameTamil: stop4.tamilName,
        category: stop4.category,
        destinationId: stop4.id,
        district: stop4.district,
        locality: stop4.cityArea,
        latitude: stop4.coordinates.lat,
        longitude: stop4.coordinates.lng,
        durationMinutes: duration,
        travelBufferMinutes: transit.bufferMinutes,
        crowdLevel: crowd.crowdLevel,
        crowdPredictionType: crowd.predictionType,
        estimatedCostINR: stop4.estimatedCostINR.min,
        whyNowReason: 'Optimal afternoon timing as indoor galleries and shaded gardens remain open.',
        transportInfo: `Transit approx ${transit.roadDistanceKm} km`,
        notes: stop4.accessibilityInfo,
        googleMapsUrl: buildGoogleMapsUrl({
          name: stop4.name,
          locality: stop4.cityArea,
          district: stop4.district,
        }),
      });

      dayEstimatedCost += stop4.estimatedCostINR.min;
      currentMinutes = end;
      lastLat = stop4.coordinates.lat;
      lastLng = stop4.coordinates.lng;
    }

    // --- STOP 5: 04:45 PM - 06:15 PM Sunset / Evening Re-opening ---
    if (orderedStops[4]) {
      const stop5 = orderedStops[4];
      const dist = getDistanceKm(lastLat, lastLng, stop5.coordinates.lat, stop5.coordinates.lng);
      const transit = estimateTravelTimeMinutes(dist);
      totalKmTraveled += transit.roadDistanceKm;

      const start = Math.max(16 * 60 + 30, currentMinutes + transit.travelTimeMinutes);
      const duration = Math.min(90, Math.max(60, stop5.recommendedDurationMinutes || 75));
      const end = start + duration;
      const crowd = evaluateCrowd(stop5, dateStr, 17);

      activities.push({
        timeWindow: `${formatMinutesToTime(start)} - ${formatMinutesToTime(end)}`,
        activityType: 'DESTINATION',
        title: stop5.name,
        nameTamil: stop5.tamilName,
        category: stop5.category,
        destinationId: stop5.id,
        district: stop5.district,
        locality: stop5.cityArea,
        latitude: stop5.coordinates.lat,
        longitude: stop5.coordinates.lng,
        durationMinutes: duration,
        travelBufferMinutes: transit.bufferMinutes,
        crowdLevel: crowd.crowdLevel,
        crowdPredictionType: crowd.predictionType,
        estimatedCostINR: stop5.estimatedCostINR.min,
        whyNowReason:
          stop5.category === 'temples'
            ? 'Temple sanctums reopen at 04:30 PM with atmospheric evening lamps and cooler stone pavements.'
            : 'Golden hour twilight breeze and picturesque sunset view.',
        transportInfo: `Transit approx ${transit.roadDistanceKm} km`,
        notes: stop5.rules[0] || 'Evening tranquil darshan',
        googleMapsUrl: buildGoogleMapsUrl({
          name: stop5.name,
          locality: stop5.cityArea,
          district: stop5.district,
        }),
      });

      dayEstimatedCost += stop5.estimatedCostINR.min;
      currentMinutes = end;
      lastLat = stop5.coordinates.lat;
      lastLng = stop5.coordinates.lng;
    }

    // --- EVENING TEA / SNACK STOP (06:30 - 07:15 PM) ---
    const teaStart = Math.max(18 * 60 + 15, currentMinutes + 10);
    const teaEnd = teaStart + 40;
    activities.push({
      timeWindow: `${formatMinutesToTime(teaStart)} - ${formatMinutesToTime(teaEnd)}`,
      activityType: 'REST',
      title: `Evening Filter Coffee & Cultural Stroll in ${officialDistrict}`,
      category: 'cultural',
      district: officialDistrict,
      durationMinutes: 40,
      travelBufferMinutes: 10,
      estimatedCostINR: 60,
      whyNowReason: 'Relaxed transition period enjoying local evening life and authentic South Indian kaapi.',
      notes: 'Piping hot filter coffee and regional evening savouries',
    });
    dayEstimatedCost += 60;
    currentMinutes = teaEnd;

    // --- MEAL 3: DINNER (07:30 - 08:45 PM window) ---
    const dinStart = Math.max(19 * 60 + 30, currentMinutes + 15);

    const dinRest = findNearestRestaurant(
      districtRestaurants,
      'dinner',
      lastLat,
      lastLng,
      usedRestaurantIds,
      usedRestaurantNames,
      wantsVegetarian
    );

    const dinRestaurant = dinRest.chosen;
    if (dinRestaurant) {
      usedRestaurantIds.add(dinRestaurant.id);
      usedRestaurantNames.add(normalizeName(dinRestaurant.name));
    }

    const dinTransit = dinRestaurant
      ? estimateTravelTimeMinutes(dinRest.distanceKm)
      : { roadDistanceKm: 1.5, travelTimeMinutes: 12, bufferMinutes: 10 };
    totalKmTraveled += dinTransit.roadDistanceKm;

    const dinDuration = 60;
    const dinEnd = Math.min(20 * 60 + 45, dinStart + dinDuration);

    activities.push({
      timeWindow: `${formatMinutesToTime(dinStart)} - ${formatMinutesToTime(dinEnd)}`,
      activityType: 'MEAL',
      mealType: 'dinner',
      title: dinRestaurant ? `Dinner at ${dinRestaurant.name}` : `Dinner in ${officialDistrict}`,
      nameTamil: dinRestaurant?.nameTamil,
      category: 'food',
      restaurantId: dinRestaurant?.id,
      district: officialDistrict,
      locality: dinRestaurant?.locality,
      latitude: dinRestaurant?.latitude,
      longitude: dinRestaurant?.longitude,
      durationMinutes: dinDuration,
      travelBufferMinutes: dinTransit.bufferMinutes,
      estimatedCostINR: dinRestaurant?.avgCostPerPerson || 200,
      whyNowReason: 'Concluding daily journey inside recommended 09:00 PM operating window.',
      notes: dinRestaurant?.signatureDishes?.join(', ') || 'Relaxing dinner and rest for next day',
      chosenRestaurant: dinRestaurant || undefined,
      alternativeRestaurants: dinRest.alternatives,
      googleMapsUrl: dinRestaurant
        ? buildGoogleMapsUrl({
            name: dinRestaurant.name,
            locality: dinRestaurant.locality,
            district: dinRestaurant.district,
          })
        : undefined,
    });

    dayEstimatedCost += dinRestaurant?.avgCostPerPerson || 200;

    days.push({
      dayNumber: dayIdx + 1,
      date: dateStr,
      focusArea: `${officialDistrict} - ${orderedStops.map((s) => s.name.split(' ')[0]).join(' & ') || 'Heritage & Culture'}`,
      summary: `Day ${dayIdx + 1}: ${orderedStops.length} verified stops | 3 authentic meals | ~${Math.round(totalKmTraveled)} km travel in ${officialDistrict}.`,
      activities,
      dayBudgetINR: dayEstimatedCost,
      placesCount: orderedStops.length,
      mealsCount: 3,
      approxDistanceKm: Math.round(totalKmTraveled),
      exceptionNote,
    });
  }

  return days;
}
