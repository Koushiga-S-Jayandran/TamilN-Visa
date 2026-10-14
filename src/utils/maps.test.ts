import { describe, it, expect } from 'vitest';
import { buildGoogleMapsUrl } from './maps';

describe('Part 5: Google Maps Link Generation', () => {
  it('builds search query URL containing entry name and district', () => {
    const url = buildGoogleMapsUrl({
      name: 'Kapaleeshwarar Temple Mylapore',
      locality: 'Mylapore',
      district: 'Chennai',
    });

    expect(url).toContain('https://www.google.com/maps/search/?api=1&query=');
    expect(url).toContain(encodeURIComponent('Kapaleeshwarar Temple Mylapore'));
    expect(url).toContain(encodeURIComponent('Chennai'));
    expect(url).toContain(encodeURIComponent('Tamil Nadu'));
    expect(url).toContain(encodeURIComponent('India'));
    expect(url).not.toContain('query_place_id=');
  });

  it('adds query_place_id ONLY when verified place id exists', () => {
    const urlWithPlaceId = buildGoogleMapsUrl({
      name: 'Gangaikonda Cholapuram Temple',
      locality: 'Gangaikonda Cholapuram',
      district: 'Ariyalur',
      googleMapsPlaceId: 'ChIJ74j_example_place_id',
    });

    expect(urlWithPlaceId).toContain('&query_place_id=ChIJ74j_example_place_id');
    expect(urlWithPlaceId).toContain(encodeURIComponent('Ariyalur'));
  });

  it('handles empty locality cleanly while preserving district', () => {
    const url = buildGoogleMapsUrl({
      name: 'Brihadisvara Temple',
      district: 'Thanjavur',
    });

    expect(url).toContain(encodeURIComponent('Brihadisvara Temple'));
    expect(url).toContain(encodeURIComponent('Thanjavur'));
  });
});
