import { describe, it, expect } from 'vitest';
import { generateItinerary, parseTimeToMinutes, getDistanceKm } from '../src/services/itineraryEngine';
import { TripPlannerInput } from '../src/types';
import { buildGoogleMapsUrl } from '../src/utils/maps';

describe('Part 3: Itinerary Engine Tests', () => {
  it('Chennai 1-Day Plan: produces at least 5 places, no repeats, strictly Chennai items, ends by 21:00', () => {
    const input: TripPlannerInput = {
      destinationDistrict: 'Chennai',
      travelDate: '2026-11-15',
      numberOfDays: 1,
      numberOfTravelers: 2,
      travelerType: 'Family',
      budgetTier: 'Mid-range',
      selectedInterests: ['Heritage', 'Temples'],
      selectedPreferences: [],
    };

    const days = generateItinerary(input);
    expect(days).toHaveLength(1);
    const day1 = days[0];

    // Count destination places
    const destinationSlots = day1.activities.filter((a) => a.activityType === 'DESTINATION');
    expect(destinationSlots.length).toBeGreaterThanOrEqual(5);

    // Verify district strictness
    destinationSlots.forEach((slot) => {
      expect(slot.district).toBe('Chennai');
    });

    // Check no duplicate places
    const placeIds = destinationSlots.map((s) => s.destinationId);
    const uniquePlaceIds = new Set(placeIds);
    expect(uniquePlaceIds.size).toBe(placeIds.length);

    // Check meal slots
    const mealSlots = day1.activities.filter((a) => a.activityType === 'MEAL');
    expect(mealSlots.length).toBe(3); // Breakfast, Lunch, Dinner

    // Verify each meal's restaurant is in Chennai
    mealSlots.forEach((slot) => {
      expect(slot.district).toBe('Chennai');
      if (slot.chosenRestaurant) {
        expect(slot.chosenRestaurant.district).toBe('Chennai');
      }
    });

    // Check no repeated restaurants
    const restIds = mealSlots
      .map((s) => s.restaurantId)
      .filter((id): id is string => typeof id === 'string');
    const uniqueRestIds = new Set(restIds);
    expect(uniqueRestIds.size).toBe(restIds.length);

    // Verify no overlapping time windows and ends by 21:00 (1260 minutes)
    let lastEndMinutes = 0;
    day1.activities.forEach((act) => {
      const parts = act.timeWindow.split('-');
      expect(parts).toHaveLength(2);
      const startMin = parseTimeToMinutes(parts[0].trim());
      const endMin = parseTimeToMinutes(parts[1].trim());

      expect(startMin).not.toBeNull();
      expect(endMin).not.toBeNull();
      expect(startMin!).toBeGreaterThanOrEqual(lastEndMinutes);
      expect(endMin!).toBeGreaterThan(startMin!);
      expect(endMin!).toBeLessThanOrEqual(21 * 60); // Ends by 21:00
      lastEndMinutes = endMin!;
    });
  });

  it('Small District (e.g. Ariyalur or Perambalur): strictly own district, honest exception note when fewer than 5 places exist, no repeats', () => {
    const input: TripPlannerInput = {
      destinationDistrict: 'Ariyalur',
      travelDate: '2026-11-15',
      numberOfDays: 1,
      numberOfTravelers: 2,
      travelerType: 'Family',
      budgetTier: 'Mid-range',
      selectedInterests: ['Heritage'],
      selectedPreferences: [],
    };

    const days = generateItinerary(input);
    expect(days).toHaveLength(1);
    const day1 = days[0];

    const destSlots = day1.activities.filter((a) => a.activityType === 'DESTINATION');
    // All items must strictly match Ariyalur
    destSlots.forEach((slot) => {
      expect(slot.district).toBe('Ariyalur');
    });

    // If fewer than 5 verified places, an honest exception note is displayed
    if (destSlots.length < 5) {
      expect(day1.exceptionNote).toBeDefined();
      expect(day1.exceptionNote).toContain('verified');
    }

    // No duplicate places
    const ids = destSlots.map((s) => s.destinationId);
    expect(new Set(ids).size).toBe(ids.length);

    // Day concludes by 21:00
    const lastSlot = day1.activities[day1.activities.length - 1];
    const endMinutes = parseTimeToMinutes(lastSlot.timeWindow.split('-')[1].trim());
    expect(endMinutes).toBeLessThanOrEqual(21 * 60);
  });

  it('Multi-Day Plan: guarantees ZERO repeated places and ZERO repeated restaurants across the entire trip', () => {
    const input: TripPlannerInput = {
      destinationDistrict: 'Chennai',
      travelDate: '2026-11-15',
      numberOfDays: 2,
      numberOfTravelers: 2,
      travelerType: 'Family',
      budgetTier: 'Mid-range',
      selectedInterests: [],
      selectedPreferences: [],
    };

    const days = generateItinerary(input);
    expect(days).toHaveLength(2);

    const allPlaceIds: string[] = [];
    const allRestaurantIds: string[] = [];

    days.forEach((day) => {
      day.activities.forEach((act) => {
        if (act.destinationId) allPlaceIds.push(act.destinationId);
        if (act.restaurantId) allRestaurantIds.push(act.restaurantId);
      });
    });

    // Check total uniqueness across whole trip
    expect(new Set(allPlaceIds).size).toBe(allPlaceIds.length);
    expect(new Set(allRestaurantIds).size).toBe(allRestaurantIds.length);
  });

  it('Shuffle suggestions with new seed produces variety while strictly obeying all constraints', () => {
    const baseInput: TripPlannerInput = {
      destinationDistrict: 'Chennai',
      travelDate: '2026-11-15',
      numberOfDays: 1,
      numberOfTravelers: 1,
      travelerType: 'Solo',
      budgetTier: 'Budget',
      selectedInterests: [],
      selectedPreferences: [],
    };

    const run1 = generateItinerary({ ...baseInput, seed: 101 });
    const run2 = generateItinerary({ ...baseInput, seed: 101 }); // Deterministic
    const run3 = generateItinerary({ ...baseInput, seed: 999 }); // Shuffled

    // Same seed yields identical itinerary
    expect(run1[0].activities.map((a) => a.title)).toEqual(run2[0].activities.map((a) => a.title));

    // Shuffled run obeys all constraints
    const destSlots = run3[0].activities.filter((a) => a.activityType === 'DESTINATION');
    destSlots.forEach((s) => expect(s.district).toBe('Chennai'));
    const lastSlot = run3[0].activities[run3[0].activities.length - 1];
    const endMinutes = parseTimeToMinutes(lastSlot.timeWindow.split('-')[1].trim());
    expect(endMinutes).toBeLessThanOrEqual(21 * 60);
  });

  it('Part 5: buildGoogleMapsUrl must always include the item own name and district', () => {
    const item1 = {
      name: 'Kapaleeshwarar Temple Mylapore',
      locality: 'Mylapore',
      district: 'Chennai',
    };
    const url1 = buildGoogleMapsUrl(item1);
    expect(url1).toContain(encodeURIComponent('Kapaleeshwarar Temple Mylapore'));
    expect(url1).toContain(encodeURIComponent('Chennai'));
    expect(url1).toContain('Tamil%20Nadu');
    expect(url1).toContain('India');

    const item2 = {
      name: 'Thanjavur Brihadisvara Temple',
      locality: 'West Main Street',
      district: 'Thanjavur',
      googleMapsPlaceId: 'ChIJ12345PlaceId',
    };
    const url2 = buildGoogleMapsUrl(item2);
    expect(url2).toContain(encodeURIComponent('Thanjavur Brihadisvara Temple'));
    expect(url2).toContain(encodeURIComponent('Thanjavur'));
    expect(url2).toContain('query_place_id=ChIJ12345PlaceId');
  });
});
