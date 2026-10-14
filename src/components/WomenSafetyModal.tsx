import React, { useState, useEffect } from 'react';
import {
  Shield,
  PhoneCall,
  MapPin,
  Clock,
  CheckCircle2,
  Share2,
  Trash2,
  X,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import {
  STATE_WIDE_EMERGENCY_NUMBERS,
  DISTRICT_SAFETY_DATA,
  getDistrictSafety,
} from '../data/safety/districtSafetyData';
import { SafetyTrailService, SafetyCheckIn } from '../services/safetyTrailService';
import { TN_DISTRICTS } from '../config/appConfig';

interface WomenSafetyModalProps {
  initialDistrict?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const WomenSafetyModal: React.FC<WomenSafetyModalProps> = ({
  initialDistrict = 'Chennai',
  isOpen,
  onClose,
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>(initialDistrict);
  const [checkIns, setCheckIns] = useState<SafetyCheckIn[]>([]);

  useEffect(() => {
    if (isOpen) {
      setCheckIns(SafetyTrailService.getCheckIns());
      setSelectedDistrict(initialDistrict);
    }
  }, [isOpen, initialDistrict]);

  if (!isOpen) return null;

  const safetyInfo = getDistrictSafety(selectedDistrict);

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('tamizn_safety_trail');
      setCheckIns([]);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleShareCheckIn = (checkIn: SafetyCheckIn) => {
    SafetyTrailService.shareLocation(
      checkIn.stopTitle,
      checkIn.district,
      checkIn.locality,
      checkIn.latitude,
      checkIn.longitude
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-900 to-rose-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-rose-300">
                TAMIL NADU POLICE & TOURISM SAFETY
              </div>
              <h2 className="text-xl font-serif font-bold text-white">
                Solo & Women Travel Safety Directory
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-rose-300 hover:text-white rounded-xl hover:bg-rose-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700">
          
          {/* Emergency Helplines Section */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-rose-900 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-rose-700" />
              24/7 Verified Emergency Helplines
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {STATE_WIDE_EMERGENCY_NUMBERS.map((item) => (
                <a
                  key={item.number}
                  href={`tel:${item.number}`}
                  className="p-3 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors block text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-base font-black text-rose-900">{item.number}</span>
                    <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                  <div className="font-bold text-stone-900 mt-0.5">{item.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{item.purpose}</div>
                </a>
              ))}
            </div>
          </div>

          {/* District Selector & Verified Infrastructure */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-700" />
                District Safety Infrastructure
              </h3>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                {TN_DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d} District
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-800 block">
                  All-Women Police Station (AWPS)
                </span>
                <p className="font-bold text-stone-900 text-xs">{safetyInfo.allWomenPoliceStation}</p>
                <p className="text-[11px] text-stone-500">Nearest General: {safetyInfo.nearestPoliceStation}</p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">
                  24/7 Government Medical Facility
                </span>
                <p className="font-bold text-stone-900 text-xs">{safetyInfo.govtHospital24x7}</p>
                <p className="text-[11px] text-stone-500">Includes round-the-clock emergency casualty & trauma</p>
              </div>
            </div>

            {/* Well-lit & Safe Transit Advice */}
            <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-900 block">
                Verified Well-Lit Corridors & Safe Transit Notes
              </span>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-stone-700">
                {safetyInfo.safeTransitNotes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
                <li>
                  <strong>High-Footfall Areas:</strong> {safetyInfo.wellLitBusyCorridors.join(', ')}.
                </li>
              </ul>
            </div>
          </div>

          {/* Offline Safety Trail / Check-In Log */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                Offline Safety Trail Check-Ins ({checkIns.length})
              </h3>
              {checkIns.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="text-[11px] text-rose-700 hover:text-rose-900 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Log</span>
                </button>
              )}
            </div>

            {checkIns.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-2xl border border-dashed border-stone-300 text-center text-stone-500 text-xs">
                No check-ins logged yet. Click <strong>"Check-in done"</strong> on any stop card in your itinerary to log your physical safety trail offline.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                {checkIns.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-stone-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{item.stopTitle}</span>
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                        {item.district} • {new Date(item.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => handleShareCheckIn(item)}
                      className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[10px] flex items-center gap-1 transition-colors shrink-0"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Emergency Contacts backed by official TN Police records.
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
