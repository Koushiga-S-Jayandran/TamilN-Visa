/**
 * TAMIZN VISA - Google Maps Search URL Builder
 * Generates official Google Maps Search URLs without requiring any API keys.
 * Format:
 * https://www.google.com/maps/search/?api=1&query=<URL-encoded "name, locality, district, Tamil Nadu, India">
 * with optional &query_place_id=<googleMapsPlaceId> when verified.
 */

export interface MapQueryItem {
  name: string;
  locality?: string;
  district: string;
  googleMapsPlaceId?: string;
}

export function buildGoogleMapsUrl(item: MapQueryItem): string {
  const parts: string[] = [item.name.trim()];
  if (item.locality && item.locality.trim()) {
    parts.push(item.locality.trim());
  }
  if (item.district && item.district.trim()) {
    parts.push(item.district.trim());
  }
  parts.push('Tamil Nadu');
  parts.push('India');

  const fullQuery = parts.join(', ');
  const encodedQuery = encodeURIComponent(fullQuery);

  let url = `https://www.google.com/maps/search/?api=1&query=${encodedQuery}`;
  if (item.googleMapsPlaceId && item.googleMapsPlaceId.trim()) {
    url += `&query_place_id=${encodeURIComponent(item.googleMapsPlaceId.trim())}`;
  }

  return url;
}
