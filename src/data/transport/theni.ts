import { DistrictTransportHub } from './types';

export const theniTransport: DistrictTransportHub = {
  "district": "Theni",
  "nearestMajorRailwayStation": "Bodinayakkanur (BDNK) & Dindigul Jn (DG - 72 km)",
  "nearestRailwayCode": "BDNK",
  "majorBusStands": [
    "Theni New Bus Stand",
    "Periyakulam Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-theni-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Theni Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Theni New Bus Stand",
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

export default theniTransport;
