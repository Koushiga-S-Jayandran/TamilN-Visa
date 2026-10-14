import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Users,
  Calendar,
  Layers,
  Copy,
  Check,
  Download,
  X,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import {
  calculateDetailedBudget,
  formatBudgetSummaryText,
  DetailedBudgetSummary,
} from '../services/budgetCalculator';
import { ItineraryDay } from '../types';

interface BudgetCalculatorModalProps {
  district: string;
  initialPartySize?: number;
  initialDays?: number;
  itineraryDays?: ItineraryDay[];
  isOpen: boolean;
  onClose: () => void;
}

export const BudgetCalculatorModal: React.FC<BudgetCalculatorModalProps> = ({
  district,
  initialPartySize = 2,
  initialDays = 2,
  itineraryDays,
  isOpen,
  onClose,
}) => {
  const [partySize, setPartySize] = useState<number>(initialPartySize);
  const [numberOfDays, setNumberOfDays] = useState<number>(initialDays);
  const [travelStyle, setTravelStyle] = useState<'Budget' | 'Mid-range' | 'Comfort'>('Mid-range');
  const [copied, setCopied] = useState(false);

  const budgetSummary: DetailedBudgetSummary = useMemo(() => {
    return calculateDetailedBudget(
      district,
      numberOfDays,
      partySize,
      travelStyle,
      itineraryDays
    );
  }, [district, numberOfDays, partySize, travelStyle, itineraryDays]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const text = formatBudgetSummaryText(budgetSummary);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const text = formatBudgetSummaryText(budgetSummary);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tamizn-visa-${district.toLowerCase()}-budget.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const categoryList = [
    budgetSummary.categories.accommodation,
    budgetSummary.categories.food,
    budgetSummary.categories.sightseeing,
    budgetSummary.categories.localTransit,
    budgetSummary.categories.interDistrictTransit,
    budgetSummary.categories.emergencyBuffer,
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600 flex items-center justify-center text-white shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                PART 11: TRANSPARENT COST ESTIMATOR
              </div>
              <h2 className="text-xl font-serif font-bold text-white">
                Live Trip Budget Calculator ({district})
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-xl hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Controls Bar */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          
          {/* Party Size */}
          <div>
            <label className="font-bold text-stone-700 block mb-1 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-amber-600" />
              Party Size ({partySize} Travelers)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={partySize}
              onChange={(e) => setPartySize(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="font-bold text-stone-700 block mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Duration ({numberOfDays} Days)
            </label>
            <input
              type="range"
              min="1"
              max="7"
              value={numberOfDays}
              onChange={(e) => setNumberOfDays(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          {/* Travel Style */}
          <div>
            <label className="font-bold text-stone-700 block mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Travel Style Tier
            </label>
            <div className="grid grid-cols-3 gap-1 bg-white p-0.5 rounded-xl border border-stone-200">
              {(['Budget', 'Mid-range', 'Comfort'] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => setTravelStyle(style)}
                  className={`py-1 rounded-lg text-[10px] font-bold transition-all ${
                    travelStyle === style
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Body: Grand Totals & Category Breakdown */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-stone-700">
          
          {/* Total Highlight Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 block">
                Total Estimated Trip Cost ({partySize} Travelers)
              </span>
              <div className="text-2xl sm:text-3xl font-serif font-black mt-0.5">
                ₹{budgetSummary.totalTripINR.toLocaleString()}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 block">
                Per-Person Average
              </span>
              <div className="text-xl sm:text-2xl font-serif font-bold mt-0.5">
                ₹{budgetSummary.perPersonTotalINR.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Category Cards */}
          <div className="space-y-2.5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center justify-between">
              <span>Itemized Expenses Breakdown</span>
              <span className="text-[10px] font-normal text-stone-500">
                12% emergency buffer included
              </span>
            </h3>

            <div className="space-y-2">
              {categoryList.map((cat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900 font-bold">{cat.name}</strong>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                          cat.isVerified
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {cat.isVerified ? 'Verified Data' : 'Planning Assumption'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">{cat.notes}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="font-serif font-bold text-stone-900 text-sm">
                      ₹{cat.amountINR.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-stone-500 font-mono">
                      ₹{cat.perPersonINR.toLocaleString()} / person
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-stone-600 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Fabrication:</strong> Ticket prices reflect verified temple and monument rates; food rates reflect authentic restaurant menus in {district}. Unverified transit rates follow standard Tamil Nadu planning assumptions.
            </span>
          </div>

        </div>

        {/* Footer Actions: Copy & Download */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-600" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-stone-600" />
              <span>Download (.txt)</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
