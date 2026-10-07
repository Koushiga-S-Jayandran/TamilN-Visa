import React from 'react';
import { Compass, Sparkles, MapPin, Award, ShieldCheck, Heart } from 'lucide-react';
import { APP_CONFIG } from '../config/appConfig';
import { NavTab } from './Navbar';
import { TamilBrandLogo } from './TamilBrandLogo';
import { KolamDivider } from './KolamAccents';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAbout }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-amber-900/40 pt-16 pb-12 mt-20 relative overflow-hidden">
      {/* Decorative top border */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-amber-800 via-amber-400 to-amber-800" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Identity & Vision */}
          <div className="space-y-4">
            <TamilBrandLogo size="md" showText={true} />
            <p className="text-xs text-amber-300 font-serif italic pt-1">
              “{APP_CONFIG.tagline}”
            </p>
            <p className="text-xs text-amber-500/90 font-medium">
              “{APP_CONFIG.secondaryTagline}”
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              {APP_CONFIG.vision}
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-bold mb-4 flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('explore')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Explore Tamil Nadu (All 38 Districts)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('planner')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Plan My Trip (Multi-Step Engine)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('hidden-gems')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Hidden Gems & Less-Crowded Trails
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('crowd')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Crowd Insights & Explainability
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('food')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Traditional Food & Dining
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('saved')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Saved Trips & Offline Dossiers
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-amber-300 transition-colors"
                >
                  About TamizN Visa & Data Sources
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic & Creator Profile */}
          <div className="bg-stone-900/80 p-5 rounded-2xl border border-amber-900/40 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-amber-400 font-bold flex items-center gap-2">
              <Award className="w-3.5 h-3.5" />
              Creator & Institution
            </h4>
            <div className="text-xs space-y-1.5 text-stone-300">
              <p className="font-semibold text-stone-100">
                Made by: <span className="text-amber-300">{APP_CONFIG.creator.name}</span>
              </p>
              <p className="text-stone-300 font-medium">
                {APP_CONFIG.creator.institution}
              </p>
              <p className="text-stone-400 flex items-center gap-1.5 pt-1">
                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                <span>{APP_CONFIG.creator.location}</span>
              </p>
            </div>
            <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
              Prepared for State Tourism Competitions & Innovation Presentations
            </div>
          </div>

          {/* Col 4: Trust & Data Integrity */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-stone-100 font-bold flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Truth & Zero-Fabrication
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Every heritage site, temple opening hour, and dress rule is validated against official Tamil Nadu Government, TTDC, and ASI records.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/50 text-[11px] text-emerald-300">
              <span>Evidence-Backed Crowd Scoring</span>
            </div>
          </div>

        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © {new Date().getFullYear()} {APP_CONFIG.brandName}. Designed & Developed by {APP_CONFIG.creator.name}.
          </div>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Rooted in Tamil Heritage, Culture & Technology</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500 ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
