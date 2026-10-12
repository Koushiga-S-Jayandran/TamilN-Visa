import { DistrictTransportHub } from './types';

export const thanjavurTransport: DistrictTransportHub = {
  "district": "Thanjavur",
  "nearestMajorRailwayStation": "Thanjavur Junction (TJ) & Kumbakonam (KMU)",
  "nearestRailwayCode": "TJ",
  "majorBusStands": [
    "Thanjavur New Bus Stand (Near Housing Unit / Medical College Road)",
    "Thanjavur Old Bus Stand (City & nearby heritage temple services)"
  ],
  "officialTrainBookingUrl": "https://www.irctc.co.in",
  "officialBusBookingUrl": "https://www.tnstc.in",
  "warningNotice": "Timings can change due to seasonal operations and track maintenance. Verify on the official site before travel.",
  "sourceName": "Southern Railway Tiruchirappalli Division & TNSTC Kumbakonam",
  "sourceUrl": "https://sr.indianrailways.gov.in",
  "lastVerified": "2026-03",
  "verifiedServices": [
    {
      "id": "tr-tj-uzhavan-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Uzhavan Express",
      "serviceNumber": "16866",
      "fromStation": "Thanjavur Jn (TJ)",
      "toStation": "Chennai Egmore (MS)",
      "departureTime": "09:50 PM",
      "arrivalTime": "06:15 AM",
      "daysOfOperation": "Daily",
      "fareINR": 235,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "tr-tj-cholan-exp",
      "mode": "train",
      "operator": "Southern Railway",
      "serviceName": "Cholan Superfast Express",
      "serviceNumber": "22676",
      "fromStation": "Thanjavur Jn (TJ)",
      "toStation": "Chennai Egmore (MS)",
      "departureTime": "11:45 AM",
      "arrivalTime": "06:15 PM",
      "daysOfOperation": "Daily",
      "fareINR": 200,
      "sourceName": "Southern Railway",
      "sourceUrl": "https://sr.indianrailways.gov.in",
      "lastVerified": "2026-03"
    },
    {
      "id": "bus-tj-trichy-shuttle",
      "mode": "bus",
      "operator": "TNSTC",
      "serviceName": "Thanjavur - Trichy Point-to-Point Shuttle",
      "serviceNumber": "TNSTC-TJ-TPJ",
      "fromStation": "Thanjavur New Bus Stand",
      "toStation": "Trichy Central Bus Stand",
      "departureTime": "Frequent",
      "arrivalTime": "1 hr 15 mins transfer",
      "daysOfOperation": "Daily (Every 10 mins)",
      "fareINR": 60,
      "sourceName": "TNSTC Kumbakonam Division",
      "sourceUrl": "https://www.tnstc.in",
      "lastVerified": "2026-03"
    }
  ]
};

export default thanjavurTransport;
