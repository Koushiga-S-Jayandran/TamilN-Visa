import { ActivitySlot, ItineraryDay } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { DayWeatherForecast } from './weatherService';

export interface WeatherPlanBResult {
  hasHazard: boolean;
  hazardType: 'RAIN' | 'HEAT' | 'BOTH' | 'NONE';
  hazardDescription: string;
  affectedSlotIndices: number[];
  adjustedActivities: ActivitySlot[];
  indoorAlternativesUsed: { originalName: string; replacementName: string; reason: string }[];
}

/**
 * Checks whether an activity slot is an outdoor venue vulnerable to rain or midday heat
 */
function isOutdoorActivity(slot: ActivitySlot): boolean {
  if (slot.activityType !== 'DESTINATION') return false;
  const category = (slot.category || '').toLowerCase();
  const title = slot.title.toLowerCase();

  // Waterfalls, viewpoints, dams, hills, beaches, parks
  if (
    category.includes('hill') ||
    category.includes('beach') ||
    category.includes('nature') ||
    title.includes('falls') ||
    title.includes('beach') ||
    title.includes('dam') ||
    title.includes('park') ||
    title.includes('peak') ||
    title.includes('view') ||
    title.includes('valley') ||
    title.includes('lake')
  ) {
    return true;
  }

  return false;
}

/**
 * Checks whether the time window falls within peak midday heat hours (11:30 AM - 03:30 PM)
 */
function isMiddayTimeWindow(timeWindow: string): boolean {
  const tw = timeWindow.toLowerCase();
  return (
    tw.includes('11:30') ||
    tw.includes('12:00') ||
    tw.includes('12:30') ||
    tw.includes('01:00') ||
    tw.includes('01:30') ||
    tw.includes('02:00') ||
    tw.includes('02:30') ||
    tw.includes('03:00') ||
    tw.includes('03:30') ||
    tw.includes('afternoon') ||
    tw.includes('midday')
  );
}

/**
 * Generate Plan B (Weather Adjusted) for a specific day
 * Rebuilds ONLY the affected time slots when rain >= 60% or heat >= 36°C
 */
export function generateDayPlanB(
  day: ItineraryDay,
  district: string,
  forecast?: DayWeatherForecast | null
): WeatherPlanBResult {
  if (!forecast) {
    return {
      hasHazard: false,
      hazardType: 'NONE',
      hazardDescription: '',
      affectedSlotIndices: [],
      adjustedActivities: [...day.activities],
      indoorAlternativesUsed: [],
    };
  }

  const isRain = forecast.rainProbabilityPercent >= 60;
  const isHeat = forecast.tempMaxC >= 36;

  if (!isRain && !isHeat) {
    return {
      hasHazard: false,
      hazardType: 'NONE',
      hazardDescription: 'Weather conditions are favorable for all scheduled stops.',
      affectedSlotIndices: [],
      adjustedActivities: [...day.activities],
      indoorAlternativesUsed: [],
    };
  }

  const hazardType: 'RAIN' | 'HEAT' | 'BOTH' = isRain && isHeat ? 'BOTH' : isRain ? 'RAIN' : 'HEAT';
  const hazardDescription =
    hazardType === 'BOTH'
      ? `High precipitation (${forecast.rainProbabilityPercent}%) and extreme tropical heat (${forecast.tempMaxC}°C) predicted.`
      : hazardType === 'RAIN'
      ? `Heavy rain probability (${forecast.rainProbabilityPercent}%) predicted. Slippery stone pavements and wet roads expected.`
      : `Intense midday heat (${forecast.tempMaxC}°C) predicted. Open granite stone prakarams get excessively hot.`;

  // Get all verified places strictly within this destination district
  const districtPlaces = DESTINATIONS_DATA.filter((d) => d.district === district);

  // Preferred indoor / sheltered places: Temples with covered mandapams, museums, palaces, indoor halls
  const indoorCandidates = districtPlaces.filter((d) => {
    const cat = d.category.toLowerCase();
    const desc = d.description.toLowerCase();
    const name = d.name.toLowerCase();

    // Avoid outdoor peaks and beaches
    if (cat.includes('beach') || cat.includes('hill') || name.includes('falls') || name.includes('beach')) {
      return false;
    }

    // Heritage halls, museums, covered mandapams, temples
    return (
      cat.includes('heritage') ||
      cat.includes('temple') ||
      cat.includes('culture') ||
      desc.includes('museum') ||
      desc.includes('mandapam') ||
      desc.includes('sanctuary') ||
      desc.includes('corridor')
    );
  });

  const existingDestIds = new Set(
    day.activities.map((a) => a.destinationId).filter((id): id is string => Boolean(id))
  );

  const affectedSlotIndices: number[] = [];
  const indoorAlternativesUsed: { originalName: string; replacementName: string; reason: string }[] = [];
  const adjustedActivities: ActivitySlot[] = day.activities.map((slot, idx) => {
    // Only adjust DESTINATION slots
    if (slot.activityType !== 'DESTINATION') {
      return { ...slot };
    }

    let needsAdjustment = false;
    let reason = '';

    if (isRain && isOutdoorActivity(slot)) {
      needsAdjustment = true;
      reason = `Heavy rain (${forecast.rainProbabilityPercent}% chance) affects outdoor visit. Replaced with covered indoor cultural alternative.`;
    } else if (isHeat && isMiddayTimeWindow(slot.timeWindow)) {
      needsAdjustment = true;
      reason = `Midday heat high of ${forecast.tempMaxC}°C. Shifted to shaded indoor sanctum / museum to avoid hot stone floors.`;
    }

    if (!needsAdjustment) {
      return { ...slot };
    }

    affectedSlotIndices.push(idx);

    // Find a sheltered alternative not currently used in this day
    const availableAlt = indoorCandidates.find((c) => !existingDestIds.has(c.id) && c.id !== slot.destinationId);

    if (availableAlt) {
      existingDestIds.add(availableAlt.id);
      indoorAlternativesUsed.push({
        originalName: slot.title,
        replacementName: availableAlt.name,
        reason,
      });

      return {
        ...slot,
        title: `Plan B: ${availableAlt.name}`,
        destinationId: availableAlt.id,
        category: availableAlt.category,
        whyNowReason: `Weather Adjusted: ${reason}`,
        notes: `Plan B alternative for ${slot.title}. Verified covered stop within ${district}.`,
        estimatedCostINR: availableAlt.estimatedCostINR.min,
      };
    } else {
      // If no alternate indoor place exists in smaller district, adjust notes and provide shaded buffer
      indoorAlternativesUsed.push({
        originalName: slot.title,
        replacementName: `${slot.title} (Covered Corridor)`,
        reason,
      });

      return {
        ...slot,
        title: `Plan B: ${slot.title} (Covered Mandapam/Indoor)`,
        whyNowReason: `Weather Adjusted: ${reason} Stay restricted to the covered indoor corridors during this time slot.`,
        notes: `Plan B guidance: Avoid open stone courtyards or steep wet trails; utilize covered temple prakarams.`,
      };
    }
  });

  return {
    hasHazard: affectedSlotIndices.length > 0,
    hazardType,
    hazardDescription,
    affectedSlotIndices,
    adjustedActivities,
    indoorAlternativesUsed,
  };
}
