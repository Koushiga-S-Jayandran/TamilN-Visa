/**
 * TAMIZN VISA - Local Transit Fare Configuration
 * Ride-hailing & local meter fare estimation between consecutive stops.
 *
 * Approximate planning assumptions. Replace with verified rates.
 */

export interface FareEstimateRange {
  mode: 'Auto' | 'Cab' | 'Bike Taxi';
  minFareINR: number;
  maxFareINR: number;
  formattedRange: string;
  notes: string;
  icon: string;
}

export interface TransitLegFareEstimate {
  straightLineDistanceKm: number;
  roadDistanceKm: number;
  roadFactor: number;
  autoFare: FareEstimateRange;
  cabFare: FareEstimateRange;
  bikeTaxiFare: FareEstimateRange;
  disclaimer: string;
}

// Approximate planning assumptions. Replace with verified rates.
export const FARE_CONFIG = {
  // Road winding factor: accounts for actual road routing vs straight-line distance
  roadFactor: 1.3,

  // Auto-rickshaw rates (Tamil Nadu urban / semi-urban meter baseline)
  auto: {
    baseFare: 40, // Base minimum fare (first 1.8 km)
    baseKm: 1.8,
    perKmRate: 18,
    nightMultiplier: 1.25, // 10 PM - 5 AM
    rangeVariance: 0.15, // +/- 15% range for traffic / negotiation
  },

  // Private cab / taxi rates (hatchback / sedan local transfer)
  cab: {
    baseFare: 100, // Base minimum fare (first 4.0 km)
    baseKm: 4.0,
    perKmRate: 24,
    nightMultiplier: 1.2,
    rangeVariance: 0.15,
  },

  // Bike taxi (single passenger, quick transit in city traffic)
  bikeTaxi: {
    baseFare: 25, // Base minimum fare (first 2.0 km)
    baseKm: 2.0,
    perKmRate: 12,
    nightMultiplier: 1.15,
    rangeVariance: 0.12,
  },
};

/**
 * Calculate Haversine distance in km between two lat/lng coordinates
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
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
 * Estimate local transit fares between two consecutive stops
 */
export function estimateConsecutiveLegFares(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number,
  isNight: boolean = false
): TransitLegFareEstimate {
  const straightLine = calculateHaversineDistanceKm(fromLat, fromLng, toLat, toLng);
  // Distance = straight-line distance x 1.3 (road factor)
  const roadDist = Math.max(1.0, Math.round(straightLine * FARE_CONFIG.roadFactor * 10) / 10);

  // 1. Auto Fare
  const autoCfg = FARE_CONFIG.auto;
  const autoExtraKm = Math.max(0, roadDist - autoCfg.baseKm);
  const autoBase = autoCfg.baseFare + autoExtraKm * autoCfg.perKmRate;
  const autoNominal = Math.round(autoBase * (isNight ? autoCfg.nightMultiplier : 1.0));
  const autoMin = Math.max(40, Math.round((autoNominal * (1 - autoCfg.rangeVariance)) / 5) * 5);
  const autoMax = Math.round((autoNominal * (1 + autoCfg.rangeVariance)) / 5) * 5;

  // 2. Cab Fare
  const cabCfg = FARE_CONFIG.cab;
  const cabExtraKm = Math.max(0, roadDist - cabCfg.baseKm);
  const cabBase = cabCfg.baseFare + cabExtraKm * cabCfg.perKmRate;
  const cabNominal = Math.round(cabBase * (isNight ? cabCfg.nightMultiplier : 1.0));
  const cabMin = Math.max(100, Math.round((cabNominal * (1 - cabCfg.rangeVariance)) / 10) * 10);
  const cabMax = Math.round((cabNominal * (1 + cabCfg.rangeVariance)) / 10) * 10;

  // 3. Bike Taxi Fare
  const bikeCfg = FARE_CONFIG.bikeTaxi;
  const bikeExtraKm = Math.max(0, roadDist - bikeCfg.baseKm);
  const bikeBase = bikeCfg.baseFare + bikeExtraKm * bikeCfg.perKmRate;
  const bikeNominal = Math.round(bikeBase * (isNight ? bikeCfg.nightMultiplier : 1.0));
  const bikeMin = Math.max(25, Math.round((bikeNominal * (1 - bikeCfg.rangeVariance)) / 5) * 5);
  const bikeMax = Math.round((bikeNominal * (1 + bikeCfg.rangeVariance)) / 5) * 5;

  return {
    straightLineDistanceKm: straightLine,
    roadDistanceKm: roadDist,
    roadFactor: FARE_CONFIG.roadFactor,
    autoFare: {
      mode: 'Auto',
      minFareINR: autoMin,
      maxFareINR: autoMax,
      formattedRange: `₹${autoMin} – ₹${autoMax}`,
      notes: 'Local meter / pre-paid auto stand rate',
      icon: '🛺',
    },
    cabFare: {
      mode: 'Cab',
      minFareINR: cabMin,
      maxFareINR: cabMax,
      formattedRange: `₹${cabMin} – ₹${cabMax}`,
      notes: 'Hatchback / Sedan AC cab ride',
      icon: '🚕',
    },
    bikeTaxiFare: {
      mode: 'Bike Taxi',
      minFareINR: bikeMin,
      maxFareINR: bikeMax,
      formattedRange: `₹${bikeMin} – ₹${bikeMax}`,
      notes: 'Single passenger fast transit',
      icon: '🛵',
    },
    disclaimer: 'Approximate planning assumptions. Replace with verified rates.',
  };
}
