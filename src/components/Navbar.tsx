import React, { useState, useEffect } from 'react';
import { Menu, X, Bookmark } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'planner' | 'hidden-gems' | 'crowd' | 'food' | 'saved';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenAbout: () => void;
  savedTripsCount: number;
  onNavigateDestinations?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAbout,
  savedTripsCount,
  onNavigateDestinations,
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
      label: 'Explore',
      onClick: () => {
        onSelectTab('explore');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'explore',
    },
    {
      id: 'destinations',
      label: 'Destinations',
      onClick: handleDestinationsClick,
      isActive: false,
    },
    {
      id: 'culture',
      label: 'Culture',
      onClick: () => {
        onSelectTab('hidden-gems');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'hidden-gems',
    },
    {
      id: 'food',
      label: 'Food',
      onClick: () => {
        onSelectTab('food');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'food',
    },
    {
      id: 'plan',
      label: 'Plan',
      onClick: () => {
        onSelectTab('planner');
        setMobileMenuOpen(false);
      },
      isActive: currentTab === 'planner',
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
            {/* Minimal architectural emblem mark */}
            <div className="w-8 h-8 rounded-lg bg-stone-900/80 border border-stone-700/60 group-hover:border-amber-400/70 flex items-center justify-center transition-colors">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-amber-300/90 group-hover:text-amber-200 transition-colors"
              >
                {/* Minimal Gopuram tier lines */}
                <path d="M12 2L14 6H10L12 2Z" fill="currentColor" opacity="0.9" />
                <path d="M9 7H15L16 11H8L9 7Z" fill="currentColor" opacity="0.75" />
                <path d="M7 12H17L18.5 17H5.5L7 12Z" fill="currentColor" opacity="0.65" />
                <rect x="4" y="18" width="16" height="2" rx="0.5" fill="currentColor" opacity="0.9" />
                <path d="M10 20V22H14V20" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>

            <div className="flex flex-col">
              <span className="font-sans font-light tracking-[0.28em] text-xs sm:text-sm text-stone-100 group-hover:text-white uppercase transition-colors">
                TAMIZN VISA
              </span>
              <span className="text-[9px] tracking-[0.3em] uppercase text-stone-400/80 font-mono">
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

          {/* Right Secondary Actions: Saved & Mobile Hamburger */}
          <div className="flex items-center gap-4">
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
