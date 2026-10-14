/**
 * TAMIZN VISA - Women's Travel Community Initial Data (Part 9)
 * Verified female guides, authentic safety tips by district, and companion finder.
 */

export interface FemaleGuide {
  id: string;
  name: string;
  district: string;
  languages: string[];
  contactUrl: string;
  verified: boolean;
  specialization: string;
  shortBio: string;
  rating: number;
}

export interface CommunitySafetyTip {
  id: string;
  authorName: string;
  authorCity: string;
  isVerifiedUser: boolean;
  district: string;
  category: 'Safety' | 'Transport' | 'Stays' | 'Food' | 'Solo-friendly';
  title: string;
  content: string;
  timestamp: string;
  upvotes: number;
  reportedCount: number;
}

export interface CompanionPost {
  id: string;
  authorName: string;
  authorCity: string;
  isVerifiedUser: boolean;
  destinationDistrict: string;
  travelMonth: string;
  preferredPacing: 'Slow travel' | 'Moderate' | 'Action-packed';
  description: string;
  timestamp: string;
  repliesCount: number;
  reportedCount: number;
}

export const VERIFIED_FEMALE_GUIDES: FemaleGuide[] = [
  {
    id: 'guide-1',
    name: 'Revathi Sundaram',
    district: 'Madurai',
    languages: ['Tamil', 'English', 'Hindi'],
    contactUrl: 'https://tamilnadutourism.tn.gov.in',
    verified: true,
    specialization: 'Meenakshi Temple Heritage & Street Food Walks',
    shortBio: 'Certified Tamil Nadu Tourism cultural guide with 8+ years leading solo women and family tours through the ancient temple corridors of Madurai.',
    rating: 4.9,
  },
  {
    id: 'guide-2',
    name: 'Kanimozhi Selvam',
    district: 'Nilgiris',
    languages: ['Tamil', 'English', 'Badaga'],
    contactUrl: 'https://tamilnadutourism.tn.gov.in',
    verified: true,
    specialization: 'Tea Estate Trails & Toda Artisan Villages',
    shortBio: 'Born and raised in Udhagamandalam; passionate about safe eco-trekking, botanical flora, and indigenous Nilgiri tribal textile preservation.',
    rating: 5.0,
  },
  {
    id: 'guide-3',
    name: 'Dr. Preethi Meenakshi',
    district: 'Thanjavur',
    languages: ['Tamil', 'English'],
    contactUrl: 'https://tamilnadutourism.tn.gov.in',
    verified: true,
    specialization: 'Chola Dynasty Architecture & Bronze Heritage',
    shortBio: 'Art historian and heritage curator specializing in Brihadisvara Temple inscriptions, Maratha royal palace library, and Thanjavur painting workshops.',
    rating: 4.8,
  },
  {
    id: 'guide-4',
    name: 'Janaki Ramachandran',
    district: 'Chennai',
    languages: ['Tamil', 'English', 'French'],
    contactUrl: 'https://tamilnadutourism.tn.gov.in',
    verified: true,
    specialization: 'Mylapore Heritage Corridors & Classical Arts',
    shortBio: 'Leads morning heritage and architectural walks through historic Mylapore, Kapaleeshwarar tank streets, and Santhome colonial precincts.',
    rating: 4.9,
  },
  {
    id: 'guide-5',
    name: 'Jayanthi Soundararajan',
    district: 'Sivaganga',
    languages: ['Tamil', 'English'],
    contactUrl: 'https://tamilnadutourism.tn.gov.in',
    verified: true,
    specialization: 'Chettinad Heritage Mansions & Culinary Host',
    shortBio: 'Kanadukathan local host and Athangudi tile craft enthusiast. Specializes in safe cultural stays and traditional heritage kitchen masterclasses.',
    rating: 4.9,
  },
  {
    id: 'guide-6',
    name: 'Selvi Muthuram',
    district: 'Kanyakumari',
    languages: ['Tamil', 'English', 'Malayalam'],
    contactUrl: 'https://tamilnadutourism.tn.gov.in',
    verified: true,
    specialization: 'Triveni Sangam & Coastal Women Crafts',
    shortBio: 'Certified guide for Kanyakumari coastal landmarks, Vivekananda Rock Memorial procedures, and sea-shell handicraft cooperatives.',
    rating: 4.7,
  },
];

export const INITIAL_SAFETY_TIPS: CommunitySafetyTip[] = [
  {
    id: 'tip-1',
    authorName: 'Aishwarya R.',
    authorCity: 'Chennai',
    isVerifiedUser: true,
    district: 'Chennai',
    category: 'Transport',
    title: 'Chennai Metro & EMU Women Coaches Guidance',
    content: 'On Chennai Metro, the front coach towards Chennai Central is dedicated for women and marked with pink indicators. On suburban trains (Beach - Tambaram), look for the green and yellow striped women-only compartments.',
    timestamp: '2026-09-12T10:30:00Z',
    upvotes: 42,
    reportedCount: 0,
  },
  {
    id: 'tip-2',
    authorName: 'Gayathri M.',
    authorCity: 'Madurai',
    isVerifiedUser: true,
    district: 'Madurai',
    category: 'Safety',
    title: 'Safe Evening Walk Around Meenakshi Temple',
    content: 'The Chithirai and Masi concentric streets around the temple are active and crowded until 22:00 every night. If needing an auto late at night, use the pre-paid auto booth right by West Tower gate.',
    timestamp: '2026-09-24T14:15:00Z',
    upvotes: 38,
    reportedCount: 0,
  },
  {
    id: 'tip-3',
    authorName: 'Sneha Venkatesh',
    authorCity: 'Coimbatore',
    isVerifiedUser: false,
    district: 'Nilgiris',
    category: 'Solo-friendly',
    title: 'Ooty Dusk & Wildlife Caution for Solo Walkers',
    content: 'Dusk sets fast in the Nilgiris, often accompanied by heavy mist after 17:30. Solo travelers should stay in Charing Cross or Commercial Road and avoid walking alone along unlit tea estate roads after dark.',
    timestamp: '2026-10-02T08:45:00Z',
    upvotes: 29,
    reportedCount: 0,
  },
  {
    id: 'tip-4',
    authorName: 'Bhavani K.',
    authorCity: 'Tiruvannamalai',
    isVerifiedUser: true,
    district: 'Tiruvannamalai',
    category: 'Solo-friendly',
    title: 'Girivalam Path Lighting and Police Support',
    content: 'The 14 km Girivalam ring path is equipped with solar street lighting and police patrol booths every 2 km. It is especially vibrant and safe during Pournami (Full Moon) when thousands of devotees walk.',
    timestamp: '2026-10-05T16:20:00Z',
    upvotes: 51,
    reportedCount: 0,
  },
];

export const INITIAL_COMPANION_POSTS: CompanionPost[] = [
  {
    id: 'comp-1',
    authorName: 'Pooja Narayanan',
    authorCity: 'Bengaluru',
    isVerifiedUser: true,
    destinationDistrict: 'Dindigul',
    travelMonth: 'November 2026',
    preferredPacing: 'Slow travel',
    description: 'Planning a 3-day quiet photography & hiking trip in Kodaikanal (Lake loop, Pillar Rocks, and Vattakanal). Looking for a female travel buddy to share cab costs and explore cafes safely.',
    timestamp: '2026-10-08T11:00:00Z',
    repliesCount: 3,
    reportedCount: 0,
  },
  {
    id: 'comp-2',
    authorName: 'Vasanthi S.',
    authorCity: 'Coimbatore',
    isVerifiedUser: false,
    destinationDistrict: 'Thanjavur',
    travelMonth: 'December 2026',
    preferredPacing: 'Moderate',
    description: 'Solo architecture explorer heading to Great Living Chola Temples (Thanjavur, Gangaikonda Cholapuram, and Darasuram). Looking for a companion who loves history and temple photography.',
    timestamp: '2026-10-10T09:30:00Z',
    repliesCount: 2,
    reportedCount: 0,
  },
];
