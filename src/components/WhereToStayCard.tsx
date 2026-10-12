import React, { useEffect, useState } from 'react';
import { Stay, PriceBand } from '../data/stays/types';
import { loadDistrictStays } from '../data/stays';
import { BudgetTier } from '../types';
import {
  Building2,
  ExternalLink,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  Tag,
  Accessibility,
  Info,
  CheckCircle2,
} from 'lucide-react';

interface WhereToStayCardProps {
  district: string;
  travelerBudgetTier?: BudgetTier;
  isOfflineDossier?: boolean;
}

export const WhereToStayCard: React.FC<WhereToStayCardProps> = ({
  district,
  travelerBudgetTier = 'Mid-range',
  isOfflineDossier = false,
}) => {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<'tier' | 'all'>('tier');

  useEffect(() => {
    let isMounted = true;
    async function fetchStays() {
      setLoading(false);
      try {
        const loaded = await loadDistrictStays(district);
        if (isMounted) {
          setStays(loaded);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchStays();
    return () => {
      isMounted = false;
    };
  }, [district]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-3">
        <div className="h-5 w-40 bg-stone-200 rounded" />
        <div className="h-28 bg-stone-100 rounded-xl" />
      </div>
    );
  }

  if (stays.length === 0) {
    return (
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs text-stone-600">
        <strong className="block text-stone-900 mb-1">Accommodation in {district}</strong>
        Official TTDC and government rest houses can be viewed directly on the Tamil Nadu Tourism portal:
        <a
          href="https://ttdconline.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 underline font-semibold ml-1 inline-flex items-center gap-0.5"
        >
          ttdconline.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  // Map user budget tier ('Budget' | 'Mid-range' | 'Luxury')
  const mappedTier: PriceBand =
    travelerBudgetTier === 'Luxury'
      ? 'Luxury'
      : travelerBudgetTier === 'Budget'
      ? 'Budget'
      : 'Mid-range';

  // Filter stays matching budget tier if any have verified priceBand
  const matchedStays =
    selectedFilter === 'tier'
      ? stays.filter((s) => s.priceBand === mappedTier || s.priceBand === null)
      : stays;

  // Fallback to all if matched is empty
  const displayedStays = matchedStays.length > 0 ? matchedStays : stays;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-900 border border-amber-500/20">
              Official Tourism Stays
            </span>
            <span className="text-xs text-stone-500">
              Matched to: <strong>{travelerBudgetTier}</strong> tier
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mt-1 flex items-center gap-2">
            Where to Stay in {district}
          </h3>
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl self-start sm:self-auto text-xs">
          <button
            onClick={() => setSelectedFilter('tier')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'tier'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Recommended ({travelerBudgetTier})
          </button>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Verified ({stays.length})
          </button>
        </div>
      </div>

      {/* Stays List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedStays.map((stay) => (
          <div
            key={stay.id}
            className="p-5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-amber-400 transition-all space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-700">
                    {stay.type}
                  </span>
                  <h4 className="font-serif font-bold text-base text-stone-900 mt-1">
                    {stay.name}
                  </h4>
                  <div className="text-xs font-serif text-amber-800 italic">
                    {stay.nameTamil}
                  </div>
                </div>

                {/* Price Display: Only if verified, null otherwise */}
                <div className="text-right shrink-0">
                  {stay.approxPriceINR !== null ? (
                    <div>
                      <span className="text-base font-bold font-mono text-emerald-800">
                        ₹{stay.approxPriceINR}
                      </span>
                      <span className="text-[10px] text-stone-500 block">/ night approx</span>
                    </div>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200/70 text-stone-600">
                      Check on official site
                    </span>
                  )}
                </div>
              </div>

              {/* Locality */}
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>{stay.locality}</span>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-stone-200/60 text-stone-600">
                <div>
                  <strong className="text-stone-800">Check-in: </strong>
                  {stay.checkInTime || 'Check on official site'}
                </div>
                <div>
                  <strong className="text-stone-800">Check-out: </strong>
                  {stay.checkOutTime || 'Check on official site'}
                </div>
                {stay.contactPhone && (
                  <div className="col-span-2 flex items-center gap-1 text-stone-700">
                    <Phone className="w-3 h-3 text-stone-500" />
                    <span>{stay.contactPhone}</span>
                  </div>
                )}
                {stay.accessibilityNotes && (
                  <div className="col-span-2 flex items-start gap-1 text-stone-600">
                    <Accessibility className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{stay.accessibilityNotes}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between gap-2">
              <div className="text-[10px] text-stone-500 font-mono">
                {stay.sourceName}
              </div>

              {!isOfflineDossier ? (
                <a
                  href={stay.officialBookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Book on Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-[10px] font-mono text-stone-600">
                  Official Portal: {stay.officialBookingUrl}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[11px] text-stone-500 italic bg-stone-50 p-3 rounded-xl border border-stone-200">
        Note: Booking links navigate to official TTDC / Government guest house portals. TamizN Visa does not process payments or collect commissions.
      </div>
    </div>
  );
};
