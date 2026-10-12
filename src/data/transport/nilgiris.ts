import { DistrictTransportHub } from './types';

export const nilgirisTransport: DistrictTransportHub = {
  "district": "Nilgiris",
  "nearestMajorRailwayStation": "Udhagamandalam Railway Station (UAM - Heritage) & Mettupalayam (MTP - Broad Gauge Junction)",
  "nearestRailwayCode": "UAM / MTP",
  "majorBusStands": [
    "Udhagamandalam (Ooty) Central Bus Stand",
    "Coonoor Municipal Bus Stand",
    "Kotagiri Bus Stand"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway UNESCO Heritage NMR & TNSTC Nilgiris",
  "sourceUrl": "https://sr.indianrailways.gov.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "tr-nmr-toy-up",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Nilgiri Mountain Railway (Heritage Toy Train - Uphill)",
      "serviceNumber": "56136",
      "fromStation": "Mettupalayam (MTP)",
      "toStation": "Udhagamandalam (UAM)",
      "departureTime": "07:10 AM",
      "arrivalTime": "12:00 PM",
      "daysOfOperation": "Daily",
      "fareINR": 205,
      "sourceName": "Southern Railway (UNESCO World Heritage Line)",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-nmr-toy-down",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Nilgiri Mountain Railway (Heritage Toy Train - Downhill)",
      "serviceNumber": "56137",
      "fromStation": "Udhagamandalam (UAM)",
      "toStation": "Mettupalayam (MTP)",
      "departureTime": "02:00 PM",
      "arrivalTime": "05:35 PM",
      "daysOfOperation": "Daily",
      "fareINR": 205,
      "sourceName": "Southern Railway (UNESCO World Heritage Line)",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "bus-ooty-cbe-direct",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Nilgiris High-Frequency Ghat Bus",
      "serviceNumber": "TNSTC-OOTY-CBE",
      "fromStation": "Ooty Central Bus Stand",
      "toStation": "Gandhipuram Bus Stand, Coimbatore",
      "departureTime": "05:30 AM",
      "arrivalTime": "09:00 AM",
      "daysOfOperation": "Daily (Every 15-20 mins)",
      "fareINR": 95,
      "sourceName": "TNSTC Nilgiris Region",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default nilgirisTransport;
