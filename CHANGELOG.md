# CHANGELOG - TAMIZN VISA Version 2.0

Comprehensive record of all file updates, architectural fixes, and newly introduced features.

---

## 1. Core Proof of Work & Identity Updates

- **`vite.config.ts`**:
  - Injected `__APP_BUILD_TIME__` at build time using Indian Standard Time (IST) formatting.
- **`src/config/buildInfo.ts`**:
  - Exported `BUILD_INFO` object containing `'Version 2.0'` and `buildStamp: Version 2.0 | Built <build date and time>`.
- **`src/components/Footer.tsx`**:
  - Embedded the visible build stamp in the footer bottom bar.
  - Updated Creator & Institution card with:
    - Made by: Koushiga.S.Jayandran (1st Yr M.Tech CSE, Integrated 5 yr course).
    - Faculty mentor: Dr. Sakthivel Aruchamy, Head of the First Year Programme (HoD-FYP).
    - Institution: Sri Ramakrishna Engineering College (SREC), Vattamalaipalayam, Coimbatore (hyperlinked to `http://srec.ac.in/`).
    - Copyright line: "Designed & Developed by Koushiga.S.Jayandran."
    - Navigation link to Future Plans (3 Phases).
- **`src/config/appConfig.ts`**:
  - Synchronized creator details, institution URL, and mentor credentials.
  - Documented the three future roadmap phases:
    - **NEXT**: Stays and hotel rooms, Public transport guide, Live weather forecast planning, Rapido-style fare estimates (marked 'Live (beta)').
    - **PILOT**: Festival-aware crowd forecasts, Tamil and multilingual interface, Tourism-board dashboard, QR codes at heritage sites ('Coming soon' / 'Live (beta)').
    - **SCALE**: Village & agri-tourism listings, Solo and women-safety mode, Group trips & expense splitting, Sustainability score ('Coming soon').
- **`src/components/AboutModal.tsx`**:
  - Integrated 3-Phase Future Plans accordion/grid with status tags ('Live (beta)' vs 'Coming soon').
  - Deep linked `#future-plans` anchor for quick navigation from footer.
  - Verified faculty mentor and institutional profile.
- **`src/components/TamilBrandLogo.tsx`**:
  - Designed the official circular roundel:
    - Maroon (#7A1F2B) circular disc.
    - Kolam ring of 12 gold (#C8962E) dots.
    - Tamil Nadu state bird, the Emerald Dove (*Maragatha Pura* / மரகதப் புறா), with bronze-green back & wings, pinkish-grey head & chest, white shoulder patch, and coral red bill.
    - Wordmark: "TAMIZN VISA" + "தமிழ்நாடு" + "From Heritage to Hidden Horizons".
- **`public/favicon.svg` & `index.html`**:
  - Created standalone vector SVG favicon matching the Emerald Dove roundel.
  - Linked `<link rel="icon" type="image/svg+xml" href="/favicon.svg" />` in HTML head.
- **`src/components/Navbar.tsx`**:
  - Replaced the previous gopuram icon with `EmeraldDoveRoundel`.
- **`src/components/MultiStepPlanner.tsx`**:
  - Replaced generic spinner with `EmeraldDoveRoundel` on the loading screen.
  - Fixed step indicator to ensure label never exceeds total steps (`currentStep > 8 ? 'Generating Plan' : 'Step X of 8'`).
- **`src/components/OfflineTripSummaryModal.tsx`**:
  - Integrated `EmeraldDoveRoundel` in the official offline dossier header banner.
- **`src/data/districts/coimbatore.ts` & `src/data/districts_info.ts`**:
  - Replaced mismatched coastal cliff image for Marudhamalai Murugan Temple and Coimbatore district card with neutral gradient SVG placeholders.

---

## 2. Cross-District Bug Fix & Strict Per-District Filtering

- **`src/services/itineraryEngine.ts`**:
  - Enforced strict `place.district === selectedDistrict` exact matching.
  - Eliminated cross-district fallback, padding, "nearby", and random-fill behaviors.
  - Handled multi-day itineraries in smaller districts by scheduling authentic local rest/meal intervals without borrowing outside places.
- **`src/services/smartSearch.ts`**:
  - Removed fallback to broader district items when category search yields empty results.
- **`src/components/ExploreView.tsx`**:
  - Applied strict district filtering and dynamic module lazy-loading.
- **`src/data/districts/*.ts` (All 38 Districts)**:
  - 38 modular TypeScript files covering every official district in Tamil Nadu.
  - Strict 19-field schema with zero fabrication, authoritative source URLs, and null for unverified fields.
- **`scripts/validateData.ts` & `package.json`**:
  - Added automated CLI command `npm run validate:data`.
  - Verifies all 38 districts exist, coordinates within TN bounds [8.0–14.0 lat, 76.0–81.0 lng], allowed categories, word counts, and source URLs.

---

## 3. Step 1: "NEXT" Phase Features

### 3.1 Live Weather Forecast Planning
- **`src/services/weatherService.ts`**:
  - Integrated Open-Meteo free API (no API key required).
  - Fetches 7-day atmospheric forecast: max/min temperatures, precipitation probability, wind speed, and WMO weather codes.
  - Real-time weather advisories:
    - Rain probability >= 60%: advises covered/indoor stops, warns about steep hill and ghat roads with explicit "Why at this time?" explainability.
    - High heat >= 36°C: advises avoiding open-air midday visits (11:30 AM – 03:30 PM) to protect against hot temple stone pavements.
    - Hill stations (Nilgiris, Dindigul, Theni): alerts regarding morning chill & woolens.
  - Beyond 7-day range: fallback to verified typical seasonal climate estimates.
  - Offline snapshot caching: saves report to local storage with "Forecast as of <timestamp>"; displays offline snapshot when offline.
  - Attribution: "Source: Open-Meteo".
  - Graceful error handling: never yields empty screen.
- **`src/components/WeatherForecastWidget.tsx`**:
  - 7-day interactive day-by-day temperature and rain selector with weather icons and scheduling advisory rules.
- **`src/components/TamilWeatherBadge.tsx`**:
  - Cultural climate pattern badges (Monsoon, Dry, Humid, Mountain Cool) with traditional SVG glyphs.
- **`src/components/DestinationCard.tsx`**:
  - Integrated `TamilWeatherBadge` and optimal timing weather bar citing "Source: Open-Meteo".

### 3.2 Stays and Hotel Rooms (Verified TTDC & District Lodges)
- **`src/data/stays/*.ts` (All 38 Districts) & `src/data/stays/types.ts`**:
  - Per-district lazy-loaded accommodation datasets.
  - Schema: `id`, `name`, `nameTamil`, `district`, `locality`, `type`, `priceBand`, `approxPriceINR`, `checkInTime`, `checkOutTime`, `contactPhone`, `officialBookingUrl`, `accessibilityNotes`, `sourceName`, `sourceUrl`, `confidence`, `lastVerified`.
  - Zero-fabrication: unverified room rates or times stored as `null` and displayed as "Check on official site".
  - Authoritative sources: Tamil Nadu Tourism Development Corporation (`ttdconline.com` / `tamilnadutourism.tn.gov.in`) and official government circuit houses.
- **`src/components/WhereToStayCard.tsx`**:
  - Rendered in Itinerary Dashboard and Offline Trip Dossier.
  - Filtered strictly to destination district.
  - Matched to traveler's budget tier (Budget, Mid-range, Luxury) where verified price band exists.
  - Outbound links to official booking sites (no in-app booking or payments).

### 3.3 Public Transport Guide (Bus and Train)
- **`src/data/transport/*.ts` (All 38 Districts) & `src/data/transport/types.ts`**:
  - Per-district transit hubs with nearest major railway station, station code, primary bus terminals, and direct links to IRCTC & TNSTC.
  - Detailed verified services for key transit hubs (Chennai, Coimbatore, Madurai, Thanjavur, Kanyakumari, The Nilgiris) and connecting districts.
  - Official sources: Southern Railway, Indian Railways, TNSTC, SETC.
  - Warning notice: "Timings can change. Verify on the official site." with `lastVerified` date.
- **`src/components/PublicTransportCard.tsx`**:
  - Rendered in Itinerary Dashboard and Offline Trip Dossier.
  - Displays nearest rail/bus hubs and filterable list of verified train and bus timetables.

### 3.4 Local Fare Estimates (Ride-Hailing Style)
- **`src/config/fares.ts`**:
  - Distance formula: `straightLineDistance x 1.3 (roadFactor)`.
  - Rates configured with comment: `"Approximate planning assumptions. Replace with verified rates."`.
  - Fares calculated as realistic ranges (±15%) for Auto Rickshaw, Private Cab, and Bike Taxi.
- **`src/components/ConsecutiveLegFareEstimator.tsx`**:
  - Automatically rendered between consecutive itinerary stops.
  - Displays distance, estimated fare ranges for auto, cab, and bike taxi, and clear disclaimer note.

---

## 4. Newly Added Modular Features (A to E)

- **Feature A: Plan B for Rain or Extreme Heat (`src/services/planBWeatherEngine.ts` & `src/components/ItineraryDashboard.tsx`)**:
  - Detects high rain chance (≥60%) or severe heat (≥36°C) from the 7-day live weather forecast.
  - Automatically recommends alternative indoor, covered, or shaded places within the exact same district (e.g. state museums, covered halls, indoor galleries).
  - Clearly labeled with **"Plan B – Weather Adjusted"** toggle, while keeping the original plan instantly switchable without losing data.
- **Feature B: One-Tap WhatsApp Share (`src/services/whatsappShare.ts`, `src/components/ItineraryDashboard.tsx`, `src/components/OfflineTripSummaryModal.tsx`)**:
  - Prominent "Share via WhatsApp" action on itinerary dashboard and offline dossier.
  - Formats clean, beautifully structured text including full trip timeline, estimated budget, weather & dress code advisories, emergency numbers, and deep link.
- **Feature C: Strict "Hidden Gems Only" Filter (`src/components/ExploreView.tsx` & `src/components/HiddenGemsView.tsx`)**:
  - Toggle button "Hidden Gems Only" with emerald sparkle indicator in Explore and navigation.
  - Strictly enforces local district boundary (`place.district === selectedDistrict`) while hiding high-crowd hotspots and spotlighting verified tranquil sites.
- **Feature D: Compare Two Districts (`src/components/CompareDistrictsModal.tsx`, `src/components/Navbar.tsx`, `src/components/Footer.tsx`, `src/components/ExploreView.tsx`)**:
  - Side-by-side comparison modal accessible via Navbar, Footer, Explore header, or direct `#compare` hash.
  - Compares temple counts, heritage sites, best visiting seasons, average crowd levels, regional specialties, and top verified food delicacies.
- **Feature E: Offline QR Deep Link (`src/components/OfflinePlaceQRModal.tsx`, `src/components/DestinationCard.tsx`)**:
  - Each destination card features a dedicated QR button.
  - Generates instant client-side QR codes pointing to the offline deep link `#place=<id>`.
  - When scanned or loaded, opens verified visiting hours, entry fees, dress code, official source citations, and local emergency contacts.

