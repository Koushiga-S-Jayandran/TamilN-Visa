import React from 'react';

interface TamilBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

/**
 * TAMIZN VISA - Custom Tamil Nadu Cultural Brand Icon
 *
 * Inspired by:
 * 1. The sacred geometry of Tamil Gopuram architecture (tiered crown)
 * 2. The abstract Tamil character "த" (Tha for Thamizh)
 * 3. Sacred Kolam symmetry and the rising dawn sun over the Coromandel coast
 */
export const TamilBrandLogo: React.FC<TamilBrandLogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Sacred Gopuram + "த" Glyph SVG Emblem */}
      <div
        className={`${iconDimensions} relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 p-2 shadow-lg shadow-amber-950/40 border border-amber-500/30 group-hover:border-amber-400 transition-all`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-amber-300 drop-shadow-sm"
        >
          {/* Subtle radiance circle */}
          <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="3 3" />
          
          {/* Kalasam / Apex Spire */}
          <path
            d="M24 5L26 9H22L24 5Z"
            fill="#FBBF24"
          />
          <circle cx="24" cy="5" r="1.5" fill="#FDE68A" />

          {/* Tier 1 - Upper Gopuram Crown */}
          <path
            d="M20 10H28L29.5 14H18.5L20 10Z"
            fill="currentColor"
            fillOpacity="0.9"
          />

          {/* Tier 2 - Mid Gopuram & Tamil "த" loop integration */}
          <path
            d="M16 15H32L34 20H14L16 15Z"
            fill="#F59E0B"
          />

          {/* Tier 3 - Main Base Mandapam with Dravidian Arch Portal */}
          <path
            d="M12 21H36L38 28H10L12 21Z"
            fill="currentColor"
            fillOpacity="0.95"
          />

          {/* Base Plinth / Thinnai */}
          <rect x="8" y="29" width="32" height="4" rx="1" fill="#D97706" />

          {/* Stylized Inner Sanctum Portal resembling "த" curve */}
          <path
            d="M20 33V38C20 40 22 41 24 41C26 41 28 40 28 38V33"
            stroke="#FEF3C7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M24 33V37"
            stroke="#FEF3C7"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        {/* Ambient warmth glow */}
        <div className="absolute inset-0 rounded-xl bg-amber-500/10 blur-sm pointer-events-none" />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <span className="font-serif font-black tracking-wider text-xl text-stone-100 group-hover:text-amber-300 transition-colors">
              TAMIZN VISA
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
              தமிழ்நாடு
            </span>
          </div>
          <p className="text-[11px] text-amber-200/70 italic font-serif tracking-wide hidden sm:block">
            From Heritage to Hidden Horizons
          </p>
        </div>
      )}
    </div>
  );
};
