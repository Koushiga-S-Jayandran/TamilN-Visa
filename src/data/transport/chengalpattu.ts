import { DistrictTransportHub } from './types';

export const chengalpattuTransport: DistrictTransportHub = {
  "district": "Chengalpattu",
  "nearestMajorRailwayStation": "Chengalpattu Junction (CGL)",
  "nearestRailwayCode": "CGL",
  "majorBusStands": [
    "Chengalpattu Bus Stand",
    "Mamallapuram Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-chengalpattu-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Chengalpattu Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Chengalpattu Bus Stand",
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

export default chengalpattuTransport;
