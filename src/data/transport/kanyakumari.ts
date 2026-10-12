import { DistrictTransportHub } from './types';

export const kanyakumariTransport: DistrictTransportHub = {
  "district": "Kanyakumari",
  "nearestMajorRailwayStation": "Kanyakumari Railway Station (CAPE) & Nagercoil Junction (NCJ)",
  "nearestRailwayCode": "CAPE / NCJ",
  "majorBusStands": [
    "Kanyakumari Town Bus Stand (Christopher Bus Stand)",
    "Nagercoil Vadasery Bus Stand (Long-distance & Inter-state)"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway Thiruvananthapuram Division & TNSTC Tirunelveli",
  "sourceUrl": "https://sr.indianrailways.gov.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "tr-cape-ms-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Kanyakumari Superfast Express",
      "serviceNumber": "12634",
      "fromStation": "Kanyakumari (CAPE)",
      "toStation": "Chennai Egmore (MS)",
      "departureTime": "05:50 PM",
      "arrivalTime": "06:10 AM",
      "daysOfOperation": "Daily",
      "fareINR": 425,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-cape-island-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Island Express",
      "serviceNumber": "16525",
      "fromStation": "Kanyakumari (CAPE)",
      "toStation": "Bangalore City (SBC) via Salem",
      "departureTime": "10:10 AM",
      "arrivalTime": "06:40 AM",
      "daysOfOperation": "Daily",
      "fareINR": 480,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "bus-cape-madurai-exp",
      "mode": "bus",
      "operator": "SETC",
      "serviceName": "Cape Comorin Express",
      "serviceNumber": "SETC-CAPE-MDU",
      "fromStation": "Christopher Bus Stand, Kanyakumari",
      "toStation": "Mattuthavani Bus Stand, Madurai",
      "departureTime": "07:00 AM",
      "arrivalTime": "12:30 PM",
      "daysOfOperation": "Daily",
      "fareINR": 260,
      "sourceName": "SETC",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default kanyakumariTransport;
