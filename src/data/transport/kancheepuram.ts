import { DistrictTransportHub } from './types';

export const kancheepuramTransport: DistrictTransportHub = {
  "district": "Kancheepuram",
  "nearestMajorRailwayStation": "Kanchipuram Railway Station (CJ)",
  "nearestRailwayCode": "CJ",
  "majorBusStands": [
    "Kanchipuram Central Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-kancheepuram-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Kancheepuram Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Kanchipuram Central Bus Stand",
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

export default kancheepuramTransport;
