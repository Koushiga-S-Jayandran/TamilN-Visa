/**
 * TAMIZN VISA - Type Definitions
 * Complete schema for Destinations, Crowd Analytics, Itineraries, Food, Transport, and Alerts.
 */

export type CrowdLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';

export type CrowdPredictionType = 'LIVE DATA' | 'DATA-BACKED' | 'ESTIMATED' | 'INSUFFICIENT DATA';

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export type SourceType =
  | 'OFFICIAL_TOURISM'
  | 'GOVERNMENT'
  | 'MAP_API'
  | 'WEATHER_API'
  | 'EVENT_API'
  | 'TRANSPORT_API'
  | 'HISTORICAL'
  | 'ESTIMATED';

export interface VerifiedSource {
  sourceName: string;
  sourceUrl: string;
  sourceType: SourceType;
  retrievedAt: string;
  lastVerifiedAt: string;
  confidence: ConfidenceLevel;
}

export interface Destination {
  id: string;
  name: string;
  tamilName?: string;
  district: string;
  cityArea: string;
  category: string;
  tags: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  openingTime: string; // e.g. "06:00 AM" or "Open 24 Hours" or "Data unavailable"
  closingTime: string; // e.g. "08:30 PM"
  closedDays: string[]; // e.g. ["Monday"] or []
  recommendedDurationMinutes: number; // e.g. 90
  bestVisitingTime: string; // e.g. "Early morning (06:30 - 08:30 AM) or sunset"
  estimatedCostINR: {
    min: number;
    max: number;
    isFree: boolean;
    notes?: string;
  };
  accessibilityInfo: string;
  rules: string[];
  dressRequirements: string;
  photoRestrictions: string;
  nearbyAttractions: string[];
  nearbyFood: string[];
  transportOptions: string[];
  crowdPatterns: {
    typicalPeakHours: string[];
    lowCrowdHours: string[];
    weekendSurchargeFactor: number;
    festivalWarning?: string;
  };
  source: VerifiedSource;
  isHiddenGem: boolean;
  whyHiddenGem?: string;
  imageUrl: string;
  ratingScore?: number;
}

export interface CrowdEvaluation {
  destinationId: string;
  destinationName: string;
  crowdLevel: CrowdLevel;
  predictionType: CrowdPredictionType;
  confidence: ConfidenceLevel;
  reason: string;
  source: string;
  lastUpdated: string;
  optimalVisitWindow: string;
  factorsUsed: {
    name: string;
    impact: 'INCREASES' | 'DECREASES' | 'NEUTRAL';
    description: string;
  }[];
}

export interface FoodPlace {
  id: string;
  name: string;
  district: string;
  cityArea: string;
  cuisine: string;
  specialtyDishes: string[];
  priceRange: '₹' | '₹₹' | '₹₹₹';
  avgCostPerPersonINR: number;
  isVegetarianOnly: boolean;
  isNonVegAvailable: boolean;
  studentFriendly: boolean;
  address: string;
  openingHours: string;
  imageUrl: string;
  source: VerifiedSource;
}

export interface TransportOption {
  id: string;
  mode: 'Walking' | 'Bus' | 'Train' | 'Taxi' | 'Auto' | 'Ride-sharing' | 'Local Shuttle';
  distanceKm: number;
  estimatedDurationMinutes: number;
  estimatedCostINR: {
    min: number;
    max: number;
  };
  recommendedFor: string;
  notes: string;
  verifiedSource: string;
}

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'NOTICE';

export interface DestinationAlert {
  id: string;
  destinationId?: string;
  destinationName: string;
  district: string;
  alertType:
    | 'CLOSED_TODAY'
    | 'FESTIVAL_CROWD'
    | 'DRESS_RESTRICTION'
    | 'BOOKING_REQUIRED'
    | 'WEATHER_WARNING'
    | 'SEASONAL_NOTE'
    | 'TIMING_NOTICE';
  title: string;
  description: string;
  severity: AlertSeverity;
  verifiedSource: string;
  verifiedAt: string;
}

export interface ActivitySlot {
  timeWindow: string; // e.g. "06:30 - 08:00 AM"
  activityType: 'DESTINATION' | 'TRANSIT' | 'MEAL' | 'REST';
  title: string;
  category?: string;
  destinationId?: string;
  district?: string;
  durationMinutes: number;
  travelBufferMinutes?: number;
  crowdLevel?: CrowdLevel;
  crowdPredictionType?: CrowdPredictionType;
  estimatedCostINR: number;
  whyNowReason: string;
  transportInfo?: string;
  notes?: string;
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  focusArea: string;
  summary: string;
  activities: ActivitySlot[];
  dayBudgetINR: number;
}

export type TravelerType = 'Family' | 'Solo' | 'Friends' | 'Couple' | 'Student' | 'Senior-friendly';

export type BudgetTier = 'Budget' | 'Mid-range' | 'Luxury' | 'Custom';

export type TravelPreference =
  | 'Avoid crowds'
  | 'Maximum places'
  | 'Slow travel'
  | 'Early morning travel'
  | 'Photography focused'
  | 'Food focused'
  | 'Family friendly'
  | 'Student friendly'
  | 'Short travel distances'
  | 'Finish before 6 PM';

export interface TripPlannerInput {
  destinationDistrict: string;
  travelDate: string;
  numberOfDays: number;
  numberOfTravelers: number;
  travelerType: TravelerType;
  budgetTier: BudgetTier;
  customBudgetINR?: number;
  selectedInterests: string[];
  selectedPreferences: TravelPreference[];
}

export interface SavedTrip {
  id: string;
  name: string;
  destinationDistrict: string;
  travelDate: string;
  numberOfDays: number;
  travelers: number;
  travelerType: TravelerType;
  budgetTotalINR: number;
  budgetUsedINR: number;
  itineraryDays: ItineraryDay[];
  createdAt: string;
  lastEditedAt: string;
  isOfflineSaved: boolean;
  notes?: string;
}
