import { DistrictTransportHub } from './types';

export const virudhunagarTransport: DistrictTransportHub = {
  "district": "Virudhunagar",
  "nearestMajorRailwayStation": "Virudhunagar Junction (VPT) & Sivakasi (SVKS)",
  "nearestRailwayCode": "VPT",
  "majorBusStands": [
    "Virudhunagar Bus Stand",
    "Sivakasi Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-virudhunagar-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Virudhunagar Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Virudhunagar Bus Stand",
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

export default virudhunagarTransport;
