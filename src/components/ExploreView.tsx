import React, { useState } from 'react';
import { Destination, FoodPlace } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';
import { TN_DISTRICTS_DATA, DistrictInfo } from '../data/districts';
import { CATEGORIES, CategoryId, TN_DISTRICTS } from '../config/appConfig';
import { DestinationCard } from './DestinationCard';
import { InteractiveMap } from './InteractiveMap';
import { KolamDivider } from './KolamAccents';
import {
  MapPin,
  Layers,
  Sparkles,
  Filter,
  Map as MapIcon,
  Grid,
  Info,
  Calendar,
  Compass,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

interface ExploreViewProps {
  onSelectDestination: (dest: Destination) => void;
  onPlanTripForDistrict: (district: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectDestination,
  onPlanTripForDistrict,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Regions of Tamil Nadu
  const regions = [
    'all',
    'Kongu Nadu',
    'Pandya Nadu',
    'Chola Nadu',
    'Thondai Nadu',
    'Chera / Southern',
  ];

  // Filtered destinations
  const filteredDestinations = DESTINATIONS_DATA.filter((dest) => {
    if (selectedDistrict !== 'all' && dest.district.toLowerCase() !== selectedDistrict.toLowerCase()) {
      return false;
    }
    if (selectedCategory !== 'all') {
      if (selectedCategory === 'hidden_gems') {
        if (!dest.isHiddenGem) return false;
      } else if (dest.category !== selectedCategory) {
        return false;
      }
    }
    return true;
  });

  const selectedDistrictInfo = TN_DISTRICTS_DATA.find(
    (d) => d.name.toLowerCase() === selectedDistrict.toLowerCase()
  );

  const displayedDistricts = TN_DISTRICTS_DATA.filter((d) => {
    if (selectedRegion !== 'all' && d.region !== selectedRegion) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Header and District Exploration */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 mb-1">
              <span>தமிழ்நாடு • 38 DISTRICTS</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight">
              Explore Tamil Nadu
            </h1>
            <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-2xl font-serif italic">
              From the Kaveri delta granaries to the peaks of the Western Ghats and three-sea shores.
            </p>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-300 self-start md:self-auto shrink-0 shadow-inner">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-900 shadow-md border border-stone-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Grid className="w-4 h-4 text-amber-700" />
              <span>Grid View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider uppercase transition-all flex items-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-widest mr-2 shrink-0">
            Regions:
          </span>
          {regions.map((reg) => (
            <button
              key={reg}
              onClick={() => {
                setSelectedRegion(reg);
                setSelectedDistrict('all');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedRegion === reg
                  ? 'bg-stone-900 text-amber-300 border-amber-600/50 shadow-sm'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
              }`}
            >
              {reg === 'all' ? 'All Historical Regions' : reg}
            </button>
          ))}
        </div>

        {/* District Cultural Explorer Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {displayedDistricts.slice(0, 12).map((dist) => {
            const isSelected = selectedDistrict.toLowerCase() === dist.name.toLowerCase();
            return (
              <div
                key={dist.name}
                onClick={() => setSelectedDistrict(isSelected ? 'all' : dist.name)}
                className={`relative rounded-2xl p-3.5 border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden group ${
                  isSelected
                    ? 'bg-amber-950 text-white border-amber-500 shadow-xl ring-2 ring-amber-400'
                    : 'bg-white hover:bg-amber-50/50 text-stone-800 border-stone-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider mb-1">
                    <span className={isSelected ? 'text-amber-300' : 'text-amber-700'}>
                      {dist.region.split(' ')[0]}
                    </span>
                    <MapPin className={`w-3 h-3 ${isSelected ? 'text-amber-300' : 'text-stone-400'}`} />
                  </div>
                  <h4 className="font-serif font-black text-sm leading-tight line-clamp-1 mb-1">
                    {dist.name}
                  </h4>
                  <p className={`text-[10px] leading-snug line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    “{dist.culturalTagline}”
                  </p>
                </div>

                <div className="pt-2 mt-2 border-t border-current/10 flex items-center justify-between text-[10px] font-semibold">
                  <span className={isSelected ? 'text-amber-200' : 'text-amber-900'}>
                    Explore Places
                  </span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected District Highlight Profile (if active) */}
      {selectedDistrictInfo && (
        <div className="relative bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-stone-100 rounded-3xl p-6 sm:p-10 border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-amber-500 text-stone-950">
                {selectedDistrictInfo.region}
              </span>
              <span className="text-xs text-amber-300/80 font-mono">
                HQ: {selectedDistrictInfo.headquarters}
              </span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-serif font-black text-white">
              {selectedDistrictInfo.name} District
            </h3>
            <p className="text-sm text-amber-200 font-serif italic">
              “{selectedDistrictInfo.culturalTagline}”
            </p>
            <p className="text-xs text-stone-300 leading-relaxed pt-1">
              <strong>Major Highlights: </strong>{selectedDistrictInfo.popularFor}
            </p>
            <p className="text-xs text-amber-300/90">
              <strong>Regional Flavors & Crafts: </strong>{selectedDistrictInfo.knownSpecialty}
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={() => onPlanTripForDistrict(selectedDistrictInfo.name)}
              className="px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan {selectedDistrictInfo.name} Journey</span>
            </button>
            <button
              onClick={() => setSelectedDistrict('all')}
              className="px-4 py-3 rounded-2xl bg-stone-900/80 hover:bg-stone-800 text-stone-300 text-xs font-semibold border border-stone-700 transition-colors"
            >
              Show All Districts
            </button>
          </div>
        </div>
      )}

      {/* Category Filter Pills */}
      <div className="space-y-3">
        <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block">
          Filter by Cultural Category:
        </span>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
              selectedCategory === 'all'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            All Experiences ({DESTINATIONS_DATA.length})
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                  : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-stone-50'
              }`}
            >
              <span>{cat.symbol}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main View: Grid vs Map */}
      {viewMode === 'map' ? (
        <InteractiveMap
          destinations={filteredDestinations.length > 0 ? filteredDestinations : DESTINATIONS_DATA}
          foodPlaces={FOOD_PLACES_DATA}
          onSelectDestination={onSelectDestination}
        />
      ) : (
        <div className="space-y-6">
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredDestinations.map((dest) => (
                <DestinationCard
                  key={dest.id}
                  destination={dest}
                  onSelect={onSelectDestination}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 max-w-xl mx-auto space-y-4">
              <Info className="w-10 h-10 text-amber-600 mx-auto" />
              <h4 className="text-xl font-serif font-bold text-stone-900">
                Additional Verified Places in Verification Pipeline
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                Under TamizN Visa's Zero-Fabrication rule, destinations are strictly loaded from verified Archaeological Survey of India (ASI) and TTDC registry data.
              </p>
              <button
                onClick={() => {
                  setSelectedDistrict('all');
                  setSelectedCategory('all');
                }}
                className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-bold uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      )}

      <KolamDivider />
    </div>
  );
};
