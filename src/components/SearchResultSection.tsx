import React from 'react';
import { SmartSearchResult } from '../services/smartSearch';
import { Destination, FoodPlace } from '../types';
import { DestinationCard } from './DestinationCard';
import { Sparkles, AlertCircle, X, Compass, UtensilsCrossed } from 'lucide-react';

interface SearchResultSectionProps {
  result: SmartSearchResult | null;
  onClear: () => void;
  onSelectDestination: (dest: Destination) => void;
}

export const SearchResultSection: React.FC<SearchResultSectionProps> = ({
  result,
  onClear,
  onSelectDestination,
}) => {
  if (!result) return null;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6 animate-fade-in my-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Natural Language Intent Match
            </span>
            {result.detectedDistrict && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                District: {result.detectedDistrict}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mt-1">
            Results for “{result.query}”
          </h2>
        </div>

        <button
          onClick={onClear}
          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <X className="w-4 h-4" />
          <span>Clear Search</span>
        </button>
      </div>

      {/* Smart Alternative Notice (e.g. Beaches in Coimbatore) */}
      {result.alternativeNotice && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
              Smart Alternative Recommendation ({result.alternativeNotice.missingConcept})
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
            {result.alternativeNotice.explanation}
          </p>
        </div>
      )}

      {/* Matched Destinations */}
      {result.destinations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400">
            Matching Destinations ({result.destinations.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.destinations.map((dest) => (
              <DestinationCard
                key={dest.id}
                destination={dest}
                onSelect={onSelectDestination}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-stone-500 text-sm">
          No verified destinations directly matched this criteria. Try selecting one of the 38 districts or exploring categories.
        </div>
      )}

      {/* Matched Food places if applicable */}
      {result.foodPlaces.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-stone-200">
          <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 flex items-center gap-1.5">
            <UtensilsCrossed className="w-4 h-4 text-orange-600" />
            Authentic Regional Food Spots in this Area ({result.foodPlaces.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {result.foodPlaces.map((food) => (
              <div
                key={food.id}
                className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs flex items-center justify-between"
              >
                <div>
                  <strong className="text-stone-900 block">{food.name}</strong>
                  <span className="text-stone-500 text-[11px]">{food.cuisine}</span>
                </div>
                <span className="text-emerald-700 font-bold font-mono">
                  ₹{food.avgCostPerPersonINR}/pax
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
