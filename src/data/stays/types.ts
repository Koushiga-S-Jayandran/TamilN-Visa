/**
 * TAMIZN VISA - Official Stays & Accommodation Types
 * Strictly verified from Tamil Nadu Tourism Development Corporation (TTDC)
 * and official district administrative listings.
 */

export type StayType =
  | 'TTDC Hotel'
  | 'Heritage Stay'
  | 'Homestay'
  | 'Lodge'
  | 'Eco Resort'
  | 'Circuit House';

export type PriceBand = 'Budget' | 'Mid-range' | 'Luxury';

export interface Stay {
  id: string;
  name: string;
  nameTamil: string;
  district: string;
  locality: string;
  type: StayType;
  priceBand: PriceBand | null; // Only if verified, null otherwise
  approxPriceINR: number | null; // Only if verified, null otherwise
  checkInTime: string | null; // Only if verified, null otherwise
  checkOutTime: string | null; // Only if verified, null otherwise
  contactPhone: string | null;
  officialBookingUrl: string; // Official website only
  accessibilityNotes: string | null;
  sourceName: string;
  sourceUrl: string;
  confidence: 'High' | 'Medium';
  lastVerified: string;
}
