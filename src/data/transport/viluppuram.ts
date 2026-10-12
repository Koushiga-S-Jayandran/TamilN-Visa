import { DistrictTransportHub } from './types';

export const viluppuramTransport: DistrictTransportHub = {
  "district": "Viluppuram",
  "nearestMajorRailwayStation": "Villupuram Junction (VM)",
  "nearestRailwayCode": "VM",
  "majorBusStands": [
    "Villupuram Central Bus Stand",
    "Gingee Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-viluppuram-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Viluppuram Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Villupuram Central Bus Stand",
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

export default viluppuramTransport;
