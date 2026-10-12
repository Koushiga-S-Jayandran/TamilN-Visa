import { DistrictTransportHub } from './types';

export const tirunelveliTransport: DistrictTransportHub = {
  "district": "Tirunelveli",
  "nearestMajorRailwayStation": "Tirunelveli Junction (TEN)",
  "nearestRailwayCode": "TEN",
  "majorBusStands": [
    "Tirunelveli New Bus Stand (Vaeinthankulam)",
    "Old Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-tirunelveli-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Tirunelveli Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Tirunelveli New Bus Stand (Vaeinthankulam)",
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

export default tirunelveliTransport;
