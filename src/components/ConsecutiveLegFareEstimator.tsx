import React from 'react';
import { estimateConsecutiveLegFares, TransitLegFareEstimate } from '../config/fares';
import { Compass, Car, Bike, Info } from 'lucide-react';

interface ConsecutiveLegFareEstimatorProps {
  fromName: string;
  toName: string;
  fromLat: number;
  fromLng: number;
  toLat: number;
  toLng: number;
}

/**
 * Ride-hailing style consecutive stop transit fare estimator.
 * Uses straight-line distance x 1.3 road winding factor.
 */
export const ConsecutiveLegFareEstimator: React.FC<ConsecutiveLegFareEstimatorProps> = ({
  fromName,
  toName,
  fromLat,
  fromLng,
  toLat,
  toLng,
}) => {
  // Approximate planning assumptions. Replace with verified rates.
  const fareData: TransitLegFareEstimate = estimateConsecutiveLegFares(
    fromLat,
    fromLng,
    toLat,
    toLng
  );

  return (
    <div className="bg-gradient-to-r from-stone-50 via-white to-stone-50 p-3.5 sm:p-4 rounded-2xl border border-stone-200/90 shadow-sm space-y-2.5 my-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-stone-200/60 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
          <span className="w-2 h-2 rounded-full bg-amber-600" />
          <span>Local Transit Transfer: <strong>{fromName}</strong> → <strong>{toName}</strong></span>
        </div>
        <div className="text-[11px] font-mono text-stone-500">
          Est. Road Distance: <strong>{fareData.roadDistanceKm} km</strong> (straight line: {fareData.straightLineDistanceKm} km × 1.3)
        </div>
      </div>

      {/* Ride Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {/* Auto Rickshaw */}
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-300/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{fareData.autoFare.icon}</span>
            <div>
              <strong className="block text-stone-900">{fareData.autoFare.mode}</strong>
              <span className="text-[10px] text-stone-500">Auto Stand / Meter</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-amber-950 text-sm">
              {fareData.autoFare.formattedRange}
            </span>
          </div>
        </div>

        {/* Private Cab / Taxi */}
        <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{fareData.cabFare.icon}</span>
            <div>
              <strong className="block text-stone-900">{fareData.cabFare.mode}</strong>
              <span className="text-[10px] text-stone-500">Local Cab / AC Car</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-stone-950 text-sm">
              {fareData.cabFare.formattedRange}
            </span>
          </div>
        </div>

        {/* Bike Taxi */}
        <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base">{fareData.bikeTaxiFare.icon}</span>
            <div>
              <strong className="block text-stone-900">{fareData.bikeTaxiFare.mode}</strong>
              <span className="text-[10px] text-stone-500">Single Rider Quick</span>
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono font-bold text-sky-950 text-sm">
              {fareData.bikeTaxiFare.formattedRange}
            </span>
          </div>
        </div>
      </div>

      <div className="text-[10px] text-stone-400 italic flex items-center gap-1">
        <Info className="w-3 h-3 text-stone-400 shrink-0" />
        <span>{fareData.disclaimer}</span>
      </div>
    </div>
  );
};
