import { DistrictTransportHub } from './types';

export const tiruppurTransport: DistrictTransportHub = {
  "district": "Tiruppur",
  "nearestMajorRailwayStation": "Tiruppur Railway Station (TUP)",
  "nearestRailwayCode": "TUP",
  "majorBusStands": [
    "Tiruppur Old & New Bus Stands"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-tiruppur-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Tiruppur Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Tiruppur Old & New Bus Stands",
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

export default tiruppurTransport;
