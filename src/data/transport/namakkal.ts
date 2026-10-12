import { DistrictTransportHub } from './types';

export const namakkalTransport: DistrictTransportHub = {
  "district": "Namakkal",
  "nearestMajorRailwayStation": "Namakkal Railway Station (NMKL)",
  "nearestRailwayCode": "NMKL",
  "majorBusStands": [
    "Namakkal Bus Stand",
    "Rasipuram Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-namakkal-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Namakkal Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Namakkal Bus Stand",
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

export default namakkalTransport;
