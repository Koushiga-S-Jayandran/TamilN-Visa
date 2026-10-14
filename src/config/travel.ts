/**
 * TAMIZN VISA - Travel & Transit Planning Assumptions
 * Straight-line Euclidean distance multiplied by road winding factor (1.3),
 * divided by estimated transit speeds.
 * 
 * Note: These values are planning assumptions.
 * Urban transit: 20 km/h average speed.
 * Highway / Inter-locality transit: 40 km/h average speed.
 */

export const TRAVEL_CONFIG = {
  // Road curvature / winding coefficient to convert straight-line to road distance
  roadWindingFactor: 1.3,

  // Speed assumptions in km/h (planning assumptions)
  urbanSpeedKmH: 20, // Urban speed within town/city limits
  highwaySpeedKmH: 40, // Highway / rural speed between separated localities

  // Distance threshold (km) to distinguish urban vs highway transit
  urbanDistanceThresholdKm: 8,

  // Default transit buffer times (minutes)
  minTransitBufferMinutes: 10,
  maxTransitBufferMinutes: 30,

  // Restaurant search radius (km)
  urbanRestaurantRadiusKm: 3,
  ruralRestaurantRadiusKm: 8,
  altRestaurantMaxRadiusKm: 5,
};

/**
 * Calculates road-adjusted transit distance and estimated travel time with safety buffers.
 */
export function estimateTravelTimeMinutes(distanceKm: number): {
  roadDistanceKm: number;
  travelTimeMinutes: number;
  bufferMinutes: number;
} {
  const roadDistanceKm = Math.round(distanceKm * TRAVEL_CONFIG.roadWindingFactor * 10) / 10;
  const speed =
    roadDistanceKm <= TRAVEL_CONFIG.urbanDistanceThresholdKm
      ? TRAVEL_CONFIG.urbanSpeedKmH
      : TRAVEL_CONFIG.highwaySpeedKmH;

  const rawMinutes = Math.round((roadDistanceKm / speed) * 60);
  const travelTimeMinutes = Math.max(10, rawMinutes);
  const bufferMinutes = Math.min(
    TRAVEL_CONFIG.maxTransitBufferMinutes,
    Math.max(TRAVEL_CONFIG.minTransitBufferMinutes, Math.round(travelTimeMinutes * 0.3))
  );

  return { roadDistanceKm, travelTimeMinutes, bufferMinutes };
}
