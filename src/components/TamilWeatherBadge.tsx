import React from 'react';
import { WeatherInsight } from '../services/weatherService';

interface TamilWeatherBadgeProps {
  weather: WeatherInsight;
  variant?: 'compact' | 'detailed';
  className?: string;
}

/**
 * Traditional Tamil Nadu Climate Pattern Badge
 * Displays iconic symbols for 'Monsoon' (மழைக்காலம்), 'Dry' (வறண்ட), and 'Humid' (ஈரப்பதம்)
 */
export const TamilWeatherBadge: React.FC<TamilWeatherBadgeProps> = ({
  weather,
  variant = 'compact',
  className = '',
}) => {
  // Traditional Custom Weather Icon SVGs
  const renderTraditionalIcon = () => {
    switch (weather.pattern) {
      case 'Monsoon':
        return (
          // Monsoon Rain & Saral Clouds
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-sky-400 shrink-0">
            <path
              d="M7 16C4.79 16 3 14.21 3 12C3 9.94 4.55 8.24 6.56 8.03C7.28 5.67 9.44 4 12 4C15.08 4 17.62 6.27 18.06 9.24C19.74 9.68 21 11.19 21 13C21 15.21 19.21 17 17 17H7"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Traditional Monsoon Slanted Rainfall Droplets */}
            <path d="M8 19L6.5 22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 19L10.5 22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
            <path d="M16 19L14.5 22" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'Dry':
        return (
          // Radiant Tamil Surya / Inland Dry Heat Sun
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-amber-400 shrink-0">
            <circle cx="12" cy="12" r="4.5" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            {/* Radiating 8-point Surya Rays */}
            <path d="M12 2V5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 19V22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M2 12H5" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M19 12H22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
            <path d="M5 5L7.2 7.2" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M16.8 16.8L19 19" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M5 19L7.2 16.8" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round" />
            <path d="M16.8 7.2L19 5" stroke="#F59E0B" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        );

      case 'Humid':
        return (
          // Coromandel Sea Mist & Coastal Moisture Wave
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-cyan-400 shrink-0">
            {/* Marine Moisture droplet */}
            <path
              d="M12 2.5C12 2.5 6.5 9 6.5 13C6.5 16 8.96 18.5 12 18.5C15.04 18.5 17.5 16 17.5 13C17.5 9 12 2.5 12 2.5Z"
              fill="#06B6D4"
              fillOpacity="0.25"
              stroke="#06B6D4"
              strokeWidth="1.7"
            />
            {/* Coastal sea breeze ripple */}
            <path
              d="M3 21C6 19.5 9 22.5 12 21C15 19.5 18 22.5 21 21"
              stroke="#22D3EE"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        );

      case 'Mountain Cool':
      default:
        return (
          // Western Ghats Mist & Mountain Peak
          <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-emerald-400 shrink-0">
            <path
              d="M4 20L11 8L16 16L18 13L21 20H4Z"
              stroke="#10B981"
              strokeWidth="1.8"
              fill="#10B981"
              fillOpacity="0.2"
              strokeLinejoin="round"
            />
            {/* Shola Mist Bar */}
            <path d="M2 17H8" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />
            <path d="M15 12H21" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="1 2" />
          </svg>
        );
    }
  };

  const getThemeStyles = () => {
    switch (weather.pattern) {
      case 'Monsoon':
        return {
          bg: 'bg-sky-950/85',
          border: 'border-sky-500/40',
          text: 'text-sky-300',
          pill: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
        };
      case 'Dry':
        return {
          bg: 'bg-amber-950/85',
          border: 'border-amber-500/40',
          text: 'text-amber-300',
          pill: 'bg-amber-500/20 text-amber-200 border-amber-400/40',
        };
      case 'Humid':
        return {
          bg: 'bg-cyan-950/85',
          border: 'border-cyan-500/40',
          text: 'text-cyan-300',
          pill: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
        };
      case 'Mountain Cool':
      default:
        return {
          bg: 'bg-emerald-950/85',
          border: 'border-emerald-500/40',
          text: 'text-emerald-300',
          pill: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
        };
    }
  };

  const theme = getThemeStyles();

  if (variant === 'compact') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md border ${theme.bg} ${theme.border} ${className} shadow-sm`}
        title={`${weather.pattern} (${weather.tamilLabel}): ${weather.conditionDescription}. Temp: ${weather.tempCelsius}°C`}
      >
        {renderTraditionalIcon()}
        <div className="flex items-center gap-1 text-[11px] font-bold leading-none">
          <span className={theme.text}>{weather.pattern}</span>
          <span className="text-stone-300 font-mono text-[10px]">
            {weather.tempCelsius}°C
          </span>
        </div>
      </div>
    );
  }

  // Detailed view for Modals / Itinerary Cards
  return (
    <div
      className={`rounded-2xl p-4 border backdrop-blur-md ${theme.bg} ${theme.border} ${className} space-y-2 text-xs`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {renderTraditionalIcon()}
          <div>
            <span className={`font-black uppercase tracking-wider text-sm ${theme.text}`}>
              {weather.pattern} Climate
            </span>
            <span className="text-[11px] text-stone-300 font-serif italic ml-2">
              ({weather.tamilLabel})
            </span>
          </div>
        </div>

        <div className="text-right">
          <span className="font-mono font-bold text-base text-white">
            {weather.tempCelsius}°C
          </span>
          <span className="text-[10px] text-stone-400 block font-mono">
            Humidity: {weather.humidityPercent}%
          </span>
        </div>
      </div>

      <p className="text-stone-300 leading-relaxed font-medium">
        {weather.conditionDescription}
      </p>

      <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-200">
        <span>💡 <strong>Traveler Advisory: </strong>{weather.travelerAdvice}</span>
      </div>
    </div>
  );
};
