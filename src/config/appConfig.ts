/**
 * TAMIZN VISA - Application Configuration
 * Centralized configuration for branding, institutional details, and core constants.
 */

export const APP_CONFIG = {
  brandName: 'TAMIZN VISA',
  tagline: 'From Heritage to Hidden Horizons.',
  secondaryTagline: 'Beyond the Famous. Into the Forgotten.',
  creator: {
    name: 'Koushiga.S.Jayandran',
    degree: '1st Yr M.Tech CSE (Integrated 5 yr course)',
    institution: 'Sri Ramakrishna Engineering College (SREC)',
    institutionUrl: 'http://srec.ac.in/',
    location: 'Vattamalaipalayam, Coimbatore',
    state: 'Tamil Nadu, India',
    mentor: {
      name: 'Dr. Sakthivel Aruchamy',
      title: 'Head of the First Year Programme (HoD-FYP)',
      institution: 'Sri Ramakrishna Engineering College (SREC)',
      institutionUrl: 'http://srec.ac.in/',
    },
  },
  futurePlansThreePhases: {
    next: [
      {
        title: 'Stays and Hotel Rooms',
        desc: 'Price range, check-in times, official booking links by budget tier (TTDC and official portals).',
        status: 'Live (beta)',
      },
      {
        title: 'Public Transport Guide',
        desc: 'Bus and train name, number and timings; verified sources TNSTC, SETC and Southern Railway.',
        status: 'Live (beta)',
      },
      {
        title: 'Live Weather Forecast Planning',
        desc: '7-day atmospheric forecast, rainfall probability warnings and midday heat scheduling.',
        status: 'Live (beta)',
      },
      {
        title: 'Rapido-Style Fare Estimates',
        desc: 'Ride-hailing style bike taxi, auto and cab fare estimates between consecutive stops.',
        status: 'Live (beta)',
      },
    ],
    pilot: [
      {
        title: 'Festival-Aware Crowd Forecasts',
        desc: 'Pongal, Chithirai festival, Karthigai Deepam, and temple car festivals scheduling intelligence.',
        status: 'Coming soon',
      },
      {
        title: 'Tamil & Multilingual Interface',
        desc: 'Full bilingual Tamil Nadu vernacular experience in classical Tamil and English.',
        status: 'Coming soon',
      },
      {
        title: 'Tourism-Board Dashboard',
        desc: 'Dedicated analytics and seasonal flow dashboard for TTDC and district offices.',
        status: 'Coming soon',
      },
      {
        title: 'QR Codes at Heritage Sites',
        desc: 'Scannable QR deep links at monuments that open the offline trip dossier.',
        status: 'Live (beta)',
      },
    ],
    scale: [
      {
        title: 'Village & Agri-Tourism Listings',
        desc: 'Authentic village pottery, handloom weaving, and organic farm stay trails.',
        status: 'Coming soon',
      },
      {
        title: 'Solo & Women-Safety Mode',
        desc: 'Well-lit corridors, vetted transport stands, and verified daylight routes.',
        status: 'Coming soon',
      },
      {
        title: 'Group Trips & Expense Splitting',
        desc: 'Collaborative shared itineraries and integrated group budget tracking.',
        status: 'Coming soon',
      },
      {
        title: 'Sustainability Score for Fragile Sites',
        desc: 'Ecological carrying capacity indicators for Nilgiris, Pichavaram, and marine parks.',
        status: 'Coming soon',
      },
    ],
  },
  vision: 'Transforming Tamil Nadu into a smarter, more attractive, and globally competitive tourism destination.',
  problemStatement:
    'Despite being one of India’s richest cultural destinations, Tamil Nadu tourism suffers from poor digital planning tools, overcrowded hotspots, and underexplored hidden locations. Travelers lack access to intelligent scheduling, real-time crowd insights, and personalized trip guidance, resulting in stressful, unoptimized, and incomplete travel experiences.',
  objectives: [
    'Smart Travel Planning with realistic day-wise time buffers',
    'Full Tamil Nadu Coverage across all 38 districts',
    'Evidence-Based Crowd Prediction with full explainability',
    'Personalized Trips according to traveler type, style, and budget',
    'Discover Hidden Gems and reduce congestion at mainstream hubs',
    'Better Time Management (06:00 AM - 09:00 PM realistic windows)',
    'Authentic Food & Local Transport Integration',
    'Offline Access Support with printable dossiers',
    'Simple & Guided User Experience suitable for competitions & tourists',
  ],
  version: '2.5.0-Production',
  status: 'Production Ready',
};

export const TN_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kancheepuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupattur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
] as const;

export type TNDistrict = (typeof TN_DISTRICTS)[number];

export const CATEGORIES = [
  {
    id: 'temples',
    name: 'Temples & Spiritual',
    symbol: '🛕',
    tamilTag: 'கோயில்கள்',
    color: 'from-amber-700 to-amber-900',
    description: 'Chola, Pallava, and Pandya Dravidian architectural marvels',
  },
  {
    id: 'heritage',
    name: 'Heritage & Forts',
    symbol: '🏛',
    tamilTag: 'பாரம்பரியம்',
    color: 'from-orange-700 to-stone-900',
    description: 'Ancient citadels, royal palaces, and historic settlements',
  },
  {
    id: 'beaches',
    name: 'Beaches & Coastal',
    symbol: '🏖',
    tamilTag: 'கடற்கரைகள்',
    color: 'from-blue-700 to-cyan-900',
    description: 'Coromandel shores, three-sea confluences, and quiet bays',
  },
  {
    id: 'hills',
    name: 'Hills & Waterfalls',
    symbol: '⛰',
    tamilTag: 'மலைகள்',
    color: 'from-emerald-700 to-teal-900',
    description: 'Western & Eastern Ghats, tea valleys, and misty cascades',
  },
  {
    id: 'nature',
    name: 'Nature & Wildlife',
    symbol: '🌿',
    tamilTag: 'இயற்கை',
    color: 'from-green-700 to-stone-900',
    description: 'Tidal mangrove forests, bird wetlands, and tiger reserves',
  },
  {
    id: 'hidden_gems',
    name: 'Hidden Gems',
    symbol: '🌅',
    tamilTag: 'மறைந்த பொக்கிஷங்கள்',
    color: 'from-purple-800 to-stone-900',
    description: 'Verified lesser-known treasures to escape tourist congestion',
  },
  {
    id: 'food',
    name: 'Food & Culinary',
    symbol: '🍛',
    tamilTag: 'உணவு கலாச்சாரம்',
    color: 'from-amber-600 to-red-900',
    description: 'Authentic Kongunadu, Chettinad, and Madurai culinary legends',
  },
  {
    id: 'cultural',
    name: 'Culture & Crafts',
    symbol: '🎨',
    tamilTag: 'கலை & பண்பாடு',
    color: 'from-yellow-700 to-stone-900',
    description: 'Athangudi tiles, Kanchipuram silk, bronze idols, and Kolam',
  },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];
