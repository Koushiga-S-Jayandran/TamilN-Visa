import { DistrictTransportHub } from './types';

export const erodeTransport: DistrictTransportHub = {
  "district": "Erode",
  "nearestMajorRailwayStation": "Erode Junction (ED)",
  "nearestRailwayCode": "ED",
  "majorBusStands": [
    "Erode Central Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-erode-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Erode Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Erode Central Bus Stand",
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

export default erodeTransport;
