import React, { useState, useEffect } from 'react';
import { Menu, X, Bookmark, Shield, Sparkles, Sun, Moon, Languages } from 'lucide-react';
import { EmeraldDoveRoundel } from './TamilBrandLogo';
import { Language } from '../services/languageService';

export type NavTab = 'home' | 'explore' | 'planner' | 'hidden-gems' | 'crowd' | 'food' | 'saved' | 'community';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAbout: () => void;
  savedTripsCount: number;
  onNavigateDestinations?: () => void;
  theme?: 'light' | 'pink' | 'dark';
  onThemeChange?: (theme: 'light' | 'pink' | 'dark') => void;
  isSafetyModeActive?: boolean;
  onToggleSafetyMode?: () => void;
  onOpenSafetyModal?: () => void;
  language?: Language;
  onToggleLanguage?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAbout,
  savedTripsCount,
  onNavigateDestinations,
  theme = 'light',
  onThemeChange,
  isSafetyModeActive = false,
  onToggleSafetyMode,
  onOpenSafetyModal,
  language = 'en',
  onToggleLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDestinationsClick = () => {
    if (onNavigateDestinations) {
      onNavigateDestinations();
    } else {
      onSelectTab('home');
      setTimeout(() => {
        const el = document.getElementById('destinations-section') || document.getElementById('discover-content');
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    {
      id: 'explore',
      label: language === 'ta' ? 'ஆராய்க' : 'Explore',
      onClick: () => {
        onSelectTab('explore');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'explore',
    },
    {
      id: 'destinations',
      label: language === 'ta' ? 'இடங்கள்' : 'Destinations',
      onClick: handleDestinationsClick,
      isActive: false,
    },
    {
      id: 'culture',
      label: language === 'ta' ? 'கலாச்சாரம்' : 'Culture',
      onClick: () => {
        onSelectTab('hidden-gems');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'hidden-gems',
    },
    {
      id: 'food',
      label: language === 'ta' ? 'உணவு' : 'Food',
      onClick: () => {
        onSelectTab('food');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'food',
    },
    {
      id: 'compare',
      label: language === 'ta' ? 'ஒப்பிடுக' : 'Compare',
      onClick: () => {
        window.location.hash = '#compare';
        setMobileMenuOpen(false);
      },
      isActive: false,
    },
    {
      id: 'plan',
      label: language === 'ta' ? 'திட்டம்' : 'Plan',
      onClick: () => {
        onSelectTab('planner');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'planner',
    },
    {
      id: 'community',
      label: language === 'ta' ? 'மகளிர் குழு' : 'Community',
      onClick: () => {
        onSelectTab('community');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'community',
    },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || currentTab !== 'home'
          ? 'bg-stone-950/85 backdrop-blur-md border-b border-stone-800/40 shadow-sm'
          : 'bg-gradient-to-b from-stone-950/70 via-stone-950/20 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          
          {/* Small Elegant TAMIZN VISA Logo / Wordmark */}
          <button
            onClick={() => {
              onSelectTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
            aria-label="TAMIZN VISA Home"
          >
            {/* Official Emerald Dove Roundel */}
            <EmeraldDoveRoundel sizeClassName="w-9 h-9" />

            <div className="flex flex-col">
              <span className="font-sans font-medium tracking-[0.22em] text-xs sm:text-sm text-stone-100 group-hover:text-amber-300 uppercase transition-colors">
                TAMIZN VISA
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400 font-mono">
                தமிழ்நாடு
              </span>
            </div>
          </button>

          {/* Desktop Minimal Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`text-xs uppercase tracking-[0.22em] font-sans transition-colors duration-200 py-1 relative cursor-pointer ${
                  item.isActive
                    ? 'text-stone-50 font-medium'
                    : 'text-stone-300/80 hover:text-stone-100 font-light'
                }`}
              >
                {item.label}
                {item.isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400/90" />
                )}
              </button>
            ))}
          </nav>

          {/* Right Secondary Actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Part 10 Language Toggle (EN <-> தமிழ்) */}
            {onToggleLanguage && (
              <button
                onClick={onToggleLanguage}
                className="px-2.5 py-1 rounded-full bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-stone-800 text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                title={language === 'ta' ? 'ஆங்கிலத்திற்கு மாற்றவும்' : 'Switch to Tamil'}
              >
                <Languages className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-sans">{language === 'ta' ? 'தமிழ்' : 'English'}</span>
              </button>
            )}

            {/* Part 8.1 Pink Mode & Theme Switcher */}
            {onThemeChange && (
              <div className="hidden lg:flex items-center bg-stone-900/80 p-0.5 rounded-full border border-stone-800 text-[10px] font-bold">
                <button
                  onClick={() => onThemeChange('light')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    theme === 'light'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Default Golden Heritage Theme"
                >
                  Light
                </button>
                <button
                  onClick={() => onThemeChange('pink')}
                  className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    theme === 'pink'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-rose-300 hover:text-rose-100'
                  }`}
                  title="Pink Mode: Soft natural palette for enhanced contrast & comfort"
                >
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Pink</span>
                </button>
                <button
                  onClick={() => onThemeChange('dark')}
                  className={`px-2 py-1 rounded-full transition-all ${
                    theme === 'dark'
                      ? 'bg-stone-700 text-white shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title="Dark Theme"
                >
                  Dark
                </button>
              </div>
            )}

            {/* Part 8.2 Solo / Women Safety Mode Toggle */}
            {onToggleSafetyMode && (
              <button
                onClick={onToggleSafetyMode}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isSafetyModeActive
                    ? 'bg-rose-700 text-white ring-2 ring-rose-400'
                    : 'bg-stone-900/80 text-rose-300 hover:bg-stone-800 border border-rose-900/60'
                }`}
                title="Toggle Solo & Women Travel Safety Mode"
              >
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden xl:inline">{isSafetyModeActive ? 'Safety ON' : 'Women Safety'}</span>
              </button>
            )}

            {/* Subtle Saved link */}
            <button
              onClick={() => onSelectTab('saved')}
              className={`hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-sans transition-colors cursor-pointer ${
                currentTab === 'saved'
                  ? 'text-stone-50'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Saved Trips"
            >
              <Bookmark className="w-3.5 h-3.5 text-stone-400" />
              <span>Saved</span>
              {savedTripsCount > 0 && (
                <span className="text-[10px] text-amber-300 font-mono">
                  ({savedTripsCount})
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-300 hover:text-stone-100 rounded-lg hover:bg-stone-900/60 transition-colors focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-stone-950/95 backdrop-blur-xl border-b border-stone-800/60 px-6 py-6 animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navLinks.map((item) => (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`text-left text-sm uppercase tracking-[0.25em] font-sans py-2 border-b border-stone-900 transition-colors ${
                  item.isActive
                    ? 'text-amber-300 font-medium'
                    : 'text-stone-300 hover:text-stone-100 font-light'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => {
                onSelectTab('saved');
                setMobileMenuOpen(false);
              }}
              className="text-left text-sm uppercase tracking-[0.25em] font-sans py-2 text-stone-400 hover:text-stone-200 font-light flex items-center justify-between"
            >
              <span>Saved Trips</span>
              {savedTripsCount > 0 && (
                <span className="text-xs text-amber-300 font-mono">
                  {savedTripsCount}
                </span>
              )}
            </button>

            {/* Language & Theme in mobile drawer */}
            <div className="pt-2 border-t border-stone-900 space-y-3">
              {onToggleLanguage && (
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span>Language / மொழி:</span>
                  <button
                    onClick={() => {
                      onToggleLanguage();
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-1 rounded-lg bg-stone-900 text-amber-300 font-bold text-xs border border-stone-800 flex items-center gap-1.5"
                  >
                    <Languages className="w-3.5 h-3.5" />
                    <span>{language === 'ta' ? 'தமிழ்' : 'English'}</span>
                  </button>
                </div>
              )}
              {onThemeChange && (
                <div className="flex items-center justify-between text-xs text-stone-300">
                  <span>Theme:</span>
                  <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-xl">
                    <button
                      onClick={() => onThemeChange('light')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        theme === 'light' ? 'bg-amber-600 text-white' : 'text-stone-400'
                      }`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => onThemeChange('pink')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        theme === 'pink' ? 'bg-rose-600 text-white' : 'text-rose-300'
                      }`}
                    >
                      Pink
                    </button>
                    <button
                      onClick={() => onThemeChange('dark')}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                        theme === 'dark' ? 'bg-stone-700 text-white' : 'text-stone-400'
                      }`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              )}
              {onToggleSafetyMode && (
                <button
                  onClick={() => {
                    onToggleSafetyMode();
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-between ${
                    isSafetyModeActive
                      ? 'bg-rose-700 text-white'
                      : 'bg-stone-900 text-rose-300 border border-rose-900/60'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-rose-400" />
                    <span>Solo / Women Safety Mode</span>
                  </span>
                  <span>{isSafetyModeActive ? 'ON' : 'OFF'}</span>
                </button>
              )}
            </div>

            <button
              onClick={() => {
                onOpenAbout();
                setMobileMenuOpen(false);
              }}
              className="text-left text-xs uppercase tracking-[0.2em] font-sans pt-2 text-stone-500 hover:text-stone-300"
            >
              About TamizN Visa
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
