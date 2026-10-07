/**
 * TAMIZN VISA - Application Configuration
 * Centralized configuration for branding, institutional details, and core constants.
 */

export const APP_CONFIG = {
  brandName: 'TAMIZN VISA',
  tagline: 'From Heritage to Hidden Horizons.',
  secondaryTagline: 'Beyond the Famous. Into the Forgotten.',
  creator: {
    name: 'Koushiga S Jayandran',
    institution: 'Sri Ramakrishna Engineering College',
    location: 'Vattamalaipalayam, Coimbatore',
    state: 'Tamil Nadu, India',
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
  version: '2.4.0-Production',
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
