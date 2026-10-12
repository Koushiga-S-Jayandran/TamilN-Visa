import { DistrictTransportHub } from './types';

export const velloreTransport: DistrictTransportHub = {
  "district": "Vellore",
  "nearestMajorRailwayStation": "Katpadi Junction (KPD) & Vellore Cantt (VLR)",
  "nearestRailwayCode": "KPD",
  "majorBusStands": [
    "Vellore New Bus Stand (Selliamman Koil Street)"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-vellore-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Vellore Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Vellore New Bus Stand (Selliamman Koil Street)",
      "toStation": "Regional Hub",
      "departureTime": null,
      "arrivalTime": null,
      "daysOfOperation": "Daily Services",
      "fareINR": null,
      "sourceName": "TNSTC Official Schedule Portal",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default velloreTransport;
