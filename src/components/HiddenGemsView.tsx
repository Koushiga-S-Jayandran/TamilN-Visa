import React from 'react';
import { Destination } from '../types';
import { DESTINATIONS_DATA } from '../data/destinations';
import { Sparkles, MapPin, ShieldCheck, ArrowRight, Compass } from 'lucide-react';
import { evaluateCrowd } from '../services/crowdEngine';

interface HiddenGemsViewProps {
  onSelectDestination: (dest: Destination) => void;
  onPlanTripForDistrict: (district: string) => void;
}

export const HiddenGemsView: React.FC<HiddenGemsViewProps> = ({
  onSelectDestination,
  onPlanTripForDistrict,
}) => {
  const hiddenGems = DESTINATIONS_DATA.filter((d) => d.isHiddenGem);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-950 via-stone-900 to-stone-950 text-white rounded-3xl p-8 sm:p-12 border border-purple-800/40 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/30 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Beyond the Famous. Into the Forgotten.</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100">
            Verified Tamil Nadu Hidden Gems
          </h2>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-normal">
            Lesser-known cultural masterpieces, secluded rainforests, and historic fortifications verified by Archaeological Survey of India and TTDC records. Designed to reduce peak congestion while giving travelers unforgettable authentic serenity.
          </p>
        </div>

        {/* Decorative subtle backdrop ornament */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Grid of Verified Hidden Gems */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {hiddenGems.map((gem) => {
          const crowd = evaluateCrowd(gem);

          return (
            <div
              key={gem.id}
              className="bg-white rounded-3xl overflow-hidden border border-purple-200/80 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative h-60 bg-stone-900 overflow-hidden">
                <img
                  src={gem.imageUrl}
                  alt={gem.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20" />

                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-900/90 text-purple-200 backdrop-blur-md border border-purple-500/50 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-300" />
                    <span>Lesser-Known Masterpiece</span>
                  </span>
                </div>

                <div className="absolute bottom-3 inset-x-4 text-white">
                  <div className="flex items-center gap-1 text-xs text-purple-300 font-medium mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{gem.district}</span>
                  </div>
                  <h3 className="text-lg font-serif font-bold leading-tight line-clamp-1">
                    {gem.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                {/* Qualifying Reason Box */}
                {gem.whyHiddenGem && (
                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-200/80 space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-purple-900 block">
                      Why this qualifies:
                    </span>
                    <p className="text-xs text-purple-800 leading-relaxed font-medium">
                      {gem.whyHiddenGem}
                    </p>
                  </div>
                )}

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {gem.description}
                </p>

                {/* Crowd Status */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                  <span className="text-stone-500">Expected Crowd:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 text-[11px]">
                    {crowd.crowdLevel} (Quiet)
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => onSelectDestination(gem)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-stone-900 hover:bg-purple-900 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Destination</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onPlanTripForDistrict(gem.district)}
                    className="py-2.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-colors"
                    title={`Plan trip around ${gem.district}`}
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-[10px] text-stone-400 flex items-center gap-1 truncate pt-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Verified: {gem.source.sourceName}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
