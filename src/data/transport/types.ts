/**
 * TAMIZN VISA - Official Public Transport Guide Types
 * Strictly verified timetables from Southern Railway, Indian Railways,
 * TNSTC (Tamil Nadu State Transport Corporation), and SETC.
 */

export interface PublicTransportService {
  id: string;
  mode: 'bus' | 'train';
  operator: 'TNSTC' | 'SETC' | 'Southern Railway' | 'Indian Railways' | 'Chennai Metro';
  serviceName: string;
  serviceNumber: string | null; // e.g. "12675", null if general frequency
  fromStation: string;
  toStation: string;
  departureTime: string | null; // e.g. "06:10 AM", null if unverified
  arrivalTime: string | null; // e.g. "02:05 PM", null if unverified
  daysOfOperation: string; // e.g. "Daily", "Mon-Sat"
  fareINR: number | null; // Only if verified, null otherwise
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
}

export interface DistrictTransportHub {
  district: string;
  nearestMajorRailwayStation: string;
  nearestRailwayCode: string;
  majorBusStands: string[];
  officialTrainBookingUrl: string;
  officialBusBookingUrl: string;
  verifiedServices: PublicTransportService[];
  warningNotice: string;
  sourceName: string;
  sourceUrl: string;
  lastVerified: string;
}
