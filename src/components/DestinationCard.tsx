import React from 'react';
import { Destination } from '../types';
import { evaluateCrowd } from '../services/crowdEngine';
import { getDestinationWeather } from '../services/weatherService';
import { TamilWeatherBadge } from './TamilWeatherBadge';
import {
  MapPin,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Bookmark,
  Sun,
  Compass,
} from 'lucide-react';

interface DestinationCardProps {
  destination: Destination;
  onSelect: (dest: Destination) => void;
  onBookmark?: (dest: Destination) => void;
  isBookmarked?: boolean;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  onSelect,
  onBookmark,
  isBookmarked = false,
}) => {
  const crowd = evaluateCrowd(destination);
  const weather = getDestinationWeather(destination);

  const getCrowdBadgeStyle = (level: string) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50';
      case 'MODERATE':
        return 'bg-amber-950/80 text-amber-300 border-amber-500/50';
      case 'HIGH':
        return 'bg-orange-950/80 text-orange-300 border-orange-500/50';
      case 'VERY HIGH':
        return 'bg-rose-950/80 text-rose-300 border-rose-500/50';
      default:
        return 'bg-stone-900/80 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="group relative bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between">
      
      {/* Top Image Container with Visual Depth */}
      <div className="relative h-64 overflow-hidden bg-stone-950">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        {/* Layered cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-black/30" />

        {/* Top Badges: Category & Dynamic Climate Pattern Badge */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-xl text-[11px] font-bold tracking-wider uppercase bg-stone-950/85 text-amber-300 backdrop-blur-md border border-amber-500/30 shadow-md">
            {destination.category}
          </span>

          {/* DYNAMIC REGIONAL WEATHER BADGE with Traditional Icons */}
          <TamilWeatherBadge weather={weather} variant="compact" />
        </div>

        {/* Bottom Image Overlay Info */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white z-10">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="tracking-wide uppercase text-[11px] font-bold">{destination.district} District</span>
            </div>

            {/* Crowd Level Indicator */}
            <div className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${getCrowdBadgeStyle(crowd.crowdLevel)}`}>
              Crowd: {crowd.crowdLevel}
            </div>
          </div>

          <h3 className="font-serif font-black text-xl leading-snug drop-shadow-md line-clamp-1 text-stone-100 group-hover:text-amber-200 transition-colors">
            {destination.name}
          </h3>
          {destination.tamilName && (
            <p className="text-xs text-amber-300/80 font-medium line-clamp-1 font-serif">
              {destination.tamilName}
            </p>
          )}
        </div>
      </div>

      {/* Card Body Information */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4 bg-gradient-to-b from-white to-stone-50/60">
        
        {/* Description snippet */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {destination.description}
        </p>

        {/* Micro-Climate & Optimal Timing Bar */}
        <div className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200/70 space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-amber-900 flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Optimal Timing:</span>
            </span>
            <span className="font-semibold text-stone-700">
              {destination.recommendedDurationMinutes} mins visit
            </span>
          </div>
          <p className="text-[11px] text-amber-950 font-medium leading-tight">
            {destination.bestVisitingTime}
          </p>
          <div className="pt-1 text-[10px] text-stone-500 flex items-center justify-between border-t border-amber-200/50">
            <span>Climate: <strong className="text-stone-800">{weather.pattern}</strong> ({weather.tamilLabel})</span>
            <span className="font-mono text-amber-900">{weather.tempCelsius}°C • {weather.humidityPercent}% Humidity</span>
          </div>
        </div>

        {/* Timings & Cost summary */}
        <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span className="font-medium">{destination.openingTime} - {destination.closingTime}</span>
          </div>
          <div className="font-bold text-stone-900">
            {destination.estimatedCostINR.isFree ? (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Free Entry
              </span>
            ) : (
              <span className="text-amber-950 font-semibold">
                From ₹{destination.estimatedCostINR.min}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <button
            onClick={() => onSelect(destination)}
            className="flex-1 py-3 px-4 rounded-2xl bg-stone-900 hover:bg-amber-600 text-stone-100 hover:text-stone-950 font-black text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-98"
          >
            <span>Explore Place</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          
          {onBookmark && (
            <button
              onClick={() => onBookmark(destination)}
              title={isBookmarked ? 'Saved to bookmarks' : 'Save destination'}
              className={`p-3 rounded-2xl border transition-all ${
                isBookmarked
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                  : 'bg-white hover:bg-stone-100 border-stone-300 text-stone-600'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-600' : ''}`} />
            </button>
          )}
        </div>

        {/* Source citation */}
        <div className="text-[10px] text-stone-400 flex items-center gap-1.5 pt-1 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">Official Record: {destination.source.sourceName}</span>
        </div>

      </div>

    </div>
  );
};
