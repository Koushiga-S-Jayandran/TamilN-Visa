import { DistrictTransportHub } from './types';

export const dharmapuriTransport: DistrictTransportHub = {
  "district": "Dharmapuri",
  "nearestMajorRailwayStation": "Dharmapuri Railway Station (DPJ)",
  "nearestRailwayCode": "DPJ",
  "majorBusStands": [
    "Dharmapuri Central Bus Stand",
    "Pennagaram Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-dharmapuri-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Dharmapuri Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Dharmapuri Central Bus Stand",
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

export default dharmapuriTransport;
