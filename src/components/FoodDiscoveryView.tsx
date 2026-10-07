import React, { useState } from 'react';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';
import { FoodPlace } from '../types';
import {
  UtensilsCrossed,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Tag,
  DollarSign,
} from 'lucide-react';

export const FoodDiscoveryView: React.FC = () => {
  const [filterType, setFilterType] = useState<'all' | 'veg' | 'nonveg' | 'student'>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');

  const districts = ['all', ...Array.from(new Set(FOOD_PLACES_DATA.map((f) => f.district)))];

  const filteredPlaces = FOOD_PLACES_DATA.filter((place) => {
    if (filterType === 'veg' && !place.isVegetarianOnly) return false;
    if (filterType === 'nonveg' && !place.isNonVegAvailable) return false;
    if (filterType === 'student' && !place.studentFriendly) return false;
    if (selectedDistrict !== 'all' && place.district !== selectedDistrict) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-amber-900/40 shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
          <UtensilsCrossed className="w-3.5 h-3.5" />
          <span>Authentic Regional Flavors</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
          Traditional Tamil Culinary Heritage
        </h2>

        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          From legendary Kongunadu herbal sambar and fragrant Dindigul seeraga samba biryani to hand-pounded Chettinad feasts and Madurai jigarthanda. Hand-picked authentic eateries with zero fake listings.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'all'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            All Eateries
          </button>
          <button
            onClick={() => setFilterType('veg')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'veg'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Pure Vegetarian
          </button>
          <button
            onClick={() => setFilterType('nonveg')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'nonveg'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Traditional Non-Veg
          </button>
          <button
            onClick={() => setFilterType('student')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              filterType === 'student'
                ? 'bg-amber-700 text-white shadow-sm'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            Student & Budget Friendly
          </button>
        </div>

        {/* District Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs font-bold text-stone-500 whitespace-nowrap">District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            {districts.map((d) => (
              <option key={d} value={d}>
                {d === 'all' ? 'All Districts' : d}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {filteredPlaces.map((place: FoodPlace) => (
          <div
            key={place.id}
            className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-52 bg-stone-100 overflow-hidden">
              <img
                src={place.imageUrl}
                alt={place.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />

              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-stone-900/90 text-amber-400 backdrop-blur-md border border-stone-700">
                  {place.district}
                </span>
                {place.isVegetarianOnly && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white">
                    Pure Veg
                  </span>
                )}
                {place.studentFriendly && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-600 text-stone-950 font-bold">
                    Student Pocket-Friendly
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 inset-x-4 text-white">
                <h3 className="font-serif font-bold text-lg leading-tight line-clamp-1 drop-shadow-sm">
                  {place.name}
                </h3>
                <p className="text-xs text-amber-300 font-medium">{place.cuisine}</p>
              </div>
            </div>

            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
              {/* Specialty Dishes */}
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-2">
                  Signature Delicacies:
                </span>
                <ul className="space-y-1 text-xs text-stone-700">
                  {place.specialtyDishes.map((dish, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="font-medium leading-snug">{dish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hours & Cost */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{place.openingHours}</span>
                </div>
                <div className="font-bold text-emerald-800">
                  Avg ₹{place.avgCostPerPersonINR}/person
                </div>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl text-xs text-stone-500 flex items-start gap-1.5 border border-stone-100">
                <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{place.address}</span>
              </div>

              <div className="text-[10px] text-stone-400 flex items-center gap-1 truncate pt-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">Verified: {place.source.sourceName}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
