import { DistrictTransportHub } from './types';

export const krishnagiriTransport: DistrictTransportHub = {
  "district": "Krishnagiri",
  "nearestMajorRailwayStation": "Hosur Railway Station (HSRA) & Kuppam (KPN)",
  "nearestRailwayCode": "KPN",
  "majorBusStands": [
    "Krishnagiri New Bus Stand",
    "Hosur Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Transport Network",
  "sourceUrl": "https://www.tnstc.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "bus-krishnagiri-tnstc",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Krishnagiri Regional Intercity Bus Link",
      "serviceNumber": null,
      "fromStation": "Krishnagiri New Bus Stand",
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

export default krishnagiriTransport;
