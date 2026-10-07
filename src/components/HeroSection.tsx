import React, { useState, useEffect } from 'react';

interface HeroSectionProps {
  onDiscover: () => void;
}

/**
 * Authentic Tamil Nadu realistic visual sequence:
 * 1. Temple Gopuram (Brihadisvara Temple, Thanjavur at golden sunrise)
 * 2. Tamil Nadu Coastline (Mahabalipuram Shore Temple against Bay of Bengal)
 * 3. Lush Western Ghats (Misty tea hills of Nilgiris / Valparai)
 * 4. Traditional Dravidian Stone Architecture (Heritage stone mandapam)
 * 5. Cultural Heritage (Sacred temple corridors & towers)
 */
const TAMIL_NADU_VISUALS = [
  {
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2560&q=85',
    title: 'Thanjavur Brihadisvara Temple Gopuram',
  },
  {
    url: 'https://images.unsplash.com/photo-1621682372775-533449e550ed?auto=format&fit=crop&w=2560&q=85',
    title: 'Mahabalipuram Shore Temple Coastline',
  },
  {
    url: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=2560&q=85',
    title: 'Western Ghats Nilgiris Hills',
  },
  {
    url: 'https://images.unsplash.com/photo-1600100397608-f010f443834e?auto=format&fit=crop&w=2560&q=85',
    title: 'Dravidian Heritage Stone Mandapam',
  },
  {
    url: 'https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=2560&q=85',
    title: 'Sacred Temple Corridors',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onDiscover }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Cinematic page load reveal
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Visual sequence cycle: slow, graceful transitions between realistic Tamil Nadu visuals
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % TAMIL_NADU_VISUALS.length);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[640px] flex items-center justify-center overflow-hidden bg-stone-950 text-white select-none">
      
      {/* ==================================================== */}
      {/* 1. CINEMATIC FULL-SCREEN TAMIL NADU BACKGROUND       */}
      {/* ==================================================== */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {TAMIL_NADU_VISUALS.map((visual, index) => {
          const isActive = index === currentImageIndex;
          return (
            <div
              key={visual.url}
              className={`absolute inset-0 transition-opacity duration-[2200ms] ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <div
                className={`w-full h-full bg-cover bg-center filter contrast-105 saturate-[0.88] transition-transform duration-[12000ms] ease-out ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
                style={{
                  backgroundImage: `url("${visual.url}")`,
                }}
              />
            </div>
          );
        })}

        {/* Restrained Luxury Vignette Overlays: Deep Charcoal / Black + Subtle Warmth */}
        <div className="absolute inset-0 z-20 bg-stone-950/45" />
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/60" />
        <div className="absolute inset-0 z-20 bg-[radial-gradient(ellipse_at_center,_transparent_30%,_rgba(12,10,9,0.7)_100%)]" />
      </div>

      {/* ==================================================== */}
      {/* 2. RESTRAINED CENTER CONTENT (ONLY 4 ELEMENTS)       */}
      {/* ==================================================== */}
      <div className="relative z-30 max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
        
        {/* 1. TAMIZN VISA Wordmark */}
        <div
          className={`transition-all duration-1000 ease-out delay-200 transform ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <span className="text-[11px] sm:text-xs font-sans tracking-[0.4em] uppercase text-stone-300/85 font-normal block mb-4 sm:mb-6">
            TAMIZN VISA
          </span>
        </div>

        {/* 2. Explore Tamil Nadu (Main visual focus on ONE line, sophisticated serif) */}
        <h1
          className={`text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-serif font-normal text-stone-100 tracking-tight leading-none text-center drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] mb-3 sm:mb-4 whitespace-nowrap transition-all duration-1000 ease-out delay-500 transform ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Explore Tamil Nadu
        </h1>

        {/* 3. Beyond the Usual (Slightly smaller, elegant, visually secondary) */}
        <p
          className={`text-lg sm:text-2xl md:text-3xl font-serif italic text-stone-300/80 font-normal tracking-wide text-center drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)] mb-10 sm:mb-14 transition-all duration-1000 ease-out delay-700 transform ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          Beyond the Usual
        </p>

        {/* 4. ONE BUTTON: DISCOVER TAMIL NADU */}
        <div
          className={`transition-all duration-1000 ease-out delay-1000 transform ${
            loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <button
            onClick={onDiscover}
            className="group inline-flex items-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full border border-stone-300/35 hover:border-amber-300/80 bg-stone-950/40 hover:bg-stone-900/80 text-stone-100 hover:text-amber-200 text-xs sm:text-sm font-sans font-medium tracking-[0.25em] uppercase backdrop-blur-md transition-all duration-300 shadow-2xl hover:shadow-amber-950/40 active:scale-98 cursor-pointer"
          >
            <span>DISCOVER TAMIL NADU</span>
            <span className="transform group-hover:translate-x-1.5 transition-transform duration-300 text-amber-300/90 font-light">
              →
            </span>
          </button>
        </div>

      </div>

      {/* Subtle indicator hint at very bottom */}
      <div
        onClick={onDiscover}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-30 cursor-pointer text-stone-400 hover:text-stone-200 transition-all duration-1000 delay-1200 ${
          loaded ? 'opacity-60 hover:opacity-100' : 'opacity-0'
        }`}
        aria-label="Scroll to discover content"
      >
        <div className="w-5 h-8 rounded-full border border-stone-400/40 flex items-start justify-center p-1.5">
          <div className="w-1 h-1.5 rounded-full bg-stone-300 animate-bounce" />
        </div>
      </div>

    </section>
  );
};
