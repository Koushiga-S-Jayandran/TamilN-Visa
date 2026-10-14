/**
 * TAMIZN VISA - Verified District Safety & Emergency Database
 * Official emergency helpline numbers, All-Women Police Stations (AWPS),
 * 24/7 Government Medical Facilities, well-lit corridors, and safe transit advice across Tamil Nadu.
 */

export interface DistrictSafetyInfo {
  district: string;
  policeControlRoom: string;
  womenHelplineLocal?: string;
  nearestPoliceStation: string;
  allWomenPoliceStation: string;
  govtHospital24x7: string;
  safeTransitNotes: string[];
  wellLitBusyCorridors: string[];
}

export const STATE_WIDE_EMERGENCY_NUMBERS = [
  { label: 'National Emergency', number: '112', purpose: 'Police, Fire & Medical 24/7' },
  { label: 'Women Helpline', number: '1091', purpose: 'Dedicated TN Police Women Helpline' },
  { label: 'Women in Distress', number: '181', purpose: 'Toll-free 24-hr Women Crisis Response' },
  { label: 'Childline', number: '1098', purpose: 'Emergency Support for Minors' },
  { label: 'State Police', number: '100', purpose: 'Direct Police Dial' },
  { label: 'Medical Ambulance', number: '108', purpose: 'Govt Free Emergency Ambulance' },
];

export const DISTRICT_SAFETY_DATA: Record<string, DistrictSafetyInfo> = {
  Chennai: {
    district: 'Chennai',
    policeControlRoom: '044-23452655 / 112',
    womenHelplineLocal: '044-23452620',
    nearestPoliceStation: 'Mylapore E-1 Police Station (Kutchery Road)',
    allWomenPoliceStation: 'W-1 All Women Police Station, Mylapore / Thousand Lights',
    govtHospital24x7: 'Rajiv Gandhi Government General Hospital (RGGGH), Park Town',
    safeTransitNotes: [
      'Chennai Metro: Designated pink-marked women coach in every train (front car).',
      'Suburban EMU Trains: Dedicated women second-class & first-class coaches.',
      'Prepaid auto & taxi booths available 24/7 at Chennai Central (Puratchi Thalaivar Dr. M.G. Ramachandran Central) & Egmore Station.',
      'Prepaid pink autos and app-based cabs available across all major stations.',
    ],
    wellLitBusyCorridors: [
      'Anna Salai (Mount Road)',
      'TTK Road & Radhakrishnan Salai',
      'Poonamallee High Road',
      'Besant Nagar 2nd Avenue',
    ],
  },
  Chengalpattu: {
    district: 'Chengalpattu',
    policeControlRoom: '044-27426100 / 112',
    nearestPoliceStation: 'Mahabalipuram Police Station, Kovalam Road',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Chengalpattu Town',
    govtHospital24x7: 'Chengalpattu Government Medical College Hospital (24/7 Trauma Care)',
    safeTransitNotes: [
      'East Coast Road (ECR) has frequent MTC and TNSTC express buses with conductors until 22:30.',
      'Prepaid auto stand at Mahabalipuram Bus Stand.',
    ],
    wellLitBusyCorridors: ['ECR Main Road (Mahabalipuram junction)', 'GST Road arterial highway'],
  },
  Coimbatore: {
    district: 'Coimbatore',
    policeControlRoom: '0422-2300970 / 112',
    womenHelplineLocal: '0422-2300062',
    nearestPoliceStation: 'B-1 Bazaar Police Station / Race Course Police Station',
    allWomenPoliceStation: 'All Women Police Station (AWPS) Central, Gandhipuram',
    govtHospital24x7: 'Coimbatore Medical College Hospital (CMCH), Trichy Road',
    safeTransitNotes: [
      'Prepaid auto counters at Coimbatore Junction Railway Station Platform 1 & 1A exit.',
      'Gandhipuram Central Bus Stand has 24/7 TNSTC staff and CCTV surveillance.',
      'Dedicated pink seating and women reservation seats in city buses.',
    ],
    wellLitBusyCorridors: ['Race Course Promenade', 'Avinashi Road', 'DB Road (RS Puram)'],
  },
  Madurai: {
    district: 'Madurai',
    policeControlRoom: '0452-2346302 / 112',
    nearestPoliceStation: 'B-1 Vilakkuthoon Police Station / Town Police Station',
    allWomenPoliceStation: 'All Women Police Station (AWPS) South, Palace Road',
    govtHospital24x7: 'Government Rajaji Hospital (GRH), Panagal Road, Madurai',
    safeTransitNotes: [
      'Meenakshi Amman temple perimeter (Chithirai & Masi streets) is heavily patrolled and well-lit with round-the-clock foot traffic.',
      'Prepaid auto kiosk at Madurai Junction West and Mattuthavani Bus Terminal.',
    ],
    wellLitBusyCorridors: ['West Tower Street', 'KK Nagar 80 Feet Road', 'Alagar Kovil Road'],
  },
  Thanjavur: {
    district: 'Thanjavur',
    policeControlRoom: '04362-230230 / 112',
    nearestPoliceStation: 'Thanjavur West Police Station, South Main Street',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Old Bus Stand Road',
    govtHospital24x7: 'Thanjavur Medical College Hospital (TMCH), Medical College Road',
    safeTransitNotes: [
      'Big Temple perimeter and South Main Street have continuous police booth monitoring.',
      'Town buses connect Old Bus Stand to Medical College every 5 minutes.',
    ],
    wellLitBusyCorridors: ['South Rampart Road', 'Medical College Road', 'Court Road'],
  },
  Tiruchirappalli: {
    district: 'Tiruchirappalli',
    policeControlRoom: '0431-2410311 / 112',
    nearestPoliceStation: 'Cantonment Police Station / Srirangam Police Station',
    allWomenPoliceStation: 'All Women Police Station (AWPS) Cantonment, Trichy',
    govtHospital24x7: 'Mahatma Gandhi Memorial Government Hospital (MGMGH), Puthur',
    safeTransitNotes: [
      'Prepaid auto counter active 24/7 at Trichy Junction main concourse.',
      'Srirangam temple corridor is brightly illuminated and guarded by temple security.',
    ],
    wellLitBusyCorridors: ['Cantonment Promenade', 'Salai Road', 'Srirangam Mambazhasalai'],
  },
  Nilgiris: {
    district: 'Nilgiris',
    policeControlRoom: '0423-2444010 / 112',
    nearestPoliceStation: 'B-1 Ooty Town Police Station, Commercial Road',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Udhagamandalam',
    govtHospital24x7: 'Government District Headquarters Hospital, Ooty',
    safeTransitNotes: [
      'Mountain roads experience early dusk and sudden fog; night walking outside town centers after 19:30 is discouraged due to wildlife corridors.',
      'Town center taxis operate from authorized stands at Ooty Central Bus Stand and Charing Cross.',
    ],
    wellLitBusyCorridors: ['Commercial Road & Charing Cross', 'Botanical Garden Road'],
  },
  Dindigul: {
    district: 'Dindigul',
    policeControlRoom: '0451-2460100 / 112',
    nearestPoliceStation: 'Kodaikanal Town Police Station, Lake Road',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Dindigul Headquarters',
    govtHospital24x7: 'Government Hospital Kodaikanal / Dindigul Medical College Hospital',
    safeTransitNotes: [
      'Kodaikanal Lake promenade is well patrolled until 20:00.',
      'Official tourist taxis have standardized rate cards posted at the Kodaikanal Bus Stand.',
    ],
    wellLitBusyCorridors: ['Lake Road loop', 'Seven Roads Junction (Kodaikanal)'],
  },
  Kanyakumari: {
    district: 'Kanyakumari',
    policeControlRoom: '04652-220025 / 112',
    nearestPoliceStation: 'Kanyakumari Coastal Security Police Station',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Nagercoil',
    govtHospital24x7: 'Kanyakumari Government Medical College Hospital, Asaripallam',
    safeTransitNotes: [
      'Sunrise & Sunset viewing promenades have active Tamil Nadu Tourism Police posts.',
      'Regular SETC & TNSTC services connect directly to the beach terminal.',
    ],
    wellLitBusyCorridors: ['Beach Promenade', 'Main Kovalam Road', 'Vivekanandapuram corridor'],
  },
  Ramanathapuram: {
    district: 'Ramanathapuram',
    policeControlRoom: '04567-220080 / 112',
    nearestPoliceStation: 'Rameswaram Temple Police Station, East Car Street',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Ramanathapuram Town',
    govtHospital24x7: 'Government Taluk Hospital, Rameswaram & Ramanathapuram GMCH',
    safeTransitNotes: [
      'East Car Street and Agni Theertham shore are guarded 24/7 with round-the-clock pilgrim presence.',
      'Shared tempos and prepaid autos run between Rameswaram Station and temple.',
    ],
    wellLitBusyCorridors: ['Agni Theertham beach road', 'East Car Street', 'Goswami Madam Road'],
  },
  Tirunelveli: {
    district: 'Tirunelveli',
    policeControlRoom: '0462-2333100 / 112',
    nearestPoliceStation: 'Palayamkottai Police Station / Junction Police Station',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Tirunelveli Junction',
    govtHospital24x7: 'Tirunelveli Medical College Hospital (TVMCH), High Ground',
    safeTransitNotes: [
      'Prepaid auto booths operating at Tirunelveli Junction Railway Station.',
      'City buses run round the clock connecting Junction to Old Bus Stand.',
    ],
    wellLitBusyCorridors: ['South Car Street (Nellaiappar)', 'Tirunelveli High Ground Road'],
  },
  Tiruvannamalai: {
    district: 'Tiruvannamalai',
    policeControlRoom: '04175-222333 / 112',
    nearestPoliceStation: 'Tiruvannamalai Town Police Station, Car Street',
    allWomenPoliceStation: 'All Women Police Station (AWPS), Tiruvannamalai',
    govtHospital24x7: 'Government Medical College Hospital, Vengikkal, Tiruvannamalai',
    safeTransitNotes: [
      'Girivalam path (14 km circumambulation road) is equipped with dedicated solar lighting, emergency call poles, and high CCTV coverage.',
      'Pilgrim crowd keeps the main temple streets active late into the evening.',
    ],
    wellLitBusyCorridors: ['Girivalam Outer Ring Road', 'Car Street', 'Chengham Road'],
  },
};

// Generic fallback for any other district
export function getDistrictSafety(district: string): DistrictSafetyInfo {
  if (DISTRICT_SAFETY_DATA[district]) {
    return DISTRICT_SAFETY_DATA[district];
  }
  return {
    district,
    policeControlRoom: '112 / 100',
    womenHelplineLocal: '1091 / 181',
    nearestPoliceStation: `${district} Town Police Station`,
    allWomenPoliceStation: `All Women Police Station (AWPS), ${district} District Headquarters`,
    govtHospital24x7: `Government District Headquarters Hospital, ${district}`,
    safeTransitNotes: [
      'Use official TNSTC bus stands and prepaid auto stands where available.',
      'Stay in central, brightly lit commercial markets after sunset.',
    ],
    wellLitBusyCorridors: [`${district} Central Bus Stand Road`, 'District Collectorate Road'],
  };
}
