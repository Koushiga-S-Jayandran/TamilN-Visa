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
  districtFile: string;
  placeId?: string;
  error: string;
}

async function validateAllData() {
  console.log('🔍 Starting TAMIZN VISA Destination Data Validation...');
  console.log('Checking all 38 official districts of Tamil Nadu...\n');

  const issues: ValidationIssue[] = [];
  const seenIds = new Set<string>();
  let totalPlacesCount = 0;

  const districtsDir = path.resolve(process.cwd(), 'src/data/districts');
  if (!fs.existsSync(districtsDir)) {
    console.error('❌ FATAL: Directory src/data/districts does not exist!');
    process.exit(1);
  }

  // 1. Check all 38 files exist
  for (const expectedDistrict of OFFICIAL_38_DISTRICTS) {
    const expectedFile = `${expectedDistrict.toLowerCase()}.ts`;
    const fullPath = path.join(districtsDir, expectedFile);
    if (!fs.existsSync(fullPath)) {
      issues.push({
        districtFile: expectedFile,
        error: `Missing district file for official district "${expectedDistrict}": expected ${expectedFile}`,
      });
    }
  }

  // Check index.ts exists
  const indexPath = path.join(districtsDir, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    issues.push({
      districtFile: 'index.ts',
      error: 'Missing index.ts exporting all 38 districts.',
    });
  }

  // Read all district files
  const files = fs
    .readdirSync(districtsDir)
    .filter((f) => f.endsWith('.ts') && f !== 'types.ts' && f !== 'index.ts');

  for (const file of files) {
    const filePath = path.join(districtsDir, file);
    const expectedDistrictName = OFFICIAL_38_DISTRICTS.find(
      (d) => d.toLowerCase() === file.replace('.ts', '').toLowerCase()
    );

    if (!expectedDistrictName) {
      issues.push({
        districtFile: file,
        error: `File ${file} does not correspond to any of the 38 official Tamil Nadu districts!`,
      });
      continue;
    }

    try {
      const module = await import(filePath);
      const places = module.default || Object.values(module)[0];

      if (!Array.isArray(places)) {
        issues.push({
          districtFile: file,
          error: `Export from ${file} is not an array of places!`,
        });
        continue;
      }

      if (places.length === 0) {
        issues.push({
          districtFile: file,
          error: `District file ${file} contains 0 places! Every district must have verified destinations.`,
        });
      }

      for (const place of places) {
        totalPlacesCount++;
        const pId = place.id || '(unknown id)';

        // 1. ID check
        if (!place.id || typeof place.id !== 'string' || !place.id.trim()) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing or empty "id" field.',
          });
        } else if (seenIds.has(place.id)) {
          issues.push({
            districtFile: file,
            placeId: place.id,
            error: `Duplicate place id: "${place.id}" already exists.`,
          });
        } else {
          seenIds.add(place.id);
        }

        // 2. Name & Tamil Name
        if (!place.name || typeof place.name !== 'string' || !place.name.trim()) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing or empty "name" field.',
          });
        }
        if (!place.nameTamil || typeof place.nameTamil !== 'string' || !place.nameTamil.trim()) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing or empty "nameTamil" field.',
          });
        }

        // 3. District exact match & official district check
        if (!place.district || typeof place.district !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "district" field.',
          });
        } else {
          if (!OFFICIAL_38_DISTRICTS.includes(place.district as any)) {
            issues.push({
              districtFile: file,
              placeId: pId,
              error: `Invalid district "${place.district}". Must be one of the 38 official Tamil Nadu districts.`,
            });
          }
          if (place.district !== expectedDistrictName) {
            issues.push({
              districtFile: file,
              placeId: pId,
              error: `District mismatch: place.district is "${place.district}" but file is "${file}" (expected "${expectedDistrictName}").`,
            });
          }
        }

        // 4. Locality check
        if (!place.locality || typeof place.locality !== 'string' || !place.locality.trim()) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing or empty "locality" field.',
          });
        }

        // 5. Category check (must be one of 8 allowed)
        if (!place.category || !ALLOWED_CATEGORIES.includes(place.category)) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Invalid category "${place.category}". Must be one of: ${ALLOWED_CATEGORIES.join(', ')}`,
          });
        }

        // 6. Coordinates check (Tamil Nadu geographic bounds)
        // Lat: ~8.0 - 14.0, Lng: ~76.0 - 81.0
        if (typeof place.latitude !== 'number' || isNaN(place.latitude)) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Invalid latitude: ${place.latitude}`,
          });
        } else if (place.latitude < 8.0 || place.latitude > 14.0) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Latitude ${place.latitude} is outside Tamil Nadu bounds [8.0, 14.0].`,
          });
        }

        if (typeof place.longitude !== 'number' || isNaN(place.longitude)) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Invalid longitude: ${place.longitude}`,
          });
        } else if (place.longitude < 76.0 || place.longitude > 81.0) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Longitude ${place.longitude} is outside Tamil Nadu bounds [76.0, 81.0].`,
          });
        }

        // 7. Description length check (max 40 words)
        if (!place.description || typeof place.description !== 'string' || !place.description.trim()) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing or empty "description" field.',
          });
        } else {
          const wordCount = place.description.trim().split(/\s+/).filter(Boolean).length;
          if (wordCount > 40) {
            issues.push({
              districtFile: file,
              placeId: pId,
              error: `Description exceeds max 40 words (${wordCount} words): "${place.description.slice(0, 60)}..."`,
            });
          }
        }

        // 8. visitingHours & entryFee
        if (!place.visitingHours || typeof place.visitingHours !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "visitingHours" field.',
          });
        }
        if (!place.entryFee || typeof place.entryFee !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "entryFee" field.',
          });
        }

        // 9. bestSeason & dressCode
        if (!place.bestSeason || typeof place.bestSeason !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "bestSeason" field.',
          });
        }
        if (!place.dressCode || typeof place.dressCode !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "dressCode" field.',
          });
        }

        // 10. recommendedDurationMins
        if (typeof place.recommendedDurationMins !== 'number' || place.recommendedDurationMins <= 0) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Invalid "recommendedDurationMins": ${place.recommendedDurationMins}. Must be positive number.`,
          });
        }

        // 11. accessibilityNotes
        if (!place.accessibilityNotes || typeof place.accessibilityNotes !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "accessibilityNotes" field.',
          });
        }

        // 12. sourceName & sourceUrl
        if (!place.sourceName || typeof place.sourceName !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "sourceName" field.',
          });
        }
        if (!place.sourceUrl || typeof place.sourceUrl !== 'string' || !place.sourceUrl.startsWith('http')) {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Invalid or missing "sourceUrl": "${place.sourceUrl}". Must be a valid HTTP/HTTPS URL.`,
          });
        }

        // 13. confidence: "High" | "Medium"
        if (place.confidence !== 'High' && place.confidence !== 'Medium') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: `Invalid confidence "${place.confidence}". Must be "High" or "Medium".`,
          });
        }

        // 14. lastVerified
        if (!place.lastVerified || typeof place.lastVerified !== 'string') {
          issues.push({
            districtFile: file,
            placeId: pId,
            error: 'Missing "lastVerified" field.',
          });
        }
      }
    } catch (err: any) {
      issues.push({
        districtFile: file,
        error: `Failed to import or parse ${file}: ${err.message || String(err)}`,
      });
    }
  }

  // Reporting
  if (issues.length > 0) {
    console.error(`\n❌ DATA VALIDATION FAILED with ${issues.length} issue(s):\n`);
    issues.forEach((issue, idx) => {
      console.error(
        `  ${idx + 1}. [${issue.districtFile}]${issue.placeId ? ` (Place: ${issue.placeId})` : ''}: ${issue.error}`
      );
    });
    console.error('\nPlease fix the issues above to ensure data integrity.');
    process.exit(1);
  }

  console.log('✅ ALL CHECKS PASSED!');
  console.log(`✓ 38/38 Official Tamil Nadu districts validated.`);
  console.log(`✓ ${totalPlacesCount} verified places passed all schema constraints.`);
  console.log('✓ All categories, coordinates, word counts, and confidence levels verified.\n');
  process.exit(0);
}

validateAllData().catch((err) => {
  console.error('Unhandled validation error:', err);
  process.exit(1);
});
