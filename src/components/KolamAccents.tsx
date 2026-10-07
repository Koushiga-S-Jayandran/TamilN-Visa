import React from 'react';

/**
 * TAMIZN VISA - Subtle Cultural Kolam and Temple Geometries
 * Used for elegant borders, section accents, and background watermarks.
 */

export const KolamDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 my-6 text-amber-600/40 ${className}`}>
    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-amber-600/40" />
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-amber-500/70">
      <path
        d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="currentColor"
        fillOpacity="0.15"
      />
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
    <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-amber-600/40" />
  </div>
);

export const KolamWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`pointer-events-none opacity-5 select-none ${className}`}>
    <svg width="320" height="320" viewBox="0 0 100 100" fill="none" stroke="currentColor">
      <circle cx="50" cy="50" r="45" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="32" strokeWidth="0.5" />
      <polygon points="50,10 90,50 50,90 10,50" strokeWidth="0.75" />
      <polygon points="50,18 82,50 50,82 18,50" strokeWidth="0.5" />
      <circle cx="50" cy="50" r="12" strokeWidth="0.75" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  </div>
);
