import { DistrictTransportHub } from './types';

export const nagapattinamTransport: DistrictTransportHub = {
  "district": "Nagapattinam",
  "nearestMajorRailwayStation": "Nagapattinam (NGT) & Velankanni (VLNK)",
  "nearestRailwayCode": "NGT",
  "majorBusStands": [
    "Nagapattinam Bus Stand",
    "Velankanni Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-nagapattinam-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Nagapattinam Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Nagapattinam Bus Stand",
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

export default nagapattinamTransport;
