import React from 'react';

interface TamilBrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

/**
 * TAMIZN VISA - Official Emblem Roundel
 *
 * Symmetrical circular roundel featuring:
 * 1. Maroon #7A1F2B deep background
 * 2. Kolam ring of 12 gold (#C8962E) dots
 * 3. The Tamil Nadu State Bird: Emerald Dove (மரresource/மரகதப் புறா - Maragatha Pura)
 *    - Bronze-emerald green wings (#1B7A43, #2E8B57)
 *    - Pinkish-grey head and chest (#C49A94)
 *    - White shoulder patch (#FFFDF5)
 *    - Red bill (#DC2626)
 * 4. Stays ultra-sharp at favicon scale.
 */
export const EmeraldDoveRoundel: React.FC<{ sizeClassName?: string }> = ({
  sizeClassName = 'w-10 h-10',
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${sizeClassName} shrink-0 drop-shadow-md select-none`}
  >
    {/* Base Maroon Disc */}
    <circle cx="32" cy="32" r="30" fill="#7A1F2B" stroke="#C8962E" strokeWidth="2" />
    <circle cx="32" cy="32" r="28" stroke="#C8962E" strokeWidth="0.75" strokeOpacity="0.4" />

    {/* Ring of 12 Kolam-Style Gold Dots */}
    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
      const rad = (deg * Math.PI) / 180;
      const x = 32 + 25.5 * Math.cos(rad);
      const y = 32 + 25.5 * Math.sin(rad);
      return (
        <circle
          key={deg}
          cx={x}
          cy={y}
          r="1.2"
          fill="#FFFDF5"
          stroke="#C8962E"
          strokeWidth="0.5"
        />
      );
    })}

    {/* Subtle Inner Radiant Glow */}
    <circle cx="32" cy="32" r="21" fill="#8B2432" opacity="0.6" />

    {/* Branch / Perch */}
    <path
      d="M14 43C22 41 42 41 50 44"
      stroke="#C8962E"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M36 43C39 40 45 39 48 40"
      stroke="#A17420"
      strokeWidth="1.5"
      strokeLinecap="round"
    />

    {/* Dove Feet */}
    <path d="M33 40L33 42.5M36 40L36 42.5" stroke="#E11D48" strokeWidth="1.5" strokeLinecap="round" />

    {/* Emerald Dove Tail (Rufous & Bronze) */}
    <path
      d="M20 37C18 41 16 46 15 48C17 48 22 44 24 40Z"
      fill="#4A2810"
      stroke="#C8962E"
      strokeWidth="0.5"
    />

    {/* Emerald Green Back and Upper Wing */}
    <path
      d="M24 33C24 27 29 25 35 25C40 25 43 28 43 32C43 36 38 40 32 40C27 40 24 37 24 33Z"
      fill="#1B7A43"
    />
    {/* Wing Feather Gradient Layers */}
    <path
      d="M22 34C22 30 26 27 33 27C37 27 40 30 40 34C37 38 31 39 25 38Z"
      fill="#239454"
    />
    <path
      d="M21 36C22 32 27 29 34 30C32 35 27 38 22 38Z"
      fill="#155D34"
    />

    {/* Iconic White Shoulder Patch */}
    <path
      d="M27 27C29 25.5 32 25.5 34 26.5C33 28 30 29.5 28 29.5C26.5 29.5 26 28 27 27Z"
      fill="#FFFDF5"
    />

    {/* Pinkish-Grey Chest and Flank */}
    <path
      d="M34 26C37 26 42 27 43 31C44 34 42 38 37 39C34 39 33 36 34 32C34 28 34 26 34 26Z"
      fill="#C49A94"
    />

    {/* Pinkish-Grey Head */}
    <path
      d="M37 21C37 18 41 17 44 19C46 20.5 46 23 44 25C42 26 38 25 37 21Z"
      fill="#B88B86"
    />

    {/* Forehead Pale Sheen */}
    <path
      d="M40 18.5C42 18 43.5 19 44 20.5C43 20 41 19.5 40 18.5Z"
      fill="#E5D0CD"
    />

    {/* Dove Eye */}
    <circle cx="42.5" cy="20.5" r="1.3" fill="#1C1917" />
    <circle cx="42.8" cy="20.2" r="0.4" fill="#FFFFFF" />

    {/* Coral Red Bill */}
    <path
      d="M45.5 20.5L49.5 21.5L45.5 22.5Z"
      fill="#DC2626"
    />
  </svg>
);

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
      {/* Tamil Nadu Emerald Dove State Bird Roundel */}
      <EmeraldDoveRoundel sizeClassName={iconDimensions} />

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
