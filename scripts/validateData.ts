import fs from 'fs';
import path from 'path';

// Official 38 Districts of Tamil Nadu
export const OFFICIAL_38_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kancheepuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupattur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
] as const;

export const ALLOWED_CATEGORIES = [
  'Temples & Spiritual',
  'Heritage & Forts',
  'Beaches & Coastal',
  'Hills & Waterfalls',
  'Nature & Wildlife',
  'Hidden Gems',
  'Food & Culinary',
  'Culture & Crafts',
] as const;

interface ValidationIssue {
  target: string;
  itemId?: string;
  error: string;
}

function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function areNamesSimilar(name1: string, name2: string): boolean {
  const n1 = normalizeName(name1);
  const n2 = normalizeName(name2);
  if (n1 === n2) return true;
  if (n1.length > 5 && n2.length > 5 && (n1.includes(n2) || n2.includes(n1))) return true;
  return false;
}

async function validateAllData() {
  console.log('🔍 Starting TAMIZN VISA Comprehensive Data Validation (Part 2.4)...');
  console.log('Checking places and restaurants across all 38 official districts...\n');

  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  const districtPlaceCounts: Record<string, number> = {};
  const districtRestaurantCounts: Record<string, number> = {};

  for (const d of OFFICIAL_38_DISTRICTS) {
    districtPlaceCounts[d] = 0;
    districtRestaurantCounts[d] = 0;
  }

  const districtsDir = path.resolve(process.cwd(), 'src/data/districts');
  if (!fs.existsSync(districtsDir)) {
    console.error('❌ FATAL: Directory src/data/districts does not exist!');
    process.exit(1);
  }

  // 1. Check all 38 district place files exist
  for (const expectedDistrict of OFFICIAL_38_DISTRICTS) {
    const expectedFile = `${expectedDistrict.toLowerCase()}.ts`;
    const fullPath = path.join(districtsDir, expectedFile);
    if (!fs.existsSync(fullPath)) {
      issues.push({
        target: expectedFile,
        error: `Missing district file for official district "${expectedDistrict}": expected ${expectedFile}`,
      });
    }
  }

  const files = fs
    .readdirSync(districtsDir)
    .filter((f) => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');

  const allPlaces: Array<{
    id: string;
    name: string;
    district: string;
    latitude: number;
    longitude: number;
  }> = [];

  for (const file of files) {
    const filePath = path.join(districtsDir, file);
    const expectedDistrictName = OFFICIAL_38_DISTRICTS.find(
      (d) => d.toLowerCase() === file.replace('.ts', '').toLowerCase()
    );

    if (!expectedDistrictName) {
      issues.push({
        target: file,
        error: `File ${file} does not correspond to any of the 38 official Tamil Nadu districts!`,
      });
      continue;
    }

    try {
      const module = await import(filePath);
      const places = module.default || Object.values(module)[0];

      if (!Array.isArray(places)) {
        issues.push({
          target: file,
          error: `Export from ${file} is not an array of places!`,
        });
        continue;
      }

      const namesInDistrict = new Set<string>();

      for (const place of places) {
        districtPlaceCounts[expectedDistrictName]++;
        const pId = place.id || '(unknown id)';

        // 1. ID check
        if (!place.id || typeof place.id !== 'string' || !place.id.trim()) {
          issues.push({
            target: file,
            itemId: pId,
            error: 'Missing or empty "id" field.',
          });
        } else if (seenIds.has(place.id)) {
          issues.push({
            target: file,
            itemId: place.id,
            error: `Duplicate id: "${place.id}" already exists.`,
          });
        } else {
          seenIds.add(place.id);
        }

        // 2. Name check
        if (!place.name || typeof place.name !== 'string' || !place.name.trim()) {
          issues.push({
            target: file,
            itemId: pId,
            error: 'Missing or empty "name" field.',
          });
        } else {
          const norm = normalizeName(place.name);
          if (namesInDistrict.has(norm)) {
            issues.push({
              target: file,
              itemId: pId,
              error: `Duplicate place name in district "${expectedDistrictName}": "${place.name}".`,
            });
          } else {
            namesInDistrict.add(norm);
          }
        }

        // 3. District exact match
        if (place.district !== expectedDistrictName) {
          issues.push({
            target: file,
            itemId: pId,
            error: `District mismatch: place.district is "${place.district}" but file is "${file}" (expected "${expectedDistrictName}").`,
          });
        }

        // 4. Coordinates check
        if (typeof place.latitude !== 'number' || isNaN(place.latitude)) {
          issues.push({
            target: file,
            itemId: pId,
            error: `Invalid latitude: ${place.latitude}`,
          });
        } else if (place.latitude < 8.0 || place.latitude > 14.0) {
          issues.push({
            target: file,
            itemId: pId,
            error: `Latitude ${place.latitude} is outside Tamil Nadu bounds [8.0, 14.0].`,
          });
        }

        if (typeof place.longitude !== 'number' || isNaN(place.longitude)) {
          issues.push({
            target: file,
            itemId: pId,
            error: `Invalid longitude: ${place.longitude}`,
          });
        } else if (place.longitude < 76.0 || place.longitude > 81.0) {
          issues.push({
            target: file,
            itemId: pId,
            error: `Longitude ${place.longitude} is outside Tamil Nadu bounds [76.0, 81.0].`,
          });
        }

        // 5. SourceUrl check
        if (!place.sourceUrl || typeof place.sourceUrl !== 'string' || !place.sourceUrl.startsWith('http')) {
          issues.push({
            target: file,
            itemId: pId,
            error: `Invalid or missing "sourceUrl": "${place.sourceUrl}". Must be a valid HTTP/HTTPS URL.`,
          });
        }

        allPlaces.push({
          id: place.id,
          name: place.name,
          district: place.district,
          latitude: place.latitude,
          longitude: place.longitude,
        });
      }
    } catch (err: any) {
      issues.push({
        target: file,
        error: `Failed to import or parse ${file}: ${err.message || String(err)}`,
      });
    }
  }

  // 2. Validate Restaurants
  const restaurantsPath = path.resolve(process.cwd(), 'src/data/restaurants/index.ts');
  const allRestaurants: Array<{
    id: string;
    name: string;
    district: string;
    latitude: number;
    longitude: number;
  }> = [];

  if (fs.existsSync(restaurantsPath)) {
    try {
      const restModule = await import(restaurantsPath);
      const restaurants = restModule.ALL_RESTAURANTS || [];

      if (!Array.isArray(restaurants)) {
        issues.push({
          target: 'restaurants/index.ts',
          error: 'ALL_RESTAURANTS is not an array!',
        });
      } else {
        const restNamesByDistrict: Record<string, Set<string>> = {};

        for (const rest of restaurants) {
          const rId = rest.id || '(unknown rest id)';

          // 1. ID check
          if (!rest.id || typeof rest.id !== 'string' || !rest.id.trim()) {
            issues.push({
              target: 'restaurants',
              itemId: rId,
              error: 'Missing or empty restaurant id.',
            });
          } else if (seenIds.has(rest.id)) {
            issues.push({
              target: 'restaurants',
              itemId: rest.id,
              error: `Duplicate restaurant id: "${rest.id}" already exists.`,
            });
          } else {
            seenIds.add(rest.id);
          }

          // 2. District check
          if (!rest.district || !OFFICIAL_38_DISTRICTS.includes(rest.district as any)) {
            issues.push({
              target: 'restaurants',
              itemId: rId,
              error: `Invalid restaurant district "${rest.district}". Must be one of the 38 official districts.`,
            });
          } else {
            districtRestaurantCounts[rest.district] = (districtRestaurantCounts[rest.district] || 0) + 1;
            if (!restNamesByDistrict[rest.district]) {
              restNamesByDistrict[rest.district] = new Set<string>();
            }
            const norm = normalizeName(rest.name || '');
            if (restNamesByDistrict[rest.district].has(norm)) {
              issues.push({
                target: 'restaurants',
                itemId: rId,
                error: `Duplicate restaurant name in district "${rest.district}": "${rest.name}".`,
              });
            } else {
              restNamesByDistrict[rest.district].add(norm);
            }
          }

          // 3. mealTypes check (must not be empty)
          if (!Array.isArray(rest.mealTypes) || rest.mealTypes.length === 0) {
            issues.push({
              target: 'restaurants',
              itemId: rId,
              error: `Restaurant has no mealType defined: ${rest.name}`,
            });
          }

          // 4. Coordinates check
          if (typeof rest.latitude !== 'number' || isNaN(rest.latitude) || rest.latitude < 8.0 || rest.latitude > 14.0) {
            issues.push({
              target: 'restaurants',
              itemId: rId,
              error: `Latitude ${rest.latitude} is outside Tamil Nadu bounds [8.0, 14.0].`,
            });
          }
          if (typeof rest.longitude !== 'number' || isNaN(rest.longitude) || rest.longitude < 76.0 || rest.longitude > 81.0) {
            issues.push({
              target: 'restaurants',
              itemId: rId,
              error: `Longitude ${rest.longitude} is outside Tamil Nadu bounds [76.0, 81.0].`,
            });
          }

          // 5. SourceUrl check
          if (!rest.sourceUrl || typeof rest.sourceUrl !== 'string' || !rest.sourceUrl.startsWith('http')) {
            issues.push({
              target: 'restaurants',
              itemId: rId,
              error: `Invalid or missing sourceUrl for restaurant "${rest.name}": "${rest.sourceUrl}".`,
            });
          }

          allRestaurants.push({
            id: rest.id,
            name: rest.name,
            district: rest.district,
            latitude: rest.latitude,
            longitude: rest.longitude,
          });
        }
      }
    } catch (err: any) {
      issues.push({
        target: 'restaurants/index.ts',
        error: `Failed to import restaurants: ${err.message || String(err)}`,
      });
    }
  }

  // 3. Check for entries within 50 meters with similar names
  const allEntries = [...allPlaces, ...allRestaurants];
  for (let i = 0; i < allEntries.length; i++) {
    for (let j = i + 1; j < allEntries.length; j++) {
      const e1 = allEntries[i];
      const e2 = allEntries[j];
      if (e1.district === e2.district) {
        const dist = calculateDistanceMeters(e1.latitude, e1.longitude, e2.latitude, e2.longitude);
        if (dist < 50 && areNamesSimilar(e1.name, e2.name)) {
          issues.push({
            target: e1.district,
            itemId: `${e1.id} vs ${e2.id}`,
            error: `Entries "${e1.name}" and "${e2.name}" are within ${Math.round(dist)}m (<50m) with similar names. Potential duplicate.`,
          });
        }
      }
    }
  }

  // Print Per-District Counts Summary
  console.log('📊 DISTRICT DATA COUNTS SUMMARY (Places & Restaurants):');
  console.log('----------------------------------------------------------------------');
  console.log('| #  | District               | Places | Restaurants | Total Verified |');
  console.log('----------------------------------------------------------------------');
  let totalPlaces = 0;
  let totalRestaurants = 0;

  OFFICIAL_38_DISTRICTS.forEach((d, idx) => {
    const pCount = districtPlaceCounts[d] || 0;
    const rCount = districtRestaurantCounts[d] || 0;
    totalPlaces += pCount;
    totalRestaurants += rCount;
    const padNum = String(idx + 1).padStart(2, ' ');
    const padName = d.padEnd(22, ' ');
    const padPlaces = String(pCount).padStart(6, ' ');
    const padRest = String(rCount).padStart(11, ' ');
    const padTot = String(pCount + rCount).padStart(14, ' ');
    console.log(`| ${padNum} | ${padName} | ${padPlaces} | ${padRest} | ${padTot} |`);
  });
  console.log('----------------------------------------------------------------------');
  console.log(
    `|    | TOTAL ALL 38 DISTRICTS | ${String(totalPlaces).padStart(6, ' ')} | ${String(totalRestaurants).padStart(11, ' ')} | ${String(totalPlaces + totalRestaurants).padStart(14, ' ')} |`
  );
  console.log('----------------------------------------------------------------------\n');

  if (issues.length > 0) {
    console.error(`❌ DATA VALIDATION FAILED with ${issues.length} issue(s):\n`);
    issues.forEach((issue, idx) => {
      console.error(
        `  ${idx + 1}. [${issue.target}]${issue.itemId ? ` (${issue.itemId})` : ''}: ${issue.error}`
      );
    });
    console.error('\nPlease fix the issues above to ensure data integrity.');
    process.exit(1);
  }

  console.log('✅ ALL CHECKS PASSED!');
  console.log(`✓ 38/38 Official Tamil Nadu districts validated.`);
  console.log(`✓ ${totalPlaces} verified places and ${totalRestaurants} verified restaurants passed all schema constraints.`);
  console.log('✓ Zero cross-district leakage, no duplicates within 50m, valid coordinates and URLs.\n');
  process.exit(0);
}

validateAllData().catch((err) => {
  console.error('Unhandled validation error:', err);
  process.exit(1);
});
