import React, { useState } from 'react';
import { DESTINATIONS_DATA } from '../data/destinations';
import { evaluateCrowd } from '../services/crowdEngine';
import {
  Activity,
  ShieldCheck,
  Info,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';

export const CrowdInsightsView: React.FC = () => {
  const [selectedDestId, setSelectedDestId] = useState<string>(DESTINATIONS_DATA[0].id);
  const [simulatedDayOffset, setSimulatedDayOffset] = useState<number>(0); // 0 today, 5 Saturday
  const [simulatedHour, setSimulatedHour] = useState<number>(7); // 7 AM vs 12 PM

  const currentDest =
    DESTINATIONS_DATA.find((d) => d.id === selectedDestId) || DESTINATIONS_DATA[0];

  // Calculate simulated date
  const simulatedDate = new Date();
  simulatedDate.setDate(simulatedDate.getDate() + simulatedDayOffset);
  const dateStr = simulatedDate.toISOString().split('T')[0];

  const crowdEval = evaluateCrowd(currentDest, dateStr, simulatedHour);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-fade-in">
      
      {/* Header Overview */}
      <div className="bg-stone-900 text-stone-100 rounded-3xl p-8 sm:p-12 border border-stone-800 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-amber-400" />
          <span>Evidence-Based Crowd Intelligence</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
          Accurate, Explainable Crowd Predictions
        </h2>

        <p className="text-sm sm:text-base text-stone-300 max-w-3xl leading-relaxed">
          TamizN Visa rejects randomly fabricated AI numbers and fake precision percentages (such as 73.42%). Instead, our model uses a strict hierarchical 3-level evaluation architecture with full explainability.
        </p>

        {/* 3 Level Hierarchy Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
              LEVEL 1: LIVE DATA
            </span>
            <h4 className="text-sm font-bold text-white mb-1">Direct Sensor / Feed</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              When authenticated live footfall or highway toll telemetry is active. Marked explicitly as <em>LIVE DATA</em>.
            </p>
          </div>

          <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
              LEVEL 2: HISTORICAL DATA
            </span>
            <h4 className="text-sm font-bold text-white mb-1">Verified Visitor Registries</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Analyzes verified darshan and museum historical footfall logs gathered over multi-year records.
            </p>
          </div>

          <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800">
            <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
              LEVEL 3: EVIDENCE-BASED
            </span>
            <h4 className="text-sm font-bold text-white mb-1">Pattern Estimation</h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Synthesizes day of week, hour of day, festival calendars, and school holiday periods into clean categories (LOW, MODERATE, HIGH, VERY HIGH).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Crowd Evaluation Sandbox */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl space-y-8">
        <div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Interactive Crowd Evaluator & Sandbox
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Test how time windows and day choices drastically alter expected crowds across Tamil Nadu sites.
          </p>
        </div>

        {/* Simulator Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 bg-stone-50 p-6 rounded-2xl border border-stone-200">
          
          {/* Destination Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Select Destination
            </label>
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {DESTINATIONS_DATA.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.district})
                </option>
              ))}
            </select>
          </div>

          {/* Day of Week */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Day Timing
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setSimulatedDayOffset(2)} // Tuesday
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  simulatedDayOffset === 2
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Weekday (Tue)
              </button>
              <button
                onClick={() => setSimulatedDayOffset(5)} // Saturday
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                  simulatedDayOffset === 5
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                Weekend (Sat)
              </button>
            </div>
          </div>

          {/* Time of Day */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              Hour of Day: {simulatedHour}:00 {simulatedHour < 12 ? 'AM' : 'PM'}
            </label>
            <input
              type="range"
              min="6"
              max="20"
              value={simulatedHour}
              onChange={(e) => setSimulatedHour(parseInt(e.target.value))}
              className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer mt-2"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-bold mt-1">
              <span>06:00 AM (Early)</span>
              <span>12:00 PM (Midday)</span>
              <span>08:00 PM (Night)</span>
            </div>
          </div>

        </div>

        {/* Prediction Results Display */}
        <div className="bg-stone-900 text-stone-100 rounded-3xl p-6 sm:p-8 space-y-6 border border-stone-800">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
            <div>
              <span className="text-[11px] font-mono text-amber-400 uppercase tracking-widest block">
                Calculated Evaluation
              </span>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {currentDest.name}
              </h4>
              <p className="text-xs text-stone-400">{currentDest.district} • {currentDest.category.toUpperCase()}</p>
            </div>

            <div className="text-left sm:text-right">
              <div className="inline-block px-4 py-1.5 rounded-xl text-base font-bold uppercase tracking-wider bg-amber-500 text-stone-950">
                {crowdEval.crowdLevel} CROWD
              </div>
              <div className="text-[10px] text-stone-400 font-mono mt-1">
                Prediction Status: <strong>{crowdEval.predictionType}</strong> (Confidence: {crowdEval.confidence})
              </div>
            </div>
          </div>

          {/* Logical Reason */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Evidence Explanation:
            </span>
            <p className="text-sm text-stone-200 leading-relaxed font-medium bg-stone-800/80 p-4 rounded-xl border border-stone-700">
              “{crowdEval.reason}”
            </p>
          </div>

          {/* Optimal Window Recommendation */}
          <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Optimal Visiting Window for this place: {crowdEval.optimalVisitWindow}</span>
          </div>

          {/* Factors Table */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Factors Influencing This Calculation:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {crowdEval.factorsUsed.map((factor, idx) => (
                <div
                  key={idx}
                  className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs flex items-start gap-2.5"
                >
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded shrink-0 ${
                      factor.impact === 'INCREASES'
                        ? 'bg-rose-900/60 text-rose-300 border border-rose-700'
                        : 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                    }`}
                  >
                    {factor.impact}
                  </span>
                  <div>
                    <span className="font-bold text-white block">{factor.name}</span>
                    <span className="text-stone-400 text-[11px] leading-tight">
                      {factor.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Model Reference: {crowdEval.source}</span>
          </div>

        </div>

      </div>

    </div>
  );
};
