import { ActivitySlot, ItineraryDay, TripPlannerInput, Destination } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';
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
 * TAMIZN VISA - Intelligent Day-by-Day Itinerary Engine
 * Operating Window: 06:00 AM - 09:00 PM
 * Implements crowd-aware scheduling, realistic travel times, and structured meal windows.
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

  // 1. Filter destinations by district and user interests
  let availableDestinations = DESTINATIONS_DATA.filter(
    (d) => d.district.toLowerCase() === destinationDistrict.toLowerCase()
  );

  // If few destinations directly in this district, pull nearby regional destinations
  if (availableDestinations.length < 3) {
    const fallbackDestinations = DESTINATIONS_DATA.filter(
      (d) => d.district.toLowerCase() !== destinationDistrict.toLowerCase()
    ).slice(0, 4);
    availableDestinations = [...availableDestinations, ...fallbackDestinations];
  }

  // Find district food places
  const districtFood = FOOD_PLACES_DATA.filter(
    (f) => f.district.toLowerCase() === destinationDistrict.toLowerCase()
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

    // Pick destinations for this day
    const dayStartOffset = (dayIdx * placesPerDay) % Math.max(1, availableDestinations.length);
    const dayDestinations: Destination[] = [];
    for (let p = 0; p < placesPerDay; p++) {
      const dest = availableDestinations[(dayStartOffset + p) % availableDestinations.length];
      if (dest && !dayDestinations.some((d) => d.id === dest.id)) {
        dayDestinations.push(dest);
      }
    }

    // Sort destinations crowd-first: temples/sacred/crowded spots first in the early morning
    dayDestinations.sort((a, b) => {
      if (a.category === 'temples') return -1;
      if (b.category === 'temples') return 1;
      return 0;
    });

    // 06:30 AM - Morning Departure & Morning Activity 1
    const morningDest = dayDestinations[0] || availableDestinations[0];
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

    // 08:15 - 09:00 AM: Authentic South Indian Breakfast Break
    const morningEatery = districtFood[0] || {
      name: `Traditional Tiffin Mess in ${morningDest.district}`,
      specialtyDishes: ['Ghee Roast Dosa', 'Piping Hot Filter Coffee', 'Soft Idli'],
      avgCostPerPersonINR: 120,
    };

    activities.push({
      timeWindow: '08:15 - 09:00 AM',
      activityType: 'MEAL',
      title: `Breakfast at ${morningEatery.name}`,
      category: 'food',
      durationMinutes: 45,
      travelBufferMinutes: 15,
      estimatedCostINR: morningEatery.avgCostPerPersonINR,
      whyNowReason: 'Energy replenishment break after early morning temple/outdoor exploration.',
      notes: `Recommended dish: ${morningEatery.specialtyDishes[0]}`,
    });
    dayEstimatedCost += morningEatery.avgCostPerPersonINR;

    // 09:45 AM - 12:00 PM: Midday Heritage or Nature Exploration
    const midDest = dayDestinations[1] || availableDestinations[1 % availableDestinations.length];
    const midCrowd = evaluateCrowd(midDest, dateStr, 11);
    const dist1 = getDistanceKm(
      morningDest.coordinates.lat,
      morningDest.coordinates.lng,
      midDest.coordinates.lat,
      midDest.coordinates.lng
    );

    activities.push({
      timeWindow: '09:45 AM - 12:00 PM',
      activityType: 'DESTINATION',
      title: midDest.name,
      category: midDest.category,
      destinationId: midDest.id,
      district: midDest.district,
      durationMinutes: 120,
      travelBufferMinutes: Math.max(25, Math.round(dist1 * 3)),
      crowdLevel: midCrowd.crowdLevel,
      crowdPredictionType: midCrowd.predictionType,
      estimatedCostINR: midDest.estimatedCostINR.min || 40,
      whyNowReason: 'Coincides with primary museum/heritage complex visiting hours before midday closure.',
      transportInfo: `Approx ${dist1} km transfer via main highway`,
      notes: midDest.accessibilityInfo,
    });
    dayEstimatedCost += midDest.estimatedCostINR.min || 40;

    // 12:30 - 02:00 PM: Regional Feast & Rest Break
    const lunchEatery = districtFood[1] || districtFood[0] || {
      name: `Authentic Meals Mess (${destinationDistrict})`,
      specialtyDishes: ['South Indian Full Meals on Banana Leaf', 'Rasam & Payasam'],
      avgCostPerPersonINR: 200,
    };

    activities.push({
      timeWindow: '12:30 - 02:00 PM',
      activityType: 'MEAL',
      title: `Traditional Lunch at ${lunchEatery.name}`,
      category: 'food',
      durationMinutes: 75,
      travelBufferMinutes: 15,
      estimatedCostINR: lunchEatery.avgCostPerPersonINR,
      whyNowReason: 'Avoids intense midday sun when many Tamil Nadu temple sanctums are closed (12:30 - 04:00 PM).',
      notes: `Authentic regional menu: ${lunchEatery.specialtyDishes.join(', ')}`,
    });
    dayEstimatedCost += lunchEatery.avgCostPerPersonINR;

    // Afternoon / Evening Activity
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
        travelBufferMinutes: 30,
        crowdLevel: eveCrowd.crowdLevel,
        crowdPredictionType: eveCrowd.predictionType,
        estimatedCostINR: eveDest.estimatedCostINR.min || 25,
        whyNowReason: 'Optimal golden hour lighting and cooler breezes across hill/coastal sights.',
        transportInfo: 'Local Auto / Bus',
        notes: eveDest.bestVisitingTime,
      });
      dayEstimatedCost += eveDest.estimatedCostINR.min || 25;
    }

    // 05:45 - 06:30 PM: Evening Kaapi & Cultural Walk
    activities.push({
      timeWindow: '05:45 - 06:30 PM',
      activityType: 'REST',
      title: 'Evening Kaapi (Filter Coffee) & Local Bazaar Stroll',
      category: 'cultural',
      durationMinutes: 45,
      travelBufferMinutes: 10,
      estimatedCostINR: 60,
      whyNowReason: 'Relaxed transition period soaking in local town evening culture.',
      notes: 'Enjoy hot banana roast bajji or piping filter coffee',
    });
    dayEstimatedCost += 60;

    // 07:30 - 09:00 PM: Evening Dinner & Day Wrap
    activities.push({
      timeWindow: '07:30 - 08:45 PM',
      activityType: 'MEAL',
      title: 'Dinner & Journey Recap',
      category: 'food',
      durationMinutes: 75,
      estimatedCostINR: 200,
      whyNowReason: 'Concluding daily travel inside recommended 09:00 PM safety window.',
      notes: 'Prepare overnight rest or review saved offline route',
    });
    dayEstimatedCost += 200;

    days.push({
      dayNumber: dayIdx + 1,
      date: dateStr,
      focusArea: `${destinationDistrict} - ${dayDestinations.map((d) => d.name.split(' ')[0]).join(' & ')}`,
      summary: `Day ${dayIdx + 1} focuses on balanced heritage, crowd-optimized morning darshan, authentic culinary stops, and smooth transit.`,
      activities,
      dayBudgetINR: dayEstimatedCost,
    });
  }

  return days;
}
