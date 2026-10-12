import React, { useEffect, useState } from 'react';
import {
  fetchDistrictWeather,
  DistrictWeatherReport,
  DayWeatherForecast,
  getSavedWeatherSnapshot,
} from '../services/weatherService';
import {
  CloudSun,
  Sun,
  CloudRain,
  CloudLightning,
  Wind,
  AlertTriangle,
  Info,
  CheckCircle2,
  Calendar,
  Clock,
  Compass,
} from 'lucide-react';

interface WeatherForecastWidgetProps {
  district: string;
  latitude: number;
  longitude: number;
  travelDate?: string;
  isOfflineDossier?: boolean;
}

export const WeatherForecastWidget: React.FC<WeatherForecastWidgetProps> = ({
  district,
  latitude,
  longitude,
  travelDate,
  isOfflineDossier = false,
}) => {
  const [report, setReport] = useState<DistrictWeatherReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDayIdx, setSelectedDayIdx] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    async function loadWeather() {
      setLoading(true);
      if (isOfflineDossier) {
        const saved = getSavedWeatherSnapshot(district);
        if (saved) {
          setReport(saved);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetchDistrictWeather(district, latitude, longitude, travelDate);
        if (isMounted) {
          setReport(res);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          const fallback = getSavedWeatherSnapshot(district);
          setReport(fallback);
          setLoading(false);
        }
      }
    }

    loadWeather();
    return () => {
      isMounted = false;
    };
  }, [district, latitude, longitude, travelDate, isOfflineDossier]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm animate-pulse space-y-4">
        <div className="h-5 w-48 bg-stone-200 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-24 bg-stone-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!report || report.dailyForecasts.length === 0) {
    return (
      <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-950 font-bold mb-1">
            Weather Forecast Note for {district}
          </strong>
          Live forecast currently unavailable. Showing standard historical tropical climate: 28°C – 34°C with pleasant morning conditions.
        </div>
      </div>
    );
  }

  const activeDay = report.dailyForecasts[selectedDayIdx] || report.dailyForecasts[0];

  const getWeatherIcon = (iconType: DayWeatherForecast['weatherIcon']) => {
    switch (iconType) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'partly-cloudy':
        return <CloudSun className="w-5 h-5 text-amber-600" />;
      case 'rainy':
        return <CloudRain className="w-5 h-5 text-sky-600" />;
      case 'stormy':
        return <CloudLightning className="w-5 h-5 text-purple-600" />;
      case 'windy':
        return <Wind className="w-5 h-5 text-teal-600" />;
      default:
        return <Sun className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200">
              {report.isLiveForecast ? 'Live 7-Day Forecast' : 'Typical Seasonal Climate'}
            </span>
            <span className="text-xs text-stone-500 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              Forecast as of: {report.formattedTimestamp}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mt-1 flex items-center gap-2">
            Weather & Atmospheric Planning in {district}
          </h3>
        </div>

        <div className="text-[11px] text-stone-500 font-mono bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 self-start sm:self-auto">
          {report.attribution}
        </div>
      </div>

      {report.notes && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600 flex items-center gap-2">
          <Info className="w-4 h-4 text-stone-500 shrink-0" />
          <span>{report.notes}</span>
        </div>
      )}

      {/* 7-Day Forecast Carousel / Grid */}
      <div className="space-y-2">
        <label className="text-xs uppercase tracking-widest font-bold text-stone-400">
          7-Day Temperature & Rain Forecast (Click to view advisories)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {report.dailyForecasts.map((day, idx) => {
            const isSelected = idx === selectedDayIdx;
            const dateObj = new Date(day.date);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <button
                key={day.date}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">{dayName}</span>
                  {getWeatherIcon(day.weatherIcon)}
                </div>
                <div className="text-[11px] text-stone-500 mb-2">{monthDay}</div>

                <div className="mt-1">
                  <div className="text-sm font-bold text-stone-900 font-mono">
                    {day.tempMaxC}° <span className="text-xs font-normal text-stone-500">/ {day.tempMinC}°C</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-sky-700 font-semibold mt-1">
                    <span className="flex items-center gap-0.5">
                      <CloudRain className="w-3 h-3" />
                      {day.rainProbabilityPercent}%
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {day.windSpeedKmh}km/h
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Detail & Weather Advisory Rules */}
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/80 pb-3">
          <div>
            <span className="text-xs font-bold text-stone-900 block">
              Day Conditions for {new Date(activeDay.date).toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <span className="text-xs text-stone-600 font-serif italic">
              {activeDay.weatherDescription}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-stone-700">High: <strong>{activeDay.tempMaxC}°C</strong></span>
            <span className="text-stone-700">Low: <strong>{activeDay.tempMinC}°C</strong></span>
            <span className="text-sky-700 font-bold">Rain: {activeDay.rainProbabilityPercent}%</span>
            <span className="text-stone-600">Wind: {activeDay.windSpeedKmh} km/h</span>
          </div>
        </div>

        {/* Advisory Rules with "Why at this time?" explainability */}
        <div className="space-y-2.5">
          <label className="text-[11px] uppercase tracking-widest font-bold text-stone-500 block">
            Trip Scheduling & Safety Rules
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeDay.advisories.map((adv, aIdx) => (
              <div
                key={aIdx}
                className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  adv.severity === 'WARNING'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : adv.severity === 'NOTICE'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  {adv.severity === 'WARNING' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : adv.severity === 'NOTICE' ? (
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  )}
                  <span>{adv.ruleTitle}</span>
                </div>
                <p className="font-medium leading-relaxed">
                  {adv.recommendation}
                </p>
                <div className="pt-1.5 border-t border-black/5 text-[11px] opacity-90 italic">
                  <strong>Why at this time?</strong> {adv.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
