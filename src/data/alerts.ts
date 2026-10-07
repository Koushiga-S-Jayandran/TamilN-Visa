import { DestinationAlert } from '../types';

/**
 * TAMIZN VISA - Important Real-World Destination Alerts
 * Verified rules, weather cautions, timing regulations, and booking advisories.
 */

export const DESTINATION_ALERTS_DATA: DestinationAlert[] = [
  {
    id: 'alert-ram-dhanushkodi-curfew',
    destinationId: 'ram-dhanushkodi',
    destinationName: 'Dhanushkodi & Arichal Munai',
    district: 'Ramanathapuram',
    alertType: 'TIMING_NOTICE',
    title: 'Daily Police Checkpoint Cutoff at 05:30 PM',
    description:
      'Tamil Nadu Coastal Security Police strictly halt vehicular movement towards Arichal Munai at 05:30 PM. All visitors must clear the sandspit before 06:00 PM for oceanic safety.',
    severity: 'WARNING',
    verifiedSource: 'District Police Ramanathapuram & TTDC',
    verifiedAt: '2026-10-01',
  },
  {
    id: 'alert-mdu-meenakshi-gadgets',
    destinationId: 'mdu-meenakshi',
    destinationName: 'Madurai Meenakshi Sundareswarar Temple',
    district: 'Madurai',
    alertType: 'DRESS_RESTRICTION',
    title: 'Electronic Devices & Strict Dress Code Enforced',
    description:
      'Smartphones, cameras, smartwatches, and leather belts are prohibited inside temple gates. Safely deposit them in official clockrooms outside East or South Tower. Traditional attire mandatory.',
    severity: 'CRITICAL',
    verifiedSource: 'Madurai Bench of Madras High Court & HR&CE Board',
    verifiedAt: '2026-10-03',
  },
  {
    id: 'alert-cbe-siruvani-permit',
    destinationId: 'cbe-siruvani',
    destinationName: 'Siruvani Waterfalls',
    district: 'Coimbatore',
    alertType: 'BOOKING_REQUIRED',
    title: 'Forest Department Eco-Safari Mandatory',
    description:
      'Private vehicles are strictly barred past the Sadivayal forest checkpost. Visitors must board designated Forest Department eco-vans. Entry closes by 02:30 PM.',
    severity: 'NOTICE',
    verifiedSource: 'Tamil Nadu Forest Department (Sadivayal Eco-Tourism Centre)',
    verifiedAt: '2026-09-28',
  },
  {
    id: 'alert-cpt-asi-tickets',
    destinationId: 'cpt-shore-temple',
    destinationName: 'Mamallapuram Shore Temple & Five Rathas',
    district: 'Chengalpattu',
    alertType: 'TIMING_NOTICE',
    title: 'Digital Barcode ASI Ticketing System',
    description:
      'Cash ticketing counters are phased out at Shore Temple. Visitors must scan the official ASI QR code at entrance gates or present pre-booked online tickets from the ASI portal.',
    severity: 'NOTICE',
    verifiedSource: 'Archaeological Survey of India (ASI) Chennai Circle',
    verifiedAt: '2026-10-02',
  },
  {
    id: 'alert-nil-plastic-ban',
    destinationId: 'nil-ooty-botanical',
    destinationName: 'Nilgiris District (Ooty / Coonoor / Kotagiri)',
    district: 'Nilgiris',
    alertType: 'SEASONAL_NOTE',
    title: 'Complete Single-Use Plastic & PET Bottle Ban',
    description:
      'The Nilgiris district strictly penalizes single-use plastic bags, disposable cutlery, and packaged water bottles under 1 liter. Bring reusable stainless steel or copper flasks.',
    severity: 'WARNING',
    verifiedSource: 'Nilgiris District Collectorate Environmental Order',
    verifiedAt: '2026-10-04',
  },
];
