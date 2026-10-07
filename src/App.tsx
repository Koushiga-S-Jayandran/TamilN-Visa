import React, { useState, useEffect } from 'react';
import { NavTab, Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { AlertsBanner } from './components/AlertsBanner';
import { ExploreView } from './components/ExploreView';
import { MultiStepPlanner } from './components/MultiStepPlanner';
import { ItineraryDashboard } from './components/ItineraryDashboard';
import { HiddenGemsView } from './components/HiddenGemsView';
import { CrowdInsightsView } from './components/CrowdInsightsView';
import { FoodDiscoveryView } from './components/FoodDiscoveryView';
import { SavedTripsView } from './components/SavedTripsView';
import { DestinationDetailModal } from './components/DestinationDetailModal';
import { OfflineTripSummaryModal } from './components/OfflineTripSummaryModal';
import { AboutModal } from './components/AboutModal';
import { SearchResultSection } from './components/SearchResultSection';
import { DestinationCard } from './components/DestinationCard';
import { KolamDivider } from './components/KolamAccents';
import { TamilBrandLogo } from './components/TamilBrandLogo';

import { Destination, TripPlannerInput, ItineraryDay, SavedTrip } from './types';
import { DESTINATIONS_DATA } from './data/destinations';
import { FOOD_PLACES_DATA } from './data/foodPlaces';
import { TN_DISTRICTS_DATA } from './data/districts';
import { CATEGORIES, APP_CONFIG } from './config/appConfig';
import { executeSmartSearch, SmartSearchResult } from './services/smartSearch';
import { StorageService } from './services/storageService';
import {
  Compass,
  Sparkles,
  Activity,
  UtensilsCrossed,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers,
  Calendar,
  MapPin,
  ChevronRight,
  Clock,
  Heart,
} from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [offlineModalTrip, setOfflineModalTrip] = useState<SavedTrip | null>(null);

  // Active Generated Plan
  const [activePlannerInput, setActivePlannerInput] = useState<TripPlannerInput | null>(null);
  const [activeItineraryDays, setActiveItineraryDays] = useState<ItineraryDay[] | null>(null);
  const [prefilledDistrict, setPrefilledDistrict] = useState<string>('Coimbatore');

  // Search Results State
  const [searchResult, setSearchResult] = useState<SmartSearchResult | null>(null);

  // Saved Trips Counter
  const [savedCount, setSavedCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setSavedCount(StorageService.getSavedTrips().length);
  }, [currentTab]);

  const handleSearch = (query: string) => {
    const res = executeSmartSearch(query);
    setSearchResult(res);
  };

  const handleStartPlanForDistrict = (district: string) => {
    setPrefilledDistrict(district);
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTripGenerated = (input: TripPlannerInput, days: ItineraryDay[]) => {
    setActivePlannerInput(input);
    setActiveItineraryDays(days);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenSavedTrip = (trip: SavedTrip) => {
    const input: TripPlannerInput = {
      destinationDistrict: trip.destinationDistrict,
      travelDate: trip.travelDate,
      numberOfDays: trip.numberOfDays,
      numberOfTravelers: trip.travelers,
      travelerType: trip.travelerType,
      budgetTier: 'Custom',
      customBudgetINR: trip.budgetTotalINR,
      selectedInterests: ['Temples', 'Heritage'],
      selectedPreferences: ['Avoid crowds'],
    };
    setActivePlannerInput(input);
    setActiveItineraryDays(trip.itineraryDays);
    setCurrentTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Curated picks for homepage sections
  const hiddenGemsPicks = DESTINATIONS_DATA.filter((d) => d.isHiddenGem).slice(0, 3);
  const featuredPlaces = DESTINATIONS_DATA.filter((d) => !d.isHiddenGem).slice(0, 6);
  const sampleDistricts = TN_DISTRICTS_DATA.slice(0, 6);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between selection:bg-amber-100 selection:text-amber-900 antialiased font-sans">
      
      {/* Minimal Transparent Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSearchResult(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => setAboutModalOpen(true)}
        savedTripsCount={savedCount}
        onNavigateDestinations={() => {
          if (currentTab !== 'home') {
            setCurrentTab('home');
            setTimeout(() => {
              document.getElementById('discover-content')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            document.getElementById('discover-content')?.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Primary Main View Port */}
      <main className={`flex-1 ${currentTab !== 'home' ? 'pt-20' : ''}`}>
        
        {/* ==================================================== */}
        {/* 1. HOME VIEW FLOW                                   */}
        {/* ==================================================== */}
        {currentTab === 'home' && (
          <div>
            {/* 1. CINEMATIC LUXURY HERO SECTION */}
            <HeroSection
              onDiscover={() => {
                const el = document.getElementById('discover-content');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* Discover & Destinations Content Section */}
            <div id="discover-content" className="scroll-mt-20">
              {/* Travel Advisory Banner */}
              <AlertsBanner />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                
                {/* Natural Travel Search */}
                <div className="max-w-2xl mx-auto text-center space-y-3">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (searchQuery.trim()) handleSearch(searchQuery.trim());
                    }}
                    className="relative bg-white border border-stone-200 hover:border-stone-400 focus-within:border-stone-900 rounded-full shadow-md flex items-center p-1.5 transition-all"
                  >
                    <div className="flex items-center gap-3 w-full pl-5 pr-2">
                      <svg className="w-4 h-4 text-stone-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search Tamil Nadu destinations, temples, hill stations, heritage..."
                        className="w-full bg-transparent border-none text-stone-900 placeholder-stone-400 text-sm focus:outline-none font-sans"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-medium uppercase tracking-wider shrink-0 transition-colors cursor-pointer"
                    >
                      Search
                    </button>
                  </form>

                  {/* Suggested Quick Searches */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    {['Temples in Madurai', 'Peaceful hills near Coimbatore', 'Mahabalipuram coastal walk', 'Chettinad cuisine'].map((chip, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSearchQuery(chip);
                          handleSearch(chip);
                        }}
                        className="text-[11px] px-3 py-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Natural Search Results Banner if active */}
                {searchResult && (
                  <SearchResultSection
                    result={searchResult}
                    onClear={() => setSearchResult(null)}
                    onSelectDestination={(d) => setSelectedDestination(d)}
                  />
                )}

              {/* 2. EXPLORE BY EXPERIENCE */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-sans tracking-[0.25em] uppercase text-amber-700 font-medium block mb-1">
                      Curated Journeys
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-normal text-stone-900 tracking-tight">
                      Explore by Experience
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentTab('explore');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-sans tracking-[0.2em] uppercase text-stone-600 hover:text-stone-900 flex items-center gap-1.5 self-start sm:self-auto transition-colors cursor-pointer"
                  >
                    <span>View All Experiences</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                  {[
                    {
                      id: 'temples',
                      name: 'Temples & Spiritual',
                      tamilTag: 'கோயில்கள் & ஆன்மீகம்',
                      location: 'Thanjavur & Madurai',
                      description: 'Chola, Pallava, and Pandya Dravidian architectural wonders',
                      imageUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=85',
                      tab: 'explore' as NavTab,
                    },
                    {
                      id: 'heritage',
                      name: 'Heritage & Forts',
                      tamilTag: 'பாரம்பரியம் & கோட்டைகள்',
                      location: 'Gingee & Chettinad',
                      description: 'Ancient citadels, royal palaces, and historic settlements',
                      imageUrl: 'https://images.unsplash.com/photo-1600100397608-f010f443834e?auto=format&fit=crop&w=1200&q=85',
                      tab: 'explore' as NavTab,
                    },
                    {
                      id: 'beaches',
                      name: 'Beaches & Coastal',
                      tamilTag: 'கடற்கரைகள்',
                      location: 'Marina & Dhanushkodi',
                      description: 'Coromandel shores, three-sea confluences, and quiet coastal bays',
                      imageUrl: 'https://images.unsplash.com/photo-1621682372775-533449e550ed?auto=format&fit=crop&w=1200&q=85',
                      tab: 'explore' as NavTab,
                    },
                    {
                      id: 'hills',
                      name: 'Hills & Waterfalls',
                      tamilTag: 'மலைகள் & அருவிகள்',
                      location: 'Nilgiris & Courtallam',
                      description: 'Western Ghats tea valleys, misty peaks, and cascading waterfalls',
                      imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1200&q=85',
                      tab: 'explore' as NavTab,
                    },
                    {
                      id: 'food',
                      name: 'Food & Cuisine',
                      tamilTag: 'உணவு கலாச்சாரம்',
                      location: 'Chettinad & Kongunadu',
                      description: 'Authentic Kongunadu, Chettinad, and Madurai culinary legends',
                      imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=1200&q=85',
                      tab: 'food' as NavTab,
                    },
                    {
                      id: 'wildlife',
                      name: 'Wildlife & Nature',
                      tamilTag: 'வனவிலங்கு & இயற்கை',
                      location: 'Mudumalai & Anamalai',
                      description: 'Protected tiger corridors, mountain sholas, and tidal wetlands',
                      imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85',
                      tab: 'explore' as NavTab,
                    },
                  ].map((exp) => (
                    <div
                      key={exp.id}
                      onClick={() => {
                        setCurrentTab(exp.tab);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group relative h-72 sm:h-80 rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500"
                    >
                      {/* Real Tamil Nadu photograph full-bleed */}
                      <img
                        src={exp.imageUrl}
                        alt={exp.name}
                        className="absolute inset-0 w-full h-full object-cover object-center transform scale-100 group-hover:scale-108 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Subtle dark gradient overlay for effortless readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/45 to-stone-950/20 group-hover:from-stone-950 group-hover:via-stone-950/55 transition-colors duration-500" />

                      {/* Card Content */}
                      <div className="relative h-full p-6 sm:p-7 flex flex-col justify-between z-10 text-white">
                        {/* Top: Location & Tamil Tag */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[11px] font-sans tracking-[0.2em] uppercase text-stone-200/90 font-light">
                            {exp.location}
                          </span>
                          <span className="text-[10px] font-serif italic text-amber-300/90 font-medium">
                            {exp.tamilTag}
                          </span>
                        </div>

                        {/* Bottom: Title, description, and explore cue */}
                        <div className="space-y-1.5">
                          <h3 className="text-xl sm:text-2xl font-serif font-normal text-white tracking-tight drop-shadow-sm group-hover:text-amber-200 transition-colors">
                            {exp.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-300 font-light leading-relaxed line-clamp-2">
                            {exp.description}
                          </p>
                          <div className="pt-2 flex items-center gap-1.5 text-xs text-amber-300/90 font-sans tracking-wider uppercase font-medium">
                            <span>Explore</span>
                            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300">
                              →
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. EXPLORE DISTRICTS (Engaging Cultural Interface) */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 block">
                      DISTRICT STORYTELLING
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900">
                      Explore Tamil Nadu Districts
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 font-serif italic">
                      Every district tells an authentic cultural story.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('explore')}
                    className="text-xs font-black uppercase tracking-wider text-amber-700 hover:text-amber-900 flex items-center gap-1.5"
                  >
                    <span>Browse All 38 Districts</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleDistricts.map((dist) => (
                    <div
                      key={dist.name}
                      onClick={() => handleStartPlanForDistrict(dist.name)}
                      className="group relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between h-56 bg-stone-950 text-white"
                    >
                      {/* Background photo */}
                      <img
                        src={dist.imageUrl}
                        alt={dist.name}
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-108 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

                      <div className="relative z-10 p-5 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-stone-900/80 text-amber-300 backdrop-blur-md border border-amber-500/30">
                          {dist.region}
                        </span>
                        <MapPin className="w-4 h-4 text-amber-400" />
                      </div>

                      <div className="relative z-10 p-5">
                        <h3 className="font-serif font-black text-2xl drop-shadow-md text-white group-hover:text-amber-300 transition-colors">
                          {dist.name}
                        </h3>
                        <p className="text-xs text-amber-200/90 font-serif italic line-clamp-1 mb-2">
                          “{dist.culturalTagline}”
                        </p>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
                          <span>Plan journey for {dist.name}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. HIDDEN GEMS (Lesser-Known Treasures) */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-purple-700 block">
                      DE-CONGEST MAINSTREAM HUBS
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900">
                      Beyond the Famous. Into the Forgotten.
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 font-serif italic">
                      Verified lesser-known sanctuaries with genuine archaeological and natural stature.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('hidden-gems')}
                    className="text-xs font-black uppercase tracking-wider text-purple-700 hover:text-purple-900 flex items-center gap-1.5"
                  >
                    <span>View All Hidden Gems</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                  {hiddenGemsPicks.map((gem) => (
                    <DestinationCard
                      key={gem.id}
                      destination={gem}
                      onSelect={(d) => setSelectedDestination(d)}
                    />
                  ))}
                </div>
              </div>

              {/* 6. FOOD & CULTURE (Authentic Regional Cuisine) */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 block">
                      GASTRONOMIC HERITAGE
                    </span>
                    <h2 className="text-2xl sm:text-4xl font-serif font-black text-stone-900">
                      Traditional Tamil Culinary Spots
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 mt-1 font-serif italic">
                      Zero fake restaurants. Hand-curated historical breakfast joints, biryanis, and messes.
                    </p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('food')}
                    className="text-xs font-black uppercase tracking-wider text-amber-700 hover:text-amber-900 flex items-center gap-1.5"
                  >
                    <span>Explore All Food Spots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {FOOD_PLACES_DATA.slice(0, 4).map((food) => (
                    <div
                      key={food.id}
                      onClick={() => setCurrentTab('food')}
                      className="group bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div className="relative h-44 bg-stone-950 overflow-hidden">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />
                        <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-stone-900/90 text-amber-300 backdrop-blur-md">
                          {food.district}
                        </span>
                      </div>
                      <div className="p-4 space-y-2">
                        <h4 className="font-serif font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1">
                          {food.name}
                        </h4>
                        <p className="text-xs text-amber-700 font-semibold line-clamp-1">
                          {food.cuisine}
                        </p>
                        <p className="text-[11px] text-stone-500 line-clamp-2">
                          Signature: {food.specialtyDishes[0]}
                        </p>
                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-800">
                            Avg ₹{food.avgCostPerPersonINR}/pax
                          </span>
                          <span className="text-[11px] font-semibold text-amber-700 flex items-center gap-1">
                            Details <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. PLAN YOUR JOURNEY CALLOUT BANNER */}
              <div className="relative bg-gradient-to-r from-stone-950 via-amber-950 to-stone-950 text-white rounded-3xl p-8 sm:p-14 border border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
                <div className="space-y-3 max-w-2xl relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Intelligent Day-by-Day Scheduling</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight">
                    Ready to Plan Your Tamil Nadu Journey?
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
                    Get a complete 06:00 AM – 09:00 PM realistic itinerary with crowd avoidance logic, transit buffers, breakfast/lunch breaks, and printable offline dossiers.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCurrentTab('planner');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs sm:text-sm uppercase tracking-wider shrink-0 transition-all shadow-xl shadow-amber-950/60 active:scale-95"
                >
                  Launch Trip Planner
                </button>
              </div>

            </div>
          </div>
        </div>
        )}

        {/* ==================================================== */}
        {/* 2. EXPLORE VIEW                                      */}
        {/* ==================================================== */}
        {currentTab === 'explore' && (
          <ExploreView
            onSelectDestination={(d) => setSelectedDestination(d)}
            onPlanTripForDistrict={handleStartPlanForDistrict}
          />
        )}

        {/* ==================================================== */}
        {/* 3. PLANNER VIEW                                      */}
        {/* ==================================================== */}
        {currentTab === 'planner' && (
          <div>
            {activePlannerInput && activeItineraryDays ? (
              <ItineraryDashboard
                plannerInput={activePlannerInput}
                itineraryDays={activeItineraryDays}
                onOpenOfflineDossier={() => {
                  const saved = StorageService.saveTrip(
                    `${activePlannerInput.destinationDistrict} Journey`,
                    activePlannerInput,
                    activeItineraryDays,
                    true
                  );
                  setOfflineModalTrip(saved);
                }}
                onModifyTrip={() => {
                  setActivePlannerInput(null);
                  setActiveItineraryDays(null);
                }}
                onViewDestinationDetail={(destId) => {
                  const match = DESTINATIONS_DATA.find((d) => d.id === destId);
                  if (match) setSelectedDestination(match);
                }}
              />
            ) : (
              <MultiStepPlanner
                initialDistrict={prefilledDistrict}
                onTripGenerated={handleTripGenerated}
              />
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* 4. HIDDEN GEMS VIEW                                  */}
        {/* ==================================================== */}
        {currentTab === 'hidden-gems' && (
          <HiddenGemsView
            onSelectDestination={(d) => setSelectedDestination(d)}
            onPlanTripForDistrict={handleStartPlanForDistrict}
          />
        )}

        {/* ==================================================== */}
        {/* 5. CROWD INSIGHTS VIEW                               */}
        {/* ==================================================== */}
        {currentTab === 'crowd' && <CrowdInsightsView />}

        {/* ==================================================== */}
        {/* 6. FOOD VIEW                                         */}
        {/* ==================================================== */}
        {currentTab === 'food' && <FoodDiscoveryView />}

        {/* ==================================================== */}
        {/* 7. SAVED TRIPS VIEW                                  */}
        {/* ==================================================== */}
        {currentTab === 'saved' && (
          <SavedTripsView
            onOpenTrip={handleOpenSavedTrip}
            onOpenOfflineDossier={(trip) => setOfflineModalTrip(trip)}
            onStartNewTrip={() => {
              setActivePlannerInput(null);
              setActiveItineraryDays(null);
              setCurrentTab('planner');
            }}
          />
        )}

      </main>

      {/* Destination Detail Modal */}
      <DestinationDetailModal
        destination={selectedDestination}
        onClose={() => setSelectedDestination(null)}
        onPlanForThisPlace={handleStartPlanForDistrict}
      />

      {/* Offline Trip Summary Modal */}
      <OfflineTripSummaryModal
        trip={offlineModalTrip}
        onClose={() => setOfflineModalTrip(null)}
      />

      {/* Institutional About / Innovation Modal */}
      {aboutModalOpen && <AboutModal onClose={() => setAboutModalOpen(false)} />}

      {/* Persistent Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSearchResult(null);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAbout={() => setAboutModalOpen(true)}
      />
    </div>
  );
}
