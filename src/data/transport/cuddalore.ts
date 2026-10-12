import { DistrictTransportHub } from './types';

export const cuddaloreTransport: DistrictTransportHub = {
  "district": "Cuddalore",
  "nearestMajorRailwayStation": "Cuddalore Port Junction (CUPJ) & Chidambaram (CDM)",
  "nearestRailwayCode": "CUPJ",
  "majorBusStands": [
    "Cuddalore Central Bus Stand",
    "Chidambaram Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-cuddalore-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Cuddalore Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Cuddalore Central Bus Stand",
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

export default cuddaloreTransport;
