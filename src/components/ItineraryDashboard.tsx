import React, { useState, useEffect } from 'react';
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
  Printer,
  Bookmark,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Share2,
  CloudRain,
  Sun,
  Sparkles,
  ExternalLink,
  Utensils,
  Coffee,
  ChevronDown,
  ChevronUp,
  Shuffle,
  Info,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { WeatherForecastWidget } from './WeatherForecastWidget';
import { WhereToStayCard } from './WhereToStayCard';
import { PublicTransportCard } from './PublicTransportCard';
import { ConsecutiveLegFareEstimator } from './ConsecutiveLegFareEstimator';
import { fetchDistrictWeather, DistrictWeatherReport } from '../services/weatherService';
import { generateDayPlanB } from '../services/weatherPlanB';
import { shareTripViaWhatsApp } from '../services/whatsappShare';
import { buildGoogleMapsUrl } from '../utils/maps';
import { getDistrictSafety } from '../data/safety/districtSafetyData';
import { SafetyTrailService } from '../services/safetyTrailService';
import { BudgetCalculatorModal } from './BudgetCalculatorModal';

interface ItineraryDashboardProps {
  plannerInput: TripPlannerInput;
  itineraryDays: ItineraryDay[];
  onOpenOfflineDossier: () => void;
  onModifyTrip: () => void;
  onViewDestinationDetail: (destinationId: string) => void;
  onShuffle?: () => void;
}

export const ItineraryDashboard: React.FC<ItineraryDashboardProps> = ({
  plannerInput,
  itineraryDays,
  onOpenOfflineDossier,
  onModifyTrip,
  onViewDestinationDetail,
  onShuffle,
}) => {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [savedTripName, setSavedTripName] = useState<string>(
    `${plannerInput.destinationDistrict} ${plannerInput.numberOfDays}-Day Heritage Tour`
  );
  const [weatherReport, setWeatherReport] = useState<DistrictWeatherReport | null>(null);
  const [isPlanBActive, setIsPlanBActive] = useState<boolean>(false);
  const [expandedMealIndices, setExpandedMealIndices] = useState<Record<number, boolean>>({});
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState<boolean>(false);
  const [isSafetyModeActive, setIsSafetyModeActive] = useState<boolean>(() => {
    return localStorage.getItem('tamizn_women_safety_mode') === 'true';
  });
  const [checkedInIds, setCheckedInIds] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    SafetyTrailService.getCheckIns().forEach((c) => {
      map[`${c.stopTitle}-${c.district}`] = true;
    });
    return map;
  });

  const toggleSafetyMode = () => {
    const next = !isSafetyModeActive;
    setIsSafetyModeActive(next);
    localStorage.setItem('tamizn_women_safety_mode', String(next));
    window.dispatchEvent(new Event('storage'));
  };

  const isPost1900Arrival = (timeWindow: string): boolean => {
    const match = timeWindow.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!match) return false;
    let hour = parseInt(match[1], 10);
    const period = match[3]?.toUpperCase();
    if (period === 'PM' && hour < 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour >= 19;
  };

  const activeDay = itineraryDays[activeDayIndex] || itineraryDays[0];

  const districtPlaces = DESTINATIONS_DATA.filter(
    (d) => d.district === plannerInput.destinationDistrict
  );
  const districtLat = districtPlaces[0]?.coordinates.lat ?? 13.0827;
  const districtLng = districtPlaces[0]?.coordinates.lng ?? 80.2707;

  useEffect(() => {
    let isMounted = true;
    fetchDistrictWeather(
      plannerInput.destinationDistrict,
      districtLat,
      districtLng,
      plannerInput.travelDate
    )
      .then((rep) => {
        if (isMounted) setWeatherReport(rep);
      })
      .catch((err) => console.warn('Could not load weather for Plan B evaluation:', err));

    return () => {
      isMounted = false;
    };
  }, [plannerInput.destinationDistrict, districtLat, districtLng, plannerInput.travelDate]);

  const totalEstimatedCost = itineraryDays.reduce((acc, d) => acc + d.dayBudgetINR, 0);
  const allocatedBudget = plannerInput.customBudgetINR || totalEstimatedCost * 1.2;
  const remainingBudget = Math.max(0, allocatedBudget - totalEstimatedCost);

  const dayForecast = weatherReport?.dailyForecasts[activeDayIndex] || weatherReport?.dailyForecasts[0];
  const planBResult = generateDayPlanB(activeDay, plannerInput.destinationDistrict, dayForecast);
  const activitiesToRender = isPlanBActive && planBResult.hasHazard ? planBResult.adjustedActivities : activeDay.activities;

  const placesCount = activitiesToRender.filter((a) => a.activityType === 'DESTINATION').length;
  const mealsCount = activitiesToRender.filter((a) => a.activityType === 'MEAL').length;

  const handleSaveTrip = () => {
    StorageService.saveTrip(savedTripName, plannerInput, itineraryDays, true);
    setIsSaved(true);
  };

  const toggleMealExpanded = (idx: number) => {
    setExpandedMealIndices((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
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

  const getMealHeaderColor = (mealType?: string) => {
    switch (mealType) {
      case 'breakfast':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-800';
      case 'lunch':
        return 'bg-orange-500/15 border-orange-500/30 text-orange-800';
      case 'dinner':
        return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-800';
      default:
        return 'bg-stone-200 border-stone-300 text-stone-800';
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
              06:30 AM – 09:00 PM Window
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
              <span>{plannerInput.travelDate}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>{plannerInput.numberOfTravelers} travelers ({plannerInput.travelerType})</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Shuffle suggestions button */}
          {onShuffle && (
            <button
              onClick={onShuffle}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
              title="Shuffle suggestions with new seed while obeying all rules"
            >
              <Shuffle className="w-4 h-4 text-amber-400" />
              <span>Shuffle Suggestions</span>
            </button>
          )}

          {/* One-tap WhatsApp Share */}
          <button
            onClick={() =>
              shareTripViaWhatsApp({
                tripName: savedTripName,
                plannerInput,
                itineraryDays,
                district: plannerInput.destinationDistrict,
                isPlanBActive,
              })
            }
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
            title="Share full verified trip plan via WhatsApp"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </button>

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
            onClick={toggleSafetyMode}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md ${
              isSafetyModeActive
                ? 'bg-rose-700 hover:bg-rose-600 text-white shadow-rose-900/30 ring-2 ring-rose-400'
                : 'bg-stone-800 hover:bg-rose-950 text-stone-300 border border-stone-700'
            }`}
            title="Toggle Solo / Women Safety Mode for all stops"
          >
            <Shield className="w-4 h-4 text-rose-400" />
            <span>{isSafetyModeActive ? 'Safety Mode: ON' : 'Women Safety Mode'}</span>
          </button>

          <button
            onClick={onModifyTrip}
            className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-semibold transition-colors"
          >
            Modify Preferences
          </button>
        </div>
      </div>

      {/* Part 11: Budget Tracker Dashboard Bar & Dynamic Calculator Trigger */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
              Estimated Trip Expenses
            </span>
            <span className="text-xl font-serif font-bold text-stone-900 mt-1 block">
              ₹{totalEstimatedCost.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-500">Tickets, local meals and transit</span>
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

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="text-[11px] text-stone-500">
            Includes verified tickets, dining tariffs, TTDC stays, transit & 12% contingency buffer.
          </span>
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold border border-amber-200 flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto cursor-pointer"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-700" />
            <span>Open Dynamic Budget Calculator</span>
          </button>
        </div>
      </div>

      {/* Weather Forecast Planning Widget */}
      <WeatherForecastWidget
        district={plannerInput.destinationDistrict}
        latitude={districtLat}
        longitude={districtLng}
        travelDate={plannerInput.travelDate}
      />

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
            <span
              className={`text-[10px] px-2 py-0.5 rounded ${
                activeDayIndex === idx ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-500'
              }`}
            >
              ₹{day.dayBudgetINR}
            </span>
          </button>
        ))}
      </div>

      {/* Part 4 Required Header Format: Day N: <focus area> | X places | 3 meals | about Y km */}
      <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
            DAY TIMELINE OVERVIEW
          </div>
          <h3 className="text-base sm:text-lg font-serif font-bold text-white">
            Day {activeDay.dayNumber}: {activeDay.focusArea} | {placesCount} places | {mealsCount} meals | about {activeDay.approxDistanceKm || 20} km
          </h3>
        </div>
        {activeDay.exceptionNote && (
          <div className="bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{activeDay.exceptionNote}</span>
          </div>
        )}
      </div>

      {/* Plan B – Weather Adjusted Alert & Switcher */}
      {planBResult.hasHazard && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-white border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-stone-950 font-bold shrink-0 mt-0.5">
                {planBResult.hazardType === 'RAIN' ? (
                  <CloudRain className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white">
                    Weather Advisory Detected
                  </span>
                  <span className="text-xs font-bold text-stone-900">
                    Day {activeDay.dayNumber} Weather Adjustment Available
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-medium">
                  {planBResult.hazardDescription}
                </p>
              </div>
            </div>

            {/* Plan A vs Plan B Toggle */}
            <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 self-start sm:self-auto shrink-0 shadow-inner">
              <button
                onClick={() => setIsPlanBActive(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  !isPlanBActive
                    ? 'bg-white text-stone-900 shadow-md border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Plan A (Original)
              </button>
              <button
                onClick={() => setIsPlanBActive(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isPlanBActive
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Plan B – Weather Adjusted</span>
              </button>
            </div>
          </div>

          {isPlanBActive ? (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  <strong>Plan B Active:</strong> {planBResult.indoorAlternativesUsed.length} vulnerable stops switched to verified indoor/covered heritage sites in {plannerInput.destinationDistrict}. All other day slots stay 100% intact.
                </span>
              </div>
              <button
                onClick={() => setIsPlanBActive(false)}
                className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
              >
                Switch back to Plan A
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-stone-500 italic">
              * Viewing Plan A (Original Itinerary). Switch to Plan B to see covered indoor alternatives for rainy or hot time slots.
            </div>
          )}
        </div>
      )}

      {/* Part 4: VERTICAL TIMELINE UI WITH CONNECTORS */}
      <div className="relative pl-4 sm:pl-8 border-l-2 border-stone-200 space-y-6">
        {activitiesToRender.map((slot: ActivitySlot, index: number) => {
          const isMeal = slot.activityType === 'MEAL';
          const isRest = slot.activityType === 'REST';
          const isAdjusted = isPlanBActive && planBResult.affectedSlotIndices.includes(index);
          const isDataBackedCrowd =
            slot.crowdLevel &&
            (slot.crowdPredictionType === 'LIVE DATA' || slot.crowdPredictionType === 'DATA-BACKED');

          const mapsUrl =
            slot.googleMapsUrl ||
            buildGoogleMapsUrl({
              name: slot.title.replace(/^Breakfast at |^Lunch at |^Dinner at /, ''),
              locality: slot.locality,
              district: slot.district || plannerInput.destinationDistrict,
            });

          const isMealExpanded = !!expandedMealIndices[index];

          return (
            <div key={index} className="relative group">
              {/* Timeline Marker Dot */}
              <div className="absolute -left-[25px] sm:-left-[41px] top-5 w-4 h-4 rounded-full border-2 border-white bg-amber-600 shadow-md group-hover:scale-125 transition-transform" />

              {/* Stop Card */}
              <div
                className={`rounded-3xl p-5 sm:p-6 border transition-all ${
                  isAdjusted
                    ? 'bg-amber-50/70 border-amber-400 shadow-md ring-2 ring-amber-400/20'
                    : isMeal
                    ? 'bg-white border-amber-200/90 shadow-sm'
                    : isRest
                    ? 'bg-stone-50 border-stone-200'
                    : 'bg-white border-stone-200 shadow-sm hover:border-amber-400 hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  
                  {/* Left: Stop Info */}
                  <div className="space-y-3 flex-1">
                    
                    {/* Time Window & Duration Bar */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-bold text-stone-900 bg-stone-100 px-3 py-1 rounded-xl border border-stone-200">
                        {slot.timeWindow}
                      </span>

                      <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-500">
                        Duration: {slot.durationMinutes} mins
                      </span>

                      {/* Category Tag */}
                      {slot.category && (
                        <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-200">
                          {slot.category}
                        </span>
                      )}

                      {/* Meal indicator */}
                      {isMeal && slot.mealType && (
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${getMealHeaderColor(
                            slot.mealType
                          )}`}
                        >
                          {slot.mealType}
                        </span>
                      )}

                      {isAdjusted && (
                        <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white shadow-sm flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          Plan B – Weather Adjusted
                        </span>
                      )}
                    </div>

                    {/* Name with Tamil Name */}
                    <div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">
                        {slot.title}
                      </h3>
                      {slot.nameTamil && (
                        <span className="text-xs font-serif text-amber-800 font-medium block mt-0.5">
                          {slot.nameTamil}
                        </span>
                      )}
                      {slot.locality && (
                        <span className="text-xs text-stone-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          <span>{slot.locality}, {slot.district || plannerInput.destinationDistrict}</span>
                        </span>
                      )}
                    </div>

                    {/* Why Now Explainability Block */}
                    <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80 text-xs text-stone-700 flex items-start gap-2.5">
                      <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-stone-900 font-bold">Why at this time? </strong>
                        <span>{slot.whyNowReason}</span>
                      </div>
                    </div>

                    {/* Tip / Notes */}
                    {slot.notes && (
                      <p className="text-xs text-stone-600 italic bg-amber-50/40 p-2.5 rounded-xl border border-amber-200/50">
                        <strong>Tip:</strong> {slot.notes}
                      </p>
                    )}

                    {/* Part 4 & 5: Meal Details & Expandable "More options nearby" */}
                    {isMeal && slot.alternativeRestaurants && slot.alternativeRestaurants.length > 0 && (
                      <div className="pt-2">
                        <button
                          onClick={() => toggleMealExpanded(index)}
                          aria-expanded={isMealExpanded}
                          className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg px-2 py-1 bg-amber-50 border border-amber-200"
                        >
                          <span>More options nearby ({slot.alternativeRestaurants.length})</span>
                          {isMealExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {isMealExpanded && (
                          <div className="mt-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block">
                              Alternative Nearby Dining Spots in {plannerInput.destinationDistrict}
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                              {slot.alternativeRestaurants.map((alt, altIdx) => {
                                const altMapsUrl = buildGoogleMapsUrl({
                                  name: alt.restaurant.name,
                                  locality: alt.restaurant.locality,
                                  district: alt.restaurant.district,
                                });
                                return (
                                  <div
                                    key={altIdx}
                                    className="p-3 bg-white rounded-xl border border-stone-200/90 space-y-1.5 shadow-sm"
                                  >
                                    <div className="flex items-start justify-between gap-2">
                                      <strong className="text-stone-900 font-bold block">
                                        {alt.restaurant.name}
                                      </strong>
                                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold shrink-0">
                                        {alt.distanceKm} km
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-stone-500">
                                      {alt.restaurant.cuisine} • {alt.restaurant.dietType}
                                    </p>
                                    {alt.restaurant.signatureDishes[0] && (
                                      <p className="text-[10px] text-stone-600 italic">
                                        Signature: {alt.restaurant.signatureDishes[0]}
                                      </p>
                                    )}
                                    <a
                                      href={altMapsUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 pt-1"
                                    >
                                      <span>View on Google Maps</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Part 4 & 5 Action Buttons: "View on Google Maps" and "View Place Info" */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        <span>View on Google Maps</span>
                        <ExternalLink className="w-3 h-3 text-stone-400" />
                      </a>

                      {slot.destinationId && (
                        <button
                          onClick={() => onViewDestinationDetail(slot.destinationId!)}
                          className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-amber-600 text-stone-100 text-xs font-bold transition-all shadow-sm"
                        >
                          View Place Info
                        </button>
                      )}
                    </div>

                    {/* Part 8.2 Safe Arrival Hours Caution (Post-19:00) */}
                    {isSafetyModeActive && isPost1900Arrival(slot.timeWindow) && (
                      <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300 text-amber-950 text-xs flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Safe Arrival Caution (Post-19:00): </strong>
                          <span>Evening arrival scheduled. Please prioritize verified prepaid autos, women's coaches in trains/metro, or brightly lit central thoroughfares.</span>
                        </div>
                      </div>
                    )}

                    {/* Part 8.2 Solo / Women Safety Mode Details */}
                    {isSafetyModeActive && (() => {
                      const currentDist = slot.district || plannerInput.destinationDistrict;
                      const districtSafety = getDistrictSafety(currentDist);
                      const checkInKey = `${slot.title}-${currentDist}`;
                      const isCheckedIn = !!checkedInIds[checkInKey];

                      return (
                        <div className="p-3.5 bg-rose-50/70 rounded-2xl border border-rose-200 text-xs space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold uppercase tracking-wider text-[10px] text-rose-900 flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-rose-700" />
                              Verified Safety & Emergency Infrastructure ({currentDist})
                            </span>
                            <span className="text-[10px] font-mono text-rose-700 font-bold">Helpline: 112 / 1091</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700">
                            <div>
                              <strong className="text-stone-900">AWPS: </strong>
                              <span>{districtSafety.allWomenPoliceStation}</span>
                            </div>
                            <div>
                              <strong className="text-stone-900">24/7 Hospital: </strong>
                              <span>{districtSafety.govtHospital24x7}</span>
                            </div>
                          </div>

                          <div className="text-[11px] text-stone-600">
                            <strong className="text-stone-800">Safe Transit Advice: </strong>
                            <span>{districtSafety.safeTransitNotes[0]}</span>
                          </div>

                          {/* Location share & Check-in done */}
                          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-rose-200/80">
                            <button
                              onClick={() => {
                                SafetyTrailService.shareLocation(
                                  slot.title,
                                  currentDist,
                                  slot.locality,
                                  slot.latitude,
                                  slot.longitude
                                );
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-[11px] flex items-center gap-1.5 transition-colors shadow-sm"
                              title="Share live location with emergency contact"
                            >
                              <Share2 className="w-3.5 h-3.5" />
                              <span>Share My Live Location</span>
                            </button>

                            <button
                              onClick={() => {
                                SafetyTrailService.logCheckIn(
                                  slot.title,
                                  currentDist,
                                  slot.locality,
                                  slot.latitude,
                                  slot.longitude
                                );
                                setCheckedInIds((prev) => ({ ...prev, [checkInKey]: true }));
                              }}
                              className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
                                isCheckedIn
                                  ? 'bg-emerald-600 text-white cursor-default'
                                  : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-300'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{isCheckedIn ? 'Check-in Done ✓' : 'Check-in Done'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Right: Badges & Cost */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0">
                    {/* Crowd badge (ONLY if data-backed) */}
                    {isDataBackedCrowd && slot.crowdLevel && (
                      <div className="text-right">
                        <div
                          className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${getCrowdBadgeStyle(
                            slot.crowdLevel
                          )}`}
                        >
                          Crowd: {slot.crowdLevel}
                        </div>
                        <div className="text-[9px] text-stone-400 font-mono mt-0.5">
                          {slot.crowdPredictionType}
                        </div>
                      </div>
                    )}

                    <div className="text-right">
                      <span className="text-xs font-bold text-stone-900">
                        {slot.estimatedCostINR > 0 ? `Est. ₹${slot.estimatedCostINR}` : 'Free Entry'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Between stops: Travel connector with buffer */}
              {index < activitiesToRender.length - 1 && (
                <div className="py-2.5 my-1 flex items-center gap-3">
                  <div className="w-3 h-0.5 bg-amber-400/80 rounded" />
                  <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    Travel about {slot.travelBufferMinutes || 15} min, +10 min buffer
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Local Leg Fare Estimator (Consecutive stop fare estimates) */}
      {(() => {
        const placesWithCoords = activitiesToRender.filter((a) => a.latitude && a.longitude);
        if (placesWithCoords.length < 2) return null;
        const p1 = placesWithCoords[0];
        const p2 = placesWithCoords[1];
        return (
          <ConsecutiveLegFareEstimator
            fromName={p1.title}
            toName={p2.title}
            fromLat={p1.latitude!}
            fromLng={p1.longitude!}
            toLat={p2.latitude!}
            toLng={p2.longitude!}
          />
        );
      })()}

      {/* Where to Stay Card (TTDC Stays and District Lodges) */}
      <WhereToStayCard
        district={plannerInput.destinationDistrict}
        travelerBudgetTier={plannerInput.budgetTier}
      />

      {/* Public Transport Guide (Bus & Train Schedules) */}
      <PublicTransportCard
        district={plannerInput.destinationDistrict}
      />

      {/* Part 11 Dynamic Budget Calculator Modal */}
      <BudgetCalculatorModal
        district={plannerInput.destinationDistrict}
        initialPartySize={plannerInput.numberOfTravelers}
        initialDays={plannerInput.numberOfDays}
        itineraryDays={itineraryDays}
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

    </div>
  );
};
