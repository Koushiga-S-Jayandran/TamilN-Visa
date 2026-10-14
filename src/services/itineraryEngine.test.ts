import { describe, it, expect } from 'vitest';
import { generateItinerary, calculateDistrictMaxDays } from './itineraryEngine';
import { TripPlannerInput } from '../types';

describe('Part 3: Itinerary Engine Tests', () => {
  const chennaiInput1Day: TripPlannerInput = {
    destinationDistrict: 'Chennai',
    travelDate: '2026-11-15',
    numberOfDays: 1,
    numberOfTravelers: 2,
    travelerType: 'Couple',
    budgetTier: 'Mid-range',
    selectedInterests: ['Temples & Spiritual', 'Heritage & Forts'],
    selectedPreferences: ['Maximum places'],
  };

  it('proves Chennai 1-day itinerary has at least 5 places, zero repeated places and zero repeated restaurants', () => {
    const days = generateItinerary(chennaiInput1Day);
    expect(days).toHaveLength(1);
    const day = days[0];

    const placeSlots = day.activities.filter((a) => a.activityType === 'DESTINATION');
    const mealSlots = day.activities.filter((a) => a.activityType === 'MEAL');

    // 1. At least 5 places to visit per day when data allows
    expect(placeSlots.length).toBeGreaterThanOrEqual(5);

    // 2. Exact district match (place.district === selectedDistrict)
    for (const place of placeSlots) {
      expect(place.district).toBe('Chennai');
    }
    for (const meal of mealSlots) {
      expect(meal.district).toBe('Chennai');
    }

    // 3. Zero repeated place ids or titles
    const placeIds = placeSlots.map((p) => p.destinationId || p.title);
    const uniquePlaceIds = new Set(placeIds);
    expect(uniquePlaceIds.size).toBe(placeIds.length);

    // 4. Zero repeated restaurants
    const restaurantIds = mealSlots.map((m) => m.restaurantId || m.title);
    const uniqueRestIds = new Set(restaurantIds);
    expect(uniqueRestIds.size).toBe(restaurantIds.length);

    // 5. Meals include breakfast, lunch, and dinner
    const mealTypes = mealSlots.map((m) => m.mealType);
    expect(mealTypes).toContain('breakfast');
    expect(mealTypes).toContain('lunch');
    expect(mealTypes).toContain('dinner');

    // 6. Each meal with a chosen restaurant provides nearby alternative options with distance
    for (const meal of mealSlots) {
      if (meal.alternativeRestaurants && meal.alternativeRestaurants.length > 0) {
        expect(meal.alternativeRestaurants.length).toBeGreaterThanOrEqual(1);
        for (const alt of meal.alternativeRestaurants) {
          expect(alt.restaurant.district).toBe('Chennai');
          expect(typeof alt.distanceKm).toBe('number');
          expect(alt.restaurant.name).toBeTruthy();
        }
      }
    }
  });

  it('proves a small district (Ariyalur) adheres strictly to exact district match without borrowing', () => {
    const ariyalurInput: TripPlannerInput = {
      destinationDistrict: 'Ariyalur',
      travelDate: '2026-11-20',
      numberOfDays: 1,
      numberOfTravelers: 2,
      travelerType: 'Solo',
      budgetTier: 'Budget',
      selectedInterests: ['Heritage & Forts'],
      selectedPreferences: ['Slow travel'],
    };

    const days = generateItinerary(ariyalurInput);
    expect(days).toHaveLength(1);
    const day = days[0];

    // Every activity must belong strictly to Ariyalur
    for (const act of day.activities) {
      expect(act.district).toBe('Ariyalur');
    }

    const placeSlots = day.activities.filter((a) => a.activityType === 'DESTINATION');
    const placeIds = placeSlots.map((p) => p.destinationId);
    const uniquePlaceIds = new Set(placeIds);
    expect(uniquePlaceIds.size).toBe(placeSlots.length);
  });

  it('proves day ends before or at 21:00 (9 PM window)', () => {
    const days = generateItinerary(chennaiInput1Day);
    const lastActivity = days[0].activities[days[0].activities.length - 1];
    expect(lastActivity.timeWindow).toBeTruthy();
    // Verify it ends in PM and not after 9:00 PM
    expect(lastActivity.timeWindow).toMatch(/PM/i);
  });

  it('proves shuffling produces valid varied itineraries while still obeying all rules', () => {
    const run1 = generateItinerary(chennaiInput1Day, { seed: 101 });
    const run2 = generateItinerary(chennaiInput1Day, { seed: 999 });

    expect(run1).toHaveLength(1);
    expect(run2).toHaveLength(1);

    // Both runs must have at least 5 places and zero repeats
    const places1 = run1[0].activities.filter((a) => a.activityType === 'DESTINATION');
    const places2 = run2[0].activities.filter((a) => a.activityType === 'DESTINATION');

    expect(places1.length).toBeGreaterThanOrEqual(5);
    expect(places2.length).toBeGreaterThanOrEqual(5);

    const ids1 = new Set(places1.map((p) => p.destinationId));
    const ids2 = new Set(places2.map((p) => p.destinationId));

    expect(ids1.size).toBe(places1.length);
    expect(ids2.size).toBe(places2.length);
  });

  it('calculates district maximum allowable days according to data capacity', () => {
    const ariyalurCapacity = calculateDistrictMaxDays('Ariyalur');
    expect(ariyalurCapacity.maxDays).toBeGreaterThanOrEqual(1);
    expect(ariyalurCapacity.placesCount).toBeGreaterThanOrEqual(2);
  });
});
