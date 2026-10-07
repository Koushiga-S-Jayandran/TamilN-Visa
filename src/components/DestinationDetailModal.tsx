import React, { useState } from 'react';
import { Destination } from '../types';
import { evaluateCrowd } from '../services/crowdEngine';
import { getDestinationWeather } from '../services/weatherService';
import { TamilWeatherBadge } from './TamilWeatherBadge';
import {
  X,
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Bus,
  UtensilsCrossed,
  Info,
  ExternalLink,
  Camera,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface DestinationDetailModalProps {
  destination: Destination | null;
  onClose: () => void;
  onPlanForThisPlace?: (district: string) => void;
}

export const DestinationDetailModal: React.FC<DestinationDetailModalProps> = ({
  destination,
  onClose,
  onPlanForThisPlace,
}) => {
  const [showCrowdFactors, setShowCrowdFactors] = useState(false);

  if (!destination) return null;

  const crowd = evaluateCrowd(destination);
  const weather = getDestinationWeather(destination);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 max-h-[92vh] flex flex-col">
        
        {/* Header Hero Image */}
        <div className="relative h-64 sm:h-80 bg-stone-900 shrink-0">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/50 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-950 text-white backdrop-blur-md border border-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title and District */}
          <div className="absolute bottom-5 inset-x-6 text-white space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-amber-500 text-stone-950">
                {destination.district}
              </span>
              <span className="px-3 py-1 rounded-md text-xs font-semibold tracking-wider uppercase bg-stone-900/80 text-stone-200 border border-stone-700">
                {destination.category}
              </span>
              {destination.isHiddenGem && (
                <span className="px-3 py-1 rounded-md text-xs font-bold tracking-wider uppercase bg-purple-600 text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Verified Hidden Gem
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {destination.name}
            </h2>
            {destination.tamilName && (
              <p className="text-sm text-amber-300 font-medium">{destination.tamilName}</p>
            )}
            <p className="text-xs text-stone-300 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{destination.cityArea}</span>
            </p>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          
          {/* Overview text */}
          <div>
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-400 mb-2">
              Overview & Cultural Context
            </h3>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {destination.description}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[11px] text-stone-400 block font-semibold uppercase">Visiting Hours</span>
              <span className="text-xs font-bold text-stone-800 flex items-center gap-1 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                {destination.openingTime} - {destination.closingTime}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 block font-semibold uppercase">Recommended Duration</span>
              <span className="text-xs font-bold text-stone-800 mt-0.5 block">
                {destination.recommendedDurationMinutes} minutes
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 block font-semibold uppercase">Entry Fee</span>
              <span className="text-xs font-bold text-emerald-700 mt-0.5 block">
                {destination.estimatedCostINR.isFree
                  ? 'Free Entry'
                  : `₹${destination.estimatedCostINR.min} - ₹${destination.estimatedCostINR.max}`}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-stone-400 block font-semibold uppercase">Closed Days</span>
              <span className="text-xs font-bold text-stone-800 mt-0.5 block">
                {destination.closedDays.length > 0 ? destination.closedDays.join(', ') : 'Open All Days'}
              </span>
            </div>
          </div>

          {/* Dynamic Tamil Nadu Climate & Weather Advisory Block */}
          <TamilWeatherBadge weather={weather} variant="detailed" />

          {/* Evidence-Based Crowd Insights Block */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold tracking-wider text-amber-900">
                  Crowd Status: <span className="underline decoration-amber-600">{crowd.crowdLevel}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-white text-stone-700 font-bold rounded border border-amber-300">
                  {crowd.predictionType}
                </span>
              </div>
              <button
                onClick={() => setShowCrowdFactors(!showCrowdFactors)}
                className="text-xs text-amber-800 hover:text-amber-950 font-semibold underline flex items-center gap-1 text-left"
              >
                <Info className="w-3.5 h-3.5" />
                <span>{showCrowdFactors ? 'Hide Factors' : 'Why am I seeing this?'}</span>
              </button>
            </div>

            <p className="text-xs text-stone-700 font-medium leading-relaxed">
              {crowd.reason}
            </p>

            <div className="text-xs text-amber-900 font-semibold flex items-center gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              <span>Recommended Window: {crowd.optimalVisitWindow}</span>
            </div>

            {/* Expanded Factors */}
            {showCrowdFactors && (
              <div className="pt-3 border-t border-amber-200/80 space-y-2 text-xs">
                <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider block">
                  Evidence Factors Evaluated:
                </span>
                <div className="space-y-1.5">
                  {crowd.factorsUsed.map((f, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        f.impact === 'INCREASES' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {f.impact}
                      </span>
                      <div>
                        <span className="font-semibold text-stone-900">{f.name}: </span>
                        <span className="text-stone-600">{f.description}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visitor Guidelines, Dress Code & Photography */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-stone-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Dress Code & Conduct
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {destination.dressRequirements}
              </p>
              <div className="pt-2 text-xs text-stone-600">
                <span className="font-semibold text-stone-800">Accessibility: </span>
                {destination.accessibilityInfo}
              </div>
            </div>

            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-2.5">
              <h4 className="text-xs uppercase tracking-wider font-bold text-stone-800 flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-600" />
                Photography & Electronics
              </h4>
              <p className="text-xs text-stone-700 leading-relaxed font-medium">
                {destination.photoRestrictions}
              </p>
              {destination.rules.length > 0 && (
                <div className="pt-2 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">Official Rules: </span>
                  {destination.rules.join(' • ')}
                </div>
              )}
            </div>
          </div>

          {/* Transport & Food Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-amber-600" />
                Local Transport Options
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {destination.transportOptions.map((t, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-bold text-stone-700 flex items-center gap-1.5">
                <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                Authentic Nearby Food
              </h4>
              <ul className="space-y-1.5 text-xs text-stone-600">
                {destination.nearbyFood.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-stone-50 p-2 rounded-lg border border-stone-200/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Source Attribution */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Verified Source: <strong className="text-stone-800">{destination.source.sourceName}</strong> (Confidence: {destination.source.confidence})
              </span>
            </div>
            {destination.source.sourceUrl && (
              <a
                href={destination.source.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-amber-700 hover:text-amber-900 font-semibold"
              >
                <span>View Source Documentation</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold text-xs transition-colors"
          >
            Close
          </button>
          {onPlanForThisPlace && (
            <button
              onClick={() => {
                onPlanForThisPlace(destination.district);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Plan Trip around {destination.district}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
