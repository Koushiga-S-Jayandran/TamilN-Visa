import React, { useState } from 'react';
import {
  ItineraryDay,
  TripPlannerInput,
  ActivitySlot,
  CrowdLevel,
} from '../types';
import { StorageService } from '../services/storageService';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Compass,
  ArrowRight,
  ShieldCheck,
  Download,
  Printer,
  Bookmark,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface ItineraryDashboardProps {
  plannerInput: TripPlannerInput;
  itineraryDays: ItineraryDay[];
  onOpenOfflineDossier: () => void;
  onModifyTrip: () => void;
  onViewDestinationDetail: (destinationId: string) => void;
}

export const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({
  plannerInput,
  itineraryDays,
  onOpenOfflineDossier,
  onModifyTrip,
  onViewDestinationDetail,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedTripName, setSavedTripName] = useState<string>(
    `${plannerInput.destinationDistrict} ${plannerInput.numberOfDays}-Day Heritage Tour`
  );

  const activeDay = itineraryDays[activeDayIndex] || itineraryDays[0];

  const totalEstimatedCost = itineraryDays.reduce((acc, d) => acc + d.dayBudgetINR, 0);
  const allocatedBudget = plannerInput.customBudgetINR || totalEstimatedCost * 1.2;
  const remainingBudget = Math.max(0, allocatedBudget - totalEstimatedCost);

  const handleSaveTrip = () => {
    StorageService.saveTrip(savedTripName, plannerInput, itineraryDays, true);
    setIsSaved(true);
  };

  const getCrowdBadgeStyle = (level?: CrowdLevel) => {
    switch (level) {
      case 'LOW':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MODERATE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'VERY HIGH':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
      
      {/* Top Banner: Trip Overview & Primary Actions */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-amber-500 text-stone-950">
              OPTIMIZED DAY PLANNER
            </span>
            <span className="px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider bg-stone-800 text-stone-300 border border-stone-700">
              06:00 AM – 09:00 PM Window
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
            {savedTripName}
          </h2>

          <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-1">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <strong>{plannerInput.destinationDistrict}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>{plannerInput.travelDate} ({plannerInput.numberOfDays} Days)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{plannerInput.numberOfTravelers} Travelers ({plannerInput.travelerType})</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={handleSaveTrip}
            disabled={isSaved}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md ${
              isSaved
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
            }`}
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Saved Offline</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Trip</span>
              </>
            )}
          </button>

          <button
            onClick={onOpenOfflineDossier}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-semibold flex items-center gap-2 transition-colors"
            title="Download printable offline trip summary"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Offline Dossier</span>
          </button>

          <button
            onClick={onModifyTrip}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-semibold transition-colors"
          >
            Modify Preferences
          </button>
        </div>
      </div>

      {/* Budget Tracker Dashboard Bar */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            Estimated Trip Expenses
          </span>
          <span className="text-xl font-serif font-bold text-stone-900 mt-1 block">
            ₹{totalEstimatedCost.toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500">Tickets, local meals & transit</span>
        </div>

        <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
            Allocated Budget
          </span>
          <span className="text-xl font-serif font-bold text-stone-900 mt-1 block">
            ₹{Math.round(allocatedBudget).toLocaleString()}
          </span>
          <span className="text-[11px] text-stone-500">{plannerInput.budgetTier} tier</span>
        </div>

        <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
            Remaining Buffer Balance
          </span>
          <span className="text-xl font-serif font-bold text-emerald-700 mt-1 block">
            ₹{Math.round(remainingBudget).toLocaleString()}
          </span>
          <span className="text-[11px] text-emerald-600 font-medium">Safe emergency margin</span>
        </div>
      </div>

      {/* Day Selector Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
        {itineraryDays.map((day, idx) => (
          <button
            key={idx}
            onClick={() => setActiveDayIndex(idx)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeDayIndex === idx
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            <span>Day {day.dayNumber}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded ${
              activeDayIndex === idx ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-500'
            }`}>
              ₹{day.dayBudgetINR}
            </span>
          </button>
        ))}
      </div>

      {/* Active Day Description & Focus Area */}
      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-700">
        <div>
          <strong className="text-stone-900 font-bold">Focus Area: </strong>
          <span>{activeDay.focusArea}</span>
        </div>
        <div className="text-stone-500 italic">
          {activeDay.summary}
        </div>
      </div>

      {/* Sequential Day-Wise Timeline Activity Slots */}
      <div className="space-y-4">
        {activeDay.activities.map((slot: ActivitySlot, index: number) => {
          const isMeal = slot.activityType === 'MEAL';
          const isRest = slot.activityType === 'REST';

          return (
            <div
              key={index}
              className={`rounded-2xl p-5 border transition-all ${
                isMeal
                  ? 'bg-orange-50/60 border-orange-200/80'
                  : isRest
                  ? 'bg-stone-50 border-stone-200'
                  : 'bg-white border-stone-200 shadow-sm hover:border-amber-400'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                {/* Time & Title Section */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
                      {slot.timeWindow}
                    </span>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                      Duration: {slot.durationMinutes} mins
                    </span>
                    {slot.travelBufferMinutes && (
                      <span className="text-[11px] text-amber-700 font-medium">
                        + {slot.travelBufferMinutes} min transit buffer
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
                    {slot.title}
                  </h3>

                  {/* Why Now Explainability Block */}
                  <div className="p-3 bg-stone-100/90 rounded-xl border border-stone-200/70 text-xs text-stone-700 flex items-start gap-2 mt-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-stone-900">Why at this time? </strong>
                      <span>{slot.whyNowReason}</span>
                    </div>
                  </div>

                  {slot.notes && (
                    <p className="text-xs text-stone-500 italic pt-1">
                      Note: {slot.notes}
                    </p>
                  )}
                </div>

                {/* Badges & Metrics */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  {slot.crowdLevel && (
                    <div className="text-right">
                      <div className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${getCrowdBadgeStyle(slot.crowdLevel)}`}>
                        Crowd: {slot.crowdLevel}
                      </div>
                      <div className="text-[9px] text-stone-400 font-mono mt-0.5">
                        {slot.crowdPredictionType}
                      </div>
                    </div>
                  )}

                  <div className="text-right">
                    <span className="text-xs font-bold text-stone-800">
                      {slot.estimatedCostINR > 0 ? `Est. ₹${slot.estimatedCostINR}` : 'Free'}
                    </span>
                  </div>

                  {slot.destinationId && (
                    <button
                      onClick={() => onViewDestinationDetail(slot.destinationId!)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-600 text-stone-100 text-[11px] font-bold transition-colors"
                    >
                      View Place Info
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
