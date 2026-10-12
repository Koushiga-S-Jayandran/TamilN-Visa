import { DistrictTransportHub } from './types';

export const maduraiTransport: DistrictTransportHub = {
  "district": "Madurai",
  "nearestMajorRailwayStation": "Madurai Junction (MDU)",
  "nearestRailwayCode": "MDU",
  "majorBusStands": [
    "Mattuthavani Integrated Bus Terminus (MIBT / MGR Bus Stand)",
    "Arapalayam Bus Stand (West/North-bound: Coimbatore, Theni, Dindigul)",
    "Periyar Bus Stand (Local city & Thirumangalam)"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway Madurai Division & TNSTC Madurai",
  "sourceUrl": "https://sr.indianrailways.gov.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "tr-mdu-vaigai-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Vaigai Superfast Express",
      "serviceNumber": "12636",
      "fromStation": "Madurai Jn (MDU)",
      "toStation": "Chennai Egmore (MS)",
      "departureTime": "07:10 AM",
      "arrivalTime": "02:30 PM",
      "daysOfOperation": "Daily",
      "fareINR": 235,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-mdu-tejas-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Madurai - Chennai Egmore Tejas Express",
      "serviceNumber": "22672",
      "fromStation": "Madurai Jn (MDU)",
      "toStation": "Chennai Egmore (MS)",
      "departureTime": "03:00 PM",
      "arrivalTime": "09:30 PM",
      "daysOfOperation": "Daily (except Thursdays)",
      "fareINR": 1115,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "bus-mdu-rameswaram",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Madurai - Rameswaram Coastal Express",
      "serviceNumber": "TNSTC-MDU-RMM",
      "fromStation": "Mattuthavani Bus Stand, Madurai",
      "toStation": "Rameswaram Bus Stand",
      "departureTime": "06:30 AM",
      "arrivalTime": "10:15 AM",
      "daysOfOperation": "Daily (Every 30 mins)",
      "fareINR": 145,
      "sourceName": "TNSTC Madurai Region",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default maduraiTransport;
