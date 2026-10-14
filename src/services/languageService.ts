/**
 * TAMIZN VISA - Tamil & English Bilingual Translation Engine (Part 10)
 * Provides instant English <-> Tamil toggle across navigation, planner,
 * timeline, buttons, categories, safety advisories, and cultural vocabulary.
 */

export type Language = 'en' | 'ta';

export const TRANSLATIONS = {
  // Navigation
  navExplore: { en: 'Explore', ta: 'ஆராய்க' },
  navDestinations: { en: 'Destinations', ta: 'இடங்கள்' },
  navCulture: { en: 'Culture', ta: 'கலாச்சாரம்' },
  navFood: { en: 'Food', ta: 'உணவு' },
  navCompare: { en: 'Compare', ta: 'ஒப்பிடுக' },
  navPlan: { en: 'Plan', ta: 'திட்டமிடுக' },
  navSaved: { en: 'Saved', ta: 'சேமித்தவை' },
  navAbout: { en: 'About TamizN Visa', ta: 'தமிழ்ப் பயணம் பற்றி' },

  // Hero Section
  heroTagline: {
    en: 'TAMIL NADU TRIP PLANNER • ALL 38 DISTRICTS',
    ta: 'தமிழ்நாடு பயணத் திட்டமிடுபவர் • 38 மாவட்டங்கள்',
  },
  heroHeading: {
    en: 'Explore the Sacred Land of Dravidian Heritage',
    ta: 'திராவிடப் பண்பாட்டுப் பெருமைமிகு தமிழ்நாட்டை ஆராயுங்கள்',
  },
  heroSubheading: {
    en: 'Real-time verified itinerary planner with zero fabrication, authentic local foods, dynamic budget tracking, and solo traveler safety.',
    ta: 'முழுமையான உண்மைத் தரவுகளுடன் கூடிய பயணத் திட்டமிடுபவர், பாரம்பரிய உணவுகள் மற்றும் மகளிர் பாதுகாப்பு வசதிகள்.',
  },
  heroStartPlanning: { en: 'Start Trip Planner', ta: 'பயணத்தை திட்டமிடுங்கள்' },
  heroExploreDistricts: { en: 'Explore 38 Districts', ta: '38 மாவட்டங்களை ஆராய்க' },

  // Planner Steps
  step1Title: {
    en: 'Step 1: Choose Your Destination District',
    ta: 'படி 1: உங்கள் பயண மாவட்டத்தைத் தேர்ந்தெடுக்கவும்',
  },
  step1Desc: {
    en: 'Select from all 38 verified districts of Tamil Nadu.',
    ta: 'தமிழ்நாட்டின் 38 அரசு அங்கீகாரம் பெற்ற மாவட்டங்களிலிருந்து தேர்ந்தெடுக்கவும்.',
  },
  step2Title: {
    en: 'Step 2: When Are You Traveling?',
    ta: 'படி 2: நீங்கள் எப்போது பயணம் செய்கிறீர்கள்?',
  },
  step2Desc: {
    en: 'Travel dates determine festival crowds, weekend surges, and seasonal weather factors.',
    ta: 'பயணத் தேதி திருவிழாக் கூட்டம் மற்றும் காலநிலையைக் கணக்கிடப் பயன்படுகிறது.',
  },
  step3Title: {
    en: 'Step 3: Number of Days',
    ta: 'படி 3: பயண நாட்கள் எண்ணிக்கை',
  },
  step3Desc: {
    en: 'Realistic 06:00 AM – 09:00 PM day windows organized geographically without backtracking.',
    ta: 'காலை 06:00 முதல் இரவு 09:00 மணி வரை அலையாமல் திட்டமிடப்பட்ட பயண அட்டவணை.',
  },
  step4Title: {
    en: 'Step 4: Number of Travelers',
    ta: 'படி 4: பயணிகளின் எண்ணிக்கை',
  },
  step5Title: {
    en: 'Step 5: Traveler Profile',
    ta: 'படி 5: உங்கள் பயணக் குழு வகை',
  },
  step6Title: {
    en: 'Step 6: Estimated Budget Tier',
    ta: 'படி 6: திட்டமிடப்பட்ட கட்டண நிலை',
  },
  step7Title: {
    en: 'Step 7: Key Heritage Interests',
    ta: 'படி 7: உங்களின் முக்கிய ஆர்வங்கள்',
  },
  step8Title: {
    en: 'Step 8: Pacing & Travel Preferences',
    ta: 'படி 8: பயண வேகம் மற்றும் விருப்பத்தேர்வுகள்',
  },

  // Actions & Buttons
  btnSaveTrip: { en: 'Save Trip', ta: 'பயணத்தை சேமி' },
  btnSavedOffline: { en: 'Saved Offline', ta: 'சேமிக்கப்பட்டது' },
  btnOfflineDossier: { en: 'Offline Dossier', ta: 'ஆஃப்லைன் ஆவணம்' },
  btnShareWhatsApp: { en: 'Share via WhatsApp', ta: 'வாட்ஸ்அப்பில் பகிர்க' },
  btnModifyPreferences: { en: 'Modify Preferences', ta: 'விருப்பங்களை மாற்றுக' },
  btnShuffleSuggestions: { en: 'Shuffle Suggestions', ta: 'மறுசுழற்சி செய்க' },
  btnViewOnMaps: { en: 'View on Google Maps', ta: 'கூகுள் மேப்ஸில் பார்க்க' },
  btnViewPlaceInfo: { en: 'View Place Info', ta: 'இடத்தின் விவரம்' },
  btnCheckInDone: { en: 'Check-in Done', ta: 'வருகை பதிவு செய்க' },
  btnCheckedIn: { en: 'Checked-in Done ✓', ta: 'வருகை பதிவானது ✓' },
  btnShareLiveLocation: { en: 'Share Live Location', ta: 'நேரலை இருப்பிடம் பகிர்க' },
  btnOpenBudgetCalc: { en: 'Open Dynamic Budget Calculator', ta: 'கட்டணக் கணக்கீட்டை திறக்க' },

  // Themes & Modes
  themeLight: { en: 'Light', ta: 'பகல்பொழுது' },
  themePink: { en: 'Pink Mode', ta: 'இளஞ்சிவப்பு முறை' },
  themeDark: { en: 'Dark', ta: 'இரவுப்பொழுது' },
  modeSafetyOn: { en: 'Safety Mode: ON', ta: 'மகளிர் பாதுகாப்பு: இயங்குகிறது' },
  modeWomenSafety: { en: 'Women Safety Mode', ta: 'மகளிர் பாதுகாப்பு முறை' },

  // Categories
  catTemples: { en: 'Temples & Spiritual', ta: 'கோயில்கள் & ஆன்மீகம்' },
  catHeritage: { en: 'Heritage & Forts', ta: 'பாரம்பரியம் & கோட்டைகள்' },
  catBeaches: { en: 'Beaches & Coastal', ta: 'கடற்கரைகள்' },
  catHills: { en: 'Hills & Waterfalls', ta: 'மலைகள் & அருவிகள்' },
  catNature: { en: 'Nature & Wildlife', ta: 'வனவிலங்கு & இயற்கை' },
  catHiddenGems: { en: 'Hidden Gems', ta: 'அரிய பொக்கிஷங்கள்' },
  catFood: { en: 'Food & Culinary', ta: 'உணவு கலாச்சாரம்' },
  catCulture: { en: 'Culture & Crafts', ta: 'கலை & கைவினை' },

  // Meals
  mealBreakfast: { en: 'Breakfast', ta: 'காலை உணவு' },
  mealLunch: { en: 'Lunch', ta: 'மதிய உணவு' },
  mealDinner: { en: 'Dinner', ta: 'இரவு உணவு' },
  mealSnacks: { en: 'Snacks & Tea', ta: 'மாலை சிற்றுண்டி' },
  moreOptionsNearby: { en: 'More options nearby', ta: 'அருகிலுள்ள உணவகங்கள்' },

  // Timeline UI
  whyAtThisTime: { en: 'Why at this time?', ta: 'இந்த நேரத்தில் ஏன்?' },
  travelAbout: { en: 'Travel about', ta: 'பயண நேரம் சுமார்' },
  bufferTime: { en: 'buffer', ta: 'கூடுதல் நேரம்' },
  hoursNotVerified: { en: 'Hours not verified', ta: 'நேரம் உறுதிப்படுத்தப்படவில்லை' },
  zeroFabricationNotice: {
    en: 'Verified from official government archives (ASI, HR&CE, TTDC, Forest Dept).',
    ta: 'அரசு ஆவணங்கள் மற்றும் சுற்றுலாத்துறை மூலம் உறுதிப்படுத்தப்பட்ட விவரங்கள்.',
  },
} as const;

export type TranslationKey = keyof typeof TRANSLATIONS;

export function t(key: TranslationKey, lang: Language): string {
  if (!TRANSLATIONS[key]) return key;
  return TRANSLATIONS[key][lang] || TRANSLATIONS[key]['en'];
}

export function getLanguagePreference(): Language {
  try {
    const saved = localStorage.getItem('tamizn_language');
    if (saved === 'ta' || saved === 'en') return saved;
  } catch {}
  return 'en';
}

export function setLanguagePreference(lang: Language): void {
  try {
    localStorage.setItem('tamizn_language', lang);
  } catch {}
}
