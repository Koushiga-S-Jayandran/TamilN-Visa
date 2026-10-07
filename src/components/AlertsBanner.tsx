import React, { useState } from 'react';
import { DESTINATION_ALERTS_DATA } from '../data/alerts';
import { AlertTriangle, X, ChevronRight, ShieldAlert } from 'lucide-react';

export const AlertsBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  if (dismissed || DESTINATION_ALERTS_DATA.length === 0) return null;

  const currentAlert = DESTINATION_ALERTS_DATA[activeIndex];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % DESTINATION_ALERTS_DATA.length);
  };

  return (
    <div className="bg-amber-950 text-amber-100 border-b border-amber-800/80 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-amber-500 text-stone-950 shrink-0 uppercase">
            TRAVEL ADVISORY
          </span>
          <span className="font-bold text-amber-200 shrink-0">
            [{currentAlert.district}] {currentAlert.destinationName}:
          </span>
          <span className="truncate text-amber-300 font-medium">
            {currentAlert.title} — {currentAlert.description}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleNext}
            className="text-[11px] underline hover:text-white transition-colors"
          >
            Next Advisory ({activeIndex + 1}/{DESTINATION_ALERTS_DATA.length})
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:text-white"
            title="Dismiss alerts"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
