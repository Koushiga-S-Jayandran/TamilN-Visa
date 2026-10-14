/**
 * TAMIZN VISA - Restaurant Schema (Part 2.1)
 * Zero fabrication schema for verified dining spots in Tamil Nadu.
 */

export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type DietType = 'Pure Veg' | 'Veg & Non-veg';

export interface Restaurant {
  id: string;
  name: string;
  nameTamil: string;
  district: string;
  locality: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine: string;
  dietType: DietType;
  mealTypes: MealType[];
  openingHours: string;
  avgCostPerPerson: number | null;
  signatureDishes: string[];
  googleMapsPlaceId?: string;
  sourceName: string;
  sourceUrl: string;
  confidence: 'High' | 'Medium';
  lastVerified: string;
  imageUrl?: string;
}
