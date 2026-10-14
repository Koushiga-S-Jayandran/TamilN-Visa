import React from 'react';
import { Shield, PhoneCall, MapPin, Share2, AlertCircle } from 'lucide-react';
import { STATE_WIDE_EMERGENCY_NUMBERS, getDistrictSafety } from '../data/safety/districtSafetyData';
import { SafetyTrailService } from '../services/safetyTrailService';

interface EmergencyHelplineBannerProps {
  currentDistrict?: string;
  onOpenSafetyModal: () => void;
  onToggleSafetyMode: () => void;
  isSafetyModeActive: boolean;
}

export const EmergencyHelplineBanner: React.FC<EmergencyHelplineBannerProps> = ({
  currentDistrict,
  onOpenSafetyModal,
  onToggleSafetyMode,
  isSafetyModeActive,
}) => {
  if (!isSafetyModeActive) return null;

  const districtSafety = currentDistrict ? getDistrictSafety(currentDistrict) : null;

  const handleQuickShare = () => {
    SafetyTrailService.shareLocation(
      'Live Location',
      currentDistrict || 'Tamil Nadu',
      undefined,
      undefined,
      undefined
    );
  };

  return (
    <div className="bg-rose-950 text-rose-50 border-b border-rose-800 shadow-md sticky top-20 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs">
          
          {/* Left: Mode Indicator & Numbers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider shadow-sm animate-pulse">
              <Shield className="w-3.5 h-3.5" />
              Solo / Women Safety Mode
            </span>

            <span className="text-rose-200 hidden sm:inline">|</span>

            {/* Emergency Numbers */}
            <div className="flex flex-wrap items-center gap-2 font-mono">
              {STATE_WIDE_EMERGENCY_NUMBERS.slice(0, 4).map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="px-2 py-0.5 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 font-bold border border-rose-700/60 transition-colors flex items-center gap-1"
                  title={`${item.label} (${item.purpose})`}
                >
                  <PhoneCall className="w-3 h-3 text-rose-300" />
                  <span>{item.number}</span>
                  <span className="text-[10px] text-rose-300 font-sans hidden lg:inline">({item.label})</span>
                </a>
              ))}
              <a
                href="tel:108"
                className="px-2 py-0.5 rounded bg-rose-900/80 hover:bg-rose-800 text-rose-100 font-bold border border-rose-700/60 transition-colors flex items-center gap-1"
                title="Ambulance"
              >
                <span>108</span>
                <span className="text-[10px] text-rose-300 font-sans hidden lg:inline">(Ambulance)</span>
              </a>
            </div>

            {districtSafety && (
              <span className="text-[11px] text-rose-300 font-sans flex items-center gap-1 ml-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{currentDistrict} Police Control: <strong>{districtSafety.policeControlRoom}</strong></span>
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              onClick={handleQuickShare}
              className="px-3 py-1 rounded-lg bg-rose-800 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm"
              title="Share live location with emergency contact"
            >
              <Share2 className="w-3 h-3" />
              <span>Share Location</span>
            </button>

            <button
              onClick={onOpenSafetyModal}
              className="px-3 py-1 rounded-lg bg-white text-rose-950 font-bold text-[11px] hover:bg-rose-100 transition-colors shadow-sm"
            >
              Safety Info & Trail
            </button>

            <button
              onClick={onToggleSafetyMode}
              className="text-[10px] text-rose-400 hover:text-rose-200 underline ml-1"
              title="Turn off Solo / Women Safety Mode"
            >
              Turn off
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
