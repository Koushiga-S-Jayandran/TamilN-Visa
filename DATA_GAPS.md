# TAMIZN VISA - Data Gaps & Zero-Fabrication Audit

## Policy Statement
TamizN Visa enforces a **Zero-Fabrication Guarantee**. When official governmental or authoritative tourism data (TTDC, ASI, HR&CE, Forest Dept, Southern Railway, TNSTC) cannot be definitively verified:
- We **never invent or guess** numbers, timings, prices, or room costs.
- The field is assigned `null` in the dataset.
- The UI renders "Check on official site" with a direct link to the official authority.

---

## 1. Destination Places Audit
- All 38 official districts of Tamil Nadu have at least 2 verified destinations conforming strictly to the 18-field schema.
- High-density districts (Chennai, Coimbatore, Madurai, Thanjavur, Kanyakumari, Dindigul, Nilgiris) have 4 to 6 detailed places.
- Rural/interior districts (Perambalur, Ariyalur, Kallakurichi, Ranipet, Tenkasi) have 2 key historical or natural monuments verified via HR&CE or ASI records.
- Continuous enrichment will add secondary artisan villages and community craft centers.

---

## 2. Stays & Accommodation Audit
- **Sources Used**:
  - TTDC Hotel Tamil Nadu listings (tamilnadutourism.tn.gov.in / ttdconline.com)
  - District official administration guest houses & circuit houses
  - Forest Department eco-lodges (for sanctuary districts like Nilgiris, Theni, Tirunelveli)
- **Data Gap Handling**:
  - Room tariffs that fluctuate seasonally or are unverified are stored as `approxPriceINR: null` and `priceBand: null`.
  - Check-in/check-out timings default to standard `12:00 PM / 11:00 AM` only when confirmed by TTDC policy; otherwise stored as `null`.
  - In-app booking and payments are strictly omitted; all cards route to the official booking site (`ttdconline.com`).

---

## 3. Public Transport Audit
- **Sources Used**:
  - Southern Railway (sr.indianrailways.gov.in / erail.in / irctc.co.in)
  - Tamil Nadu State Transport Corporation (TNSTC - tnstc.in)
  - State Express Transport Corporation (SETC)
- **Detailed Timings Verified**:
  - Chennai Central & Egmore corridors
  - Coimbatore Junction & Gandhipuram Bus Stand corridors
  - Madurai Junction & Mattuthavani Bus Stand
  - Thanjavur Junction & Old/New Bus Stands
  - Kanyakumari Terminal
  - The Nilgiris (Mettupalayam - Udhagamandalam Toy Train 56136/56137 & Ooty Hill Buses)
- **Data Gap Handling**:
  - Rural interior bus services that lack digitized real-time timetable APIs are linked directly to `https://www.tnstc.in`.
  - Train fares without fixed unreserved fares are marked `fareINR: null`.
  - Mandatory disclaimer on all transit cards: *"Timings can change. Verify on official site."* with verification timestamp.

---

## 4. Local Fare Estimation Audit
- Fares are calculated using straight-line Euclidean distance multiplied by a **1.3 road winding coefficient**.
- Standardized approximate rates:
  - Auto: ₹40 base (first 1.8 km) + ₹18/km
  - Cab: ₹100 base (first 4.0 km) + ₹24/km
  - Bike Taxi: ₹25 base (first 2.0 km) + ₹12/km
- All fare estimates display a ±15% range and the explicit disclaimer: *"Approximate planning assumptions. Replace with verified meter / ride-hailing rates."*
