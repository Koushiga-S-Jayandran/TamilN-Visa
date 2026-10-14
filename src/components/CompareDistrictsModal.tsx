import React, { useState } from 'react';
import { TN_DISTRICTS_DATA, DistrictInfo } from '../data/districts_info';
import { DESTINATIONS_DATA } from '../data/destinations';
import { FOOD_PLACES_DATA } from '../data/foodPlaces';
import { evaluateCrowd } from '../services/crowdEngine';
import {
  X,
  ArrowRight,
  Scale,
  Landmark,
  Building,
  Calendar,
  Users,
  UtensilsCrossed,
  MapPin,
  Sparkles,
  DollarSign,
  Compass,
} from 'lucide-react';

interface CompareDistrictsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDistrict1?: string;
  initialDistrict2?: string;
  onPlanTrip: (district: string) => void;
}

export const CompareDistrictsModal: React.FC<CompareDistrictsModalProps> = ({
  isOpen,
  onClose,
  initialDistrict1 = 'Madurai',
  initialDistrict2 = 'Thanjavur',
  onPlanTrip,
}) => {
  const [district1Name, setDistrict1Name] = useState<string>(initialDistrict1);
  const [district2Name, setDistrict2Name] = useState<string>(initialDistrict2);

  if (!isOpen) return null;

  const dist1Info = TN_DISTRICTS_DATA.find((d) => d.name === district1Name) || TN_DISTRICTS_DATA[0];
  const dist2Info = TN_DISTRICTS_DATA.find((d) => d.name === district2Name) || TN_DISTRICTS_DATA[1];

  const getDistrictMetrics = (districtName: string) => {
    const places = DESTINATIONS_DATA.filter((d) => d.district === districtName);
    const templeCount = places.filter((d) => d.category === 'temples').length;
    const heritageCount = places.filter((d) => d.category === 'heritage').length;
    const hiddenCount = places.filter((d) => d.isHiddenGem).length;
    
    // Average crowd level computation
    const crowdScores = places.map((p) => {
      const c = evaluateCrowd(p).crowdLevel;
      if (c === 'LOW') return 1;
      if (c === 'MODERATE') return 2;
      if (c === 'HIGH') return 3;
      return 4; // VERY HIGH
    });
    const avgScore = crowdScores.length > 0 ? crowdScores.reduce((a, b) => a + b, 0) / crowdScores.length : 2;
    const avgCrowd = avgScore <= 1.5 ? 'LOW' : avgScore <= 2.5 ? 'MODERATE' : 'HIGH';

    // Best season from first place or standard winter
    const bestSeason = places[0]?.bestVisitingTime || 'October to March (Winter)';

    // Food highlights strictly from verified food places and district info
    const foodItems = FOOD_PLACES_DATA.filter((f) => f.district === districtName);
    const specialties = dist1Info.knownSpecialty ? dist1Info.knownSpecialty.split(',') : [];

    return {
      placesCount: places.length,
      templeCount,
      heritageCount,
      hiddenCount,
      avgCrowd,
      bestSeason,
      foodItems,
      places,
    };
  };

  const m1 = getDistrictMetrics(dist1Info.name);
  const m2 = getDistrictMetrics(dist2Info.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 p-5 sm:p-6 flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                Tamil Nadu Tourism Intelligence
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Compare Two Districts
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* District Selectors Bar */}
        <div className="bg-stone-50 border-b border-stone-200 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-stone-600 mb-1.5">
              Select First District (District A)
            </label>
            <select
              value={district1Name}
              onChange={(e) => setDistrict1Name(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900 text-sm focus:ring-2 focus:ring-amber-500"
            >
              {TN_DISTRICTS_DATA.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase font-bold tracking-wider text-stone-600 mb-1.5">
              Select Second District (District B)
            </label>
            <select
              value={district2Name}
              onChange={(e) => setDistrict2Name(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900 text-sm focus:ring-2 focus:ring-amber-500"
            >
              {TN_DISTRICTS_DATA.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.region})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Side-by-side Comparative Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-stone-900">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CARD 1: DISTRICT A */}
            <div className="bg-stone-50/80 rounded-3xl p-6 border-2 border-amber-200/80 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-900 border border-amber-500/30">
                      {dist1Info.region}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-stone-900 mt-1">
                      {dist1Info.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase font-mono">Headquarters</span>
                    <span className="font-bold text-xs text-stone-700">{dist1Info.headquarters}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic font-serif">
                  “{dist1Info.culturalTagline}”
                </p>

                {/* Metrics Comparison Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <Landmark className="w-3 h-3 text-amber-600" /> Temples
                    </span>
                    <span className="text-lg font-serif font-bold text-stone-900">
                      {m1.templeCount} Verified
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-600" /> Heritage Sites
                    </span>
                    <span className="text-lg font-serif font-bold text-stone-900">
                      {m1.heritageCount} Verified
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <Users className="w-3 h-3 text-orange-600" /> Avg. Crowd
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-amber-800">
                      {m1.avgCrowd}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-600" /> Daily Cost
                    </span>
                    <span className="text-sm font-bold font-mono text-stone-900">
                      ₹{dist1Info.avgDailyBudgetINR}/day
                    </span>
                  </div>
                </div>

                {/* Best Season */}
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-700" /> Best Season for Travel
                  </span>
                  <div className="font-semibold text-stone-800">
                    {m1.bestSeason}
                  </div>
                </div>

                {/* Food Highlights */}
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3 text-rose-600" /> Verified Food Highlights
                  </span>
                  <div className="font-semibold text-stone-900">
                    {dist1Info.knownSpecialty}
                  </div>
                  {m1.foodItems.length > 0 && (
                    <div className="text-[11px] text-stone-500 pt-1">
                      Notable spot: <strong>{m1.foodItems[0].name}</strong> ({m1.foodItems[0].cuisine})
                    </div>
                  )}
                </div>

                {/* Popular Places Snippet */}
                <div className="text-xs text-stone-600">
                  <strong className="text-stone-800 block text-[11px] uppercase tracking-wide mb-1">
                    Key Attractions:
                  </strong>
                  <span>{dist1Info.popularFor}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPlanTrip(dist1Info.name);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md mt-4"
              >
                <span>Plan Trip to {dist1Info.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* CARD 2: DISTRICT B */}
            <div className="bg-stone-50/80 rounded-3xl p-6 border-2 border-sky-200/80 shadow-sm flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-sky-500/15 text-sky-900 border border-sky-500/30">
                      {dist2Info.region}
                    </span>
                    <h3 className="text-2xl font-serif font-black text-stone-900 mt-1">
                      {dist2Info.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block uppercase font-mono">Headquarters</span>
                    <span className="font-bold text-xs text-stone-700">{dist2Info.headquarters}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic font-serif">
                  “{dist2Info.culturalTagline}”
                </p>

                {/* Metrics Comparison Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <Landmark className="w-3 h-3 text-amber-600" /> Temples
                    </span>
                    <span className="text-lg font-serif font-bold text-stone-900">
                      {m2.templeCount} Verified
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <Building className="w-3 h-3 text-emerald-600" /> Heritage Sites
                    </span>
                    <span className="text-lg font-serif font-bold text-stone-900">
                      {m2.heritageCount} Verified
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <Users className="w-3 h-3 text-orange-600" /> Avg. Crowd
                    </span>
                    <span className="text-sm font-bold uppercase tracking-wider text-amber-800">
                      {m2.avgCrowd}
                    </span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-0.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-600" /> Daily Cost
                    </span>
                    <span className="text-sm font-bold font-mono text-stone-900">
                      ₹{dist2Info.avgDailyBudgetINR}/day
                    </span>
                  </div>
                </div>

                {/* Best Season */}
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-700" /> Best Season for Travel
                  </span>
                  <div className="font-semibold text-stone-800">
                    {m2.bestSeason}
                  </div>
                </div>

                {/* Food Highlights */}
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                  <span className="text-[10px] text-stone-400 font-bold uppercase flex items-center gap-1">
                    <UtensilsCrossed className="w-3 h-3 text-rose-600" /> Verified Food Highlights
                  </span>
                  <div className="font-semibold text-stone-900">
                    {dist2Info.knownSpecialty}
                  </div>
                  {m2.foodItems.length > 0 && (
                    <div className="text-[11px] text-stone-500 pt-1">
                      Notable spot: <strong>{m2.foodItems[0].name}</strong> ({m2.foodItems[0].cuisine})
                    </div>
                  )}
                </div>

                {/* Popular Places Snippet */}
                <div className="text-xs text-stone-600">
                  <strong className="text-stone-800 block text-[11px] uppercase tracking-wide mb-1">
                    Key Attractions:
                  </strong>
                  <span>{dist2Info.popularFor}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onPlanTrip(dist2Info.name);
                }}
                className="w-full py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-md mt-4"
              >
                <span>Plan Trip to {dist2Info.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            * Comparative metrics reflect strictly verified data across official Tamil Nadu departments.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
