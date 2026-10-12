import { DistrictTransportHub } from './types';

export const coimbatoreTransport: DistrictTransportHub = {
  "district": "Coimbatore",
  "nearestMajorRailwayStation": "Coimbatore Junction (CBE) & Podanur Junction (PTJ)",
  "nearestRailwayCode": "CBE",
  "majorBusStands": [
    "Gandhipuram Central Bus Stand (Mofussil & Intercity)",
    "Singanallur Bus Stand (South-bound: Madurai, Trichy)",
    "Ukkadam Bus Stand (Kerala, Pollachi, Palani)"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway Salem Division & TNSTC Coimbatore",
  "sourceUrl": "https://sr.indianrailways.gov.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "tr-cbe-kovai-return",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Kovai Superfast Express",
      "serviceNumber": "12676",
      "fromStation": "Coimbatore Jn (CBE)",
      "toStation": "MGR Chennai Central (MAS)",
      "departureTime": "03:05 PM",
      "arrivalTime": "10:50 PM",
      "daysOfOperation": "Daily",
      "fareINR": 195,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-cbe-cheran-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Cheran Superfast Express",
      "serviceNumber": "12674",
      "fromStation": "Coimbatore Jn (CBE)",
      "toStation": "MGR Chennai Central (MAS)",
      "departureTime": "10:50 PM",
      "arrivalTime": "07:00 AM",
      "daysOfOperation": "Daily",
      "fareINR": 310,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-cbe-nmr-conn",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Mettupalayam Passenger (Connecting to Nilgiri Toy Train)",
      "serviceNumber": "06812",
      "fromStation": "Coimbatore Jn (CBE)",
      "toStation": "Mettupalayam (MTP)",
      "departureTime": "05:20 AM",
      "arrivalTime": "06:15 AM",
      "daysOfOperation": "Daily",
      "fareINR": 30,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "bus-cbe-ooty-ghat",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Nilgiris Mountain Ghat Express Service",
      "serviceNumber": "TNSTC-CBE-OOTY",
      "fromStation": "Gandhipuram Bus Stand, Coimbatore",
      "toStation": "Ooty Central Bus Stand",
      "departureTime": "06:00 AM",
      "arrivalTime": "09:30 AM",
      "daysOfOperation": "Daily (Every 20 mins from 05:00 AM to 09:30 PM)",
      "fareINR": 95,
      "sourceName": "TNSTC Coimbatore Region",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default coimbatoreTransport;
