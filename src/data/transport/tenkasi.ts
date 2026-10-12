import { DistrictTransportHub } from './types';

export const tenkasiTransport: DistrictTransportHub = {
  "district": "Tenkasi",
  "nearestMajorRailwayStation": "Tenkasi Junction (TSI) & Sengottai (SCT)",
  "nearestRailwayCode": "TSI",
  "majorBusStands": [
    "Tenkasi New Bus Stand",
    "Courtallam Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-tenkasi-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Tenkasi Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Tenkasi New Bus Stand",
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

export default tenkasiTransport;
