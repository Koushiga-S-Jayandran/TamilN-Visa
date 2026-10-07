import React from 'react';
import { SavedTrip } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { DESTINATION_ALERTS_DATA } from '../data/alerts';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  MapPin,
  Calendar,
  Users,
  Clock,
  PhoneCall,
  AlertTriangle,
} from 'lucide-react';

interface OfflineTripSummaryModalProps {
  trip: SavedTrip | null;
  onClose: () => void;
}

export const OfflineTripSummaryModal: React.FC<OfflineTripSummaryModalProps> = ({
  trip,
  onClose,
}) => {
  if (!trip) return null;

  // Filter alerts relevant to this destination district
  const districtAlerts = DESTINATION_ALERTS_DATA.filter(
    (a) => a.district.toLowerCase() === trip.destinationDistrict.toLowerCase()
  );

  const handlePrint = () => {
    try {
      window.print();
    } catch (err) {
      console.warn('Printing not available in iframe sandbox:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 max-h-[92vh] flex flex-col">
        
        {/* Modal Top Control Header (Hidden when printing!) */}
        <div className="no-print bg-stone-900 text-stone-100 p-4 sm:p-6 flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Saved for Offline Access
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Offline Dossier Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-8 flex-1 text-stone-900">
          
          {/* Header Banner */}
          <div className="border-b-2 border-stone-900 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-700 mb-1">
                {APP_CONFIG.brandName} • OFFICIAL OFFLINE DOSSIER
              </div>
              <h1 className="text-3xl font-serif font-bold text-stone-950">
                {trip.name}
              </h1>
              <p className="text-xs text-stone-500 italic mt-0.5">
                “{APP_CONFIG.tagline}”
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-stone-600 space-y-0.5">
              <div><strong>District:</strong> {trip.destinationDistrict}</div>
              <div><strong>Travel Date:</strong> {trip.travelDate}</div>
              <div><strong>Party:</strong> {trip.travelers} travelers ({trip.travelerType})</div>
              <div><strong>Est. Cost:</strong> ₹{trip.budgetUsedINR.toLocaleString()}</div>
            </div>
          </div>

          {/* Important Destination Alerts */}
          {districtAlerts.length > 0 && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs uppercase font-bold tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                Mandatory Destination Advisories for {trip.destinationDistrict}
              </h3>
              {districtAlerts.map((alt) => (
                <div key={alt.id} className="text-xs text-amber-950">
                  <strong>• {alt.title}: </strong>
                  <span>{alt.description}</span>
                </div>
              ))}
            </div>
          )}

          {/* Day-by-Day Schedule */}
          <div className="space-y-6">
            <h2 className="text-base uppercase tracking-widest font-bold text-stone-400">
              Verified Daily Timeline (06:00 AM – 09:00 PM)
            </h2>

            {trip.itineraryDays.map((day) => (
              <div key={day.dayNumber} className="border border-stone-200 rounded-2xl p-5 space-y-3 bg-stone-50/50">
                <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                  <h3 className="font-serif font-bold text-base text-stone-900">
                    Day {day.dayNumber}: {day.focusArea}
                  </h3>
                  <span className="text-xs font-mono font-bold text-amber-800">
                    Day Budget: ₹{day.dayBudgetINR}
                  </span>
                </div>
                <p className="text-xs text-stone-500 italic">{day.summary}</p>

                <div className="space-y-2.5 pt-1">
                  {day.activities.map((act, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="font-mono text-amber-800">{act.timeWindow}</span>
                        <span className="text-stone-700">{act.title}</span>
                        <span className="text-stone-500">{act.estimatedCostINR > 0 ? `₹${act.estimatedCostINR}` : 'Free'}</span>
                      </div>
                      <p className="text-stone-600 text-[11px] leading-relaxed">
                        <strong>Reason: </strong>{act.whyNowReason}
                      </p>
                      {act.notes && (
                        <p className="text-stone-500 text-[10px] italic">
                          Tip: {act.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Essential Tamil Nadu Emergency & Tourism Helplines */}
          <div className="border-t-2 border-stone-200 pt-6 space-y-3">
            <h3 className="text-xs uppercase tracking-widest font-bold text-stone-700 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-600" />
              Verified Emergency & Support Helplines (Tamil Nadu)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">ALL EMERGENCIES</span>
                <span className="font-mono font-bold text-stone-900 text-sm">112</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">TTDC TOURIST HELPLINE</span>
                <span className="font-mono font-bold text-stone-900 text-sm">1800-4253-1111</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">MEDICAL AMBULANCE</span>
                <span className="font-mono font-bold text-stone-900 text-sm">108</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px] font-bold">DISASTER CONTROL</span>
                <span className="font-mono font-bold text-stone-900 text-sm">1077</span>
              </div>
            </div>
          </div>

          {/* Footer Institutional Accreditation */}
          <div className="pt-6 border-t border-stone-200 text-center text-xs text-stone-400 space-y-1">
            <p>Made by: {APP_CONFIG.creator.name} • {APP_CONFIG.creator.institution}</p>
            <p>{APP_CONFIG.creator.location} • Tamil Nadu, India</p>
          </div>

        </div>

      </div>
    </div>
  );
};
