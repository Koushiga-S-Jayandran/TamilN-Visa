import React from 'react';
import { APP_CONFIG } from '../config/appConfig';
import {
  X,
  Award,
  ShieldCheck,
  Target,
  Sparkles,
  MapPin,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-stone-900 text-stone-100 p-6 flex items-center justify-between shrink-0 border-b border-stone-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center text-white font-serif font-black text-xs">
                TV
              </div>
              <span className="font-serif font-bold text-lg text-white">
                About {APP_CONFIG.brandName}
              </span>
            </div>
            <p className="text-xs text-amber-400 font-serif italic">
              “{APP_CONFIG.tagline}”
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1 text-xs text-stone-700 leading-relaxed">
          
          {/* Creator & Institutional Profile */}
          <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200/90 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-900 block flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              Creator & Institutional Identification
            </span>
            <div className="text-sm font-bold text-stone-900">
              Made by: <span className="text-amber-800">{APP_CONFIG.creator.name}</span>
            </div>
            <div className="text-xs font-semibold text-stone-800">
              {APP_CONFIG.creator.institution}
            </div>
            <div className="text-xs text-stone-600 flex items-center gap-1.5 pt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{APP_CONFIG.creator.location}, {APP_CONFIG.creator.state}</span>
            </div>
            <div className="text-[11px] text-stone-500 pt-2 border-t border-amber-200/60">
              Prepared for State Tourism, Hackathon & Startup Demonstrations.
            </div>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-600" />
              Problem Statement
            </h3>
            <p className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-stone-700 leading-relaxed italic">
              “{APP_CONFIG.problemStatement}”
            </p>
          </div>

          {/* Core Objectives */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Project Objectives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {APP_CONFIG.objectives.map((obj, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-stone-700 font-medium">{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Innovation & Practical Impact */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-purple-600" />
              Core Innovation & Differentiation
            </h3>
            <p className="text-stone-600">
              Unlike generic static directories or AI wrappers that output fake percentages, TamizN Visa provides an integrated decision engine combining:
            </p>
            <div className="p-4 bg-stone-900 text-stone-100 rounded-2xl font-mono text-[11px] space-y-1">
              <div>DESTINATION DISCOVERY across ALL 38 TAMIL NADU DISTRICTS</div>
              <div>+ EVIDENCE-BASED CROWD INTELLIGENCE (Strict 3-Level Model)</div>
              <div>+ REALISTIC 06:00 AM – 09:00 PM TIME BUFFER PLANNING</div>
              <div>+ VERIFIED HIDDEN GEMS TO DE-CONGEST MAINSTREAM HUBS</div>
              <div>+ AUTHENTIC TRADITIONAL FOOD & LOCAL TRANSIT</div>
              <div>+ PERSISTENT OFFLINE ACCESS & PRINTABLE DOSSIERS</div>
            </div>
          </div>

          {/* Strict Truth & Data Integrity */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-bold tracking-wider text-stone-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Data Sources & Truth Policy
            </h3>
            <p className="text-stone-600">
              Every destination, timing guideline, and entry cost is verified against official departments:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pl-1">
              <li>Tamil Nadu Tourism Development Corporation (TTDC)</li>
              <li>Archaeological Survey of India (ASI) Chennai Circle</li>
              <li>Hindu Religious & Charitable Endowments (HR&CE) Department</li>
              <li>Tamil Nadu Forest Department & Eco-Tourism Board</li>
              <li>District Police & Municipal Administrations</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
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
