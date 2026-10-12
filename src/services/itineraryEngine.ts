import { ActivitySlot, ItineraryDay, TripPlannerInput, Destination } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';
import { TN_DISTRICTS } from '../config/appConfig';
import { evaluateCrowd } from './crowdEngine';

/**
 * Calculate geographical distance between coordinates (Haversine Formula) in KM
 */
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of Earth in km
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
 * Map user selected or search alias to the official Tamil Nadu district
 */
export function getOfficialDistrict(inputDistrict: string): string {
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
 * TAMIZN VISA - Day-by-Day Itinerary Engine
 * Operating Window: 06:00 AM - 09:00 PM
 * ENFORCES STRICT ZERO-BORROWING DISTRICT ISOLATION:
 * place.district === selectedDistrict (exact match).
 * If a district has fewer places than a trip needs, generates fewer stops.
 * Never borrows from another district.
 */
export function generateItinerary(input: TripPlannerInput): ItineraryDay[] {
  const {
    destinationDistrict,
    travelDate,
    numberOfDays,
    travelerType,
    budgetTier,
    selectedInterests,
    selectedPreferences,
  } = input;

  const officialDistrict = getOfficialDistrict(destinationDistrict);

  // 1. STRICT FILTERING: place.district === selectedDistrict (exact match, NO borrowing, NO cross-district fallbacks)
  const availableDestinations = DESTINATIONS_DATA.filter(
    (d) => d.district === officialDistrict
  );

  // Check if requested geographical features (like beach) are unavailable in this district
  const wantsBeach = selectedInterests.some((i) => i.toLowerCase().includes('beach'));
  const hasBeach = availableDestinations.some((d) => d.category === 'beaches');
  const missingBeachNote =
    wantsBeach && !hasBeach
      ? ` Note: Beach experiences are not available in ${officialDistrict}.`
      : '';

  // Find district food places (exact match only)
  const districtFood = FOOD_PLACES_DATA.filter(
    (f) => f.district === officialDistrict
  );

  const avoidCrowds = selectedPreferences.includes('Avoid crowds');
  const isRelaxed = selectedPreferences.includes('Slow travel') || travelerType === 'Senior-friendly';
  const finishEarly = selectedPreferences.includes('Finish before 6 PM');

  const days: ItineraryDay[] = [];
  const baseDate = new Date(travelDate || new Date().toISOString().split('T')[0]);

  // Destination allocation per day
  const placesPerDay = isRelaxed ? 2 : 3;

  for (let dayIdx = 0; dayIdx < numberOfDays; dayIdx++) {
    const currentDayDate = new Date(baseDate);
    currentDayDate.setDate(baseDate.getDate() + dayIdx);
    const dateStr = currentDayDate.toISOString().split('T')[0];

    const activities: ActivitySlot[] = [];
    let dayEstimatedCost = 0;

    // Allocate available distinct places strictly belonging to this district without cross-district borrowing
    const dayDestinations = availableDestinations.slice(
      dayIdx * placesPerDay,
      (dayIdx + 1) * placesPerDay
    );

    // Sort destinations crowd-first: temples/sacred/crowded spots first in the early morning
    dayDestinations.sort((a, b) => {
      if (a.category === 'temples') return -1;
      if (b.category === 'temples') return 1;
      return 0;
    });

    // 06:30 AM - Morning Activity 1
    if (dayDestinations[0]) {
      const morningDest = dayDestinations[0];
      const morningCrowd = evaluateCrowd(morningDest, dateStr, 7);

      activities.push({
        timeWindow: '06:30 - 08:00 AM',
        activityType: 'DESTINATION',
        title: morningDest.name,
        category: morningDest.category,
        destinationId: morningDest.id,
        district: morningDest.district,
        durationMinutes: 90,
        travelBufferMinutes: 20,
        crowdLevel: morningCrowd.crowdLevel,
        crowdPredictionType: morningCrowd.predictionType,
        estimatedCostINR: morningDest.estimatedCostINR.min,
        whyNowReason:
          avoidCrowds || morningDest.category === 'temples'
            ? 'Scheduled early morning to avoid peak tourist coach arrival and afternoon queues.'
            : 'Ideal tranquil lighting and pleasant morning temperature.',
        transportInfo: 'Local Auto / Taxi or morning state bus',
        notes: morningDest.rules[0] || 'Modest clothing recommended',
      });
      dayEstimatedCost += morningDest.estimatedCostINR.min;
    } else {
      activities.push({
        timeWindow: '06:30 - 08:00 AM',
        activityType: 'REST',
        title: `Morning Heritage Walk in ${officialDistrict}`,
        category: 'cultural',
        district: officialDistrict,
        durationMinutes: 90,
        travelBufferMinutes: 10,
        estimatedCostINR: 0,
        whyNowReason: 'Relaxed morning stroll absorbing the peaceful local atmosphere.',
        notes: 'Explore tranquil streets and traditional architecture',
      });
    }

    // 08:15 - 09:00 AM: Authentic South Indian Breakfast Break
    const morningEatery = districtFood[0] || {
      name: `Traditional Tiffin Mess in ${officialDistrict}`,
      specialtyDishes: ['Ghee Roast Dosa', 'Piping Hot Filter Coffee', 'Soft Idli'],
      avgCostPerPersonINR: 120,
    };

    activities.push({
      timeWindow: '08:15 - 09:00 AM',
      activityType: 'MEAL',
      title: `Breakfast at ${morningEatery.name}`,
      category: 'food',
      district: officialDistrict,
      durationMinutes: 45,
      travelBufferMinutes: 15,
      estimatedCostINR: morningEatery.avgCostPerPersonINR,
      whyNowReason: 'Energy replenishment break with authentic local breakfast specialties.',
      notes: `Recommended dish: ${morningEatery.specialtyDishes[0]}`,
    });
    dayEstimatedCost += morningEatery.avgCostPerPersonINR;

    // 09:45 AM - 12:00 PM: Midday Exploration
    if (dayDestinations[1]) {
      const midDest = dayDestinations[1];
      const midCrowd = evaluateCrowd(midDest, dateStr, 11);
      const dist1 = dayDestinations[0]
        ? getDistanceKm(
            dayDestinations[0].coordinates.lat,
            dayDestinations[0].coordinates.lng,
            midDest.coordinates.lat,
            midDest.coordinates.lng
          )
        : 5;

      activities.push({
        timeWindow: '09:45 AM - 12:00 PM',
        activityType: 'DESTINATION',
        title: midDest.name,
        category: midDest.category,
        destinationId: midDest.id,
        district: midDest.district,
        durationMinutes: 120,
        travelBufferMinutes: Math.max(20, Math.round(dist1 * 3)),
        crowdLevel: midCrowd.crowdLevel,
        crowdPredictionType: midCrowd.predictionType,
        estimatedCostINR: midDest.estimatedCostINR.min || 40,
        whyNowReason: 'Coincides with primary visiting hours before midday sanctum closure.',
        transportInfo: `Approx ${dist1} km transfer within ${officialDistrict}`,
        notes: midDest.accessibilityInfo,
      });
      dayEstimatedCost += midDest.estimatedCostINR.min || 40;
    } else {
      activities.push({
        timeWindow: '09:45 AM - 12:00 PM',
        activityType: 'REST',
        title: `Local Craft & Market Exploration in ${officialDistrict}`,
        category: 'cultural',
        district: officialDistrict,
        durationMinutes: 120,
        travelBufferMinutes: 15,
        estimatedCostINR: 0,
        whyNowReason: 'Immersive exploration of local artisan bazaars and regional specialties.',
        notes: 'Discover authentic handicrafts and agricultural produce',
      });
    }

    // 12:30 - 02:00 PM: Regional Feast & Rest Break
    const lunchEatery = districtFood[1] || districtFood[0] || {
      name: `Authentic Meals Mess (${officialDistrict})`,
      specialtyDishes: ['South Indian Full Meals on Banana Leaf', 'Rasam & Payasam'],
      avgCostPerPersonINR: 200,
    };

    activities.push({
      timeWindow: '12:30 - 02:00 PM',
      activityType: 'MEAL',
      title: `Traditional Lunch at ${lunchEatery.name}`,
      category: 'food',
      district: officialDistrict,
      durationMinutes: 75,
      travelBufferMinutes: 15,
      estimatedCostINR: lunchEatery.avgCostPerPersonINR,
      whyNowReason: 'Avoids midday heat when many temple sanctums are traditionally closed (12:30 - 04:00 PM).',
      notes: `Authentic regional menu: ${lunchEatery.specialtyDishes.join(', ')}`,
    });
    dayEstimatedCost += lunchEatery.avgCostPerPersonINR;

    // Afternoon / Evening Activity (Only if destinations exist, otherwise generate fewer stops without borrowing)
    if (!finishEarly && dayDestinations[2]) {
      const eveDest = dayDestinations[2];
      const eveCrowd = evaluateCrowd(eveDest, dateStr, 17);

      activities.push({
        timeWindow: '03:45 - 05:45 PM',
        activityType: 'DESTINATION',
        title: eveDest.name,
        category: eveDest.category,
        destinationId: eveDest.id,
        district: eveDest.district,
        durationMinutes: 105,
        travelBufferMinutes: 25,
        crowdLevel: eveCrowd.crowdLevel,
        crowdPredictionType: eveCrowd.predictionType,
        estimatedCostINR: eveDest.estimatedCostINR.min || 25,
        whyNowReason: 'Optimal golden hour lighting and pleasant evening breeze.',
        transportInfo: 'Local Auto / Bus',
        notes: eveDest.bestVisitingTime,
      });
      dayEstimatedCost += eveDest.estimatedCostINR.min || 25;
    }

    // 05:45 - 06:30 PM: Evening Kaapi & Cultural Walk
    activities.push({
      timeWindow: '05:45 - 06:30 PM',
      activityType: 'REST',
      title: `Evening Kaapi & Town Stroll in ${officialDistrict}`,
      category: 'cultural',
      district: officialDistrict,
      durationMinutes: 45,
      travelBufferMinutes: 10,
      estimatedCostINR: 60,
      whyNowReason: 'Relaxed transition period soaking in local evening life.',
      notes: 'Enjoy piping hot filter coffee and regional evening snacks',
    });
    dayEstimatedCost += 60;

    // 07:30 - 08:45 PM: Evening Dinner
    activities.push({
      timeWindow: '07:30 - 08:45 PM',
      activityType: 'MEAL',
      title: `Dinner in ${officialDistrict}`,
      category: 'food',
      district: officialDistrict,
      durationMinutes: 75,
      estimatedCostINR: 180,
      whyNowReason: 'Concluding daily journey inside recommended 09:00 PM operating window.',
      notes: 'Rest and prepare for the next leg of your journey',
    });
    dayEstimatedCost += 180;

    days.push({
      dayNumber: dayIdx + 1,
      date: dateStr,
      focusArea: `${officialDistrict}${dayDestinations.length > 0 ? ' - ' + dayDestinations.map((d) => d.name.split(' ')[0]).join(' & ') : ''}`,
      summary: `Day ${dayIdx + 1} provides a balanced, realistic itinerary exclusively in ${officialDistrict} with genuine local culture and time buffers.${missingBeachNote}`,
      activities,
      dayBudgetINR: dayEstimatedCost,
    });
  }

  return days;
}
