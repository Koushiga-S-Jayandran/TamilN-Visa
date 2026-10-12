import { DistrictTransportHub } from './types';

export const chennaiTransport: DistrictTransportHub = {
  "district": "Chennai",
  "nearestMajorRailwayStation": "Puratchi Thalaivar Dr. M.G. Ramachandran Central Railway Station (MAS) & Chennai Egmore (MS)",
  "nearestRailwayCode": "MAS / MS",
  "majorBusStands": [
    "Kalaignar Centenary Bus Terminus (KCBT), Kilambakkam",
    "Chennai Mofussil Bus Terminus (CMBT), Koyambedu",
    "Madhavaram Mofussil Bus Terminus (MMBT)"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway & TNSTC Official Timetables",
  "sourceUrl": "https://sr.indianrailways.gov.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "tr-chn-vb-cbe",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Chennai Central - Coimbatore Vande Bharat Express",
      "serviceNumber": "20607",
      "fromStation": "MGR Chennai Central (MAS)",
      "toStation": "Coimbatore Jn (CBE)",
      "departureTime": "06:10 AM",
      "arrivalTime": "11:50 AM",
      "daysOfOperation": "Daily (except Wednesdays)",
      "fareINR": 1365,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-chn-kovai-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Kovai Superfast Express",
      "serviceNumber": "12675",
      "fromStation": "MGR Chennai Central (MAS)",
      "toStation": "Coimbatore Jn (CBE)",
      "departureTime": "06:10 AM",
      "arrivalTime": "02:05 PM",
      "daysOfOperation": "Daily",
      "fareINR": 195,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-chn-pandian-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Pandian Superfast Express",
      "serviceNumber": "12637",
      "fromStation": "Chennai Egmore (MS)",
      "toStation": "Madurai Jn (MDU)",
      "departureTime": "09:40 PM",
      "arrivalTime": "05:35 AM",
      "daysOfOperation": "Daily",
      "fareINR": 285,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-chn-kanyakumari-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Kanyakumari Superfast Express",
      "serviceNumber": "12633",
      "fromStation": "Chennai Egmore (MS)",
      "toStation": "Kanyakumari (CAPE)",
      "departureTime": "05:20 PM",
      "arrivalTime": "05:35 AM",
      "daysOfOperation": "Daily",
      "fareINR": 425,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "bus-chn-setc-madurai",
      "mode": "bus",
      "operator": "SETC",
      "serviceName": "SETC Classic Ultra Deluxe Express",
      "serviceNumber": "SETC-MDU-01",
      "fromStation": "Kilambakkam KCBT, Chennai",
      "toStation": "Mattuthavani Bus Stand, Madurai",
      "departureTime": "08:30 PM",
      "arrivalTime": "05:00 AM",
      "daysOfOperation": "Daily",
      "fareINR": 495,
      "sourceName": "State Express Transport Corporation",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default chennaiTransport;
