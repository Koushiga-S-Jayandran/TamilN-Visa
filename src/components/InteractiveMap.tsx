import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Destination, FoodPlace } from '../types';
import { Layers, MapPin, Eye, Sparkles } from 'lucide-react';

interface InteractiveMapProps {
  destinations: Destination[];
  foodPlaces?: FoodPlace[];
  onSelectDestination: (dest: Destination) => void;
  selectedDestinationId?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  destinations,
  foodPlaces = [],
  onSelectDestination,
  selectedDestinationId,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [filterLayer, setFilterLayer] = useState<'all' | 'temples' | 'heritage' | 'nature' | 'hidden_gems' | 'food'>('all');

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean up any stale leaflet ID if hot-reloaded
    if ((mapContainerRef.current as any)._leaflet_id && !mapInstanceRef.current) {
      (mapContainerRef.current as any)._leaflet_id = null;
    }

    // Initialize Leaflet map centered on Tamil Nadu
    if (!mapInstanceRef.current && mapContainerRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [10.8505, 78.7047], // Central Tamil Nadu (Tiruchirappalli)
          zoom: 7,
          minZoom: 6,
          maxZoom: 16,
          scrollWheelZoom: true,
        });

        // CartoDB Positron clean map tiles for professional look
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        mapInstanceRef.current = map;
        markersLayerRef.current = L.layerGroup().addTo(map);
      } catch (err) {
        console.warn('Map initialization notice:', err);
      }
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch {
          // ignore
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when destinations, food places or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // 1. Destination markers
    destinations.forEach((dest) => {
      if (
        filterLayer !== 'all' &&
        filterLayer !== 'food' &&
        (filterLayer === 'hidden_gems' ? !dest.isHiddenGem : dest.category !== filterLayer)
      ) {
        return;
      }

      if (filterLayer === 'food') return;

      const isHidden = dest.isHiddenGem;
      const markerBg = isHidden ? '#7c3aed' : dest.category === 'temples' ? '#d97706' : '#059669';

      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="background-color: ${markerBg}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer; transition: transform 0.2s;">
            <span style="font-size: 11px; font-weight: bold;">${dest.category === 'temples' ? '🛕' : isHidden ? '✨' : '📍'}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([dest.coordinates.lat, dest.coordinates.lng], { icon: customIcon });

      const popupContent = `
        <div style="min-width: 220px; font-family: inherit; padding: 2px;">
          <img src="${dest.imageUrl}" alt="${dest.name}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px; color: #1c1917;">${dest.name}</div>
          <div style="font-size: 11px; color: #78716c; margin-bottom: 6px;">${dest.district} • ${dest.category.toUpperCase()}</div>
          <p style="font-size: 12px; color: #44403c; line-height: 1.3; margin-bottom: 8px;">${dest.description.slice(0, 110)}...</p>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f5f5f4; padding-top: 6px;">
            <span style="font-size: 11px; font-weight: 600; color: #b45309;">${dest.estimatedCostINR.isFree ? 'Free Entry' : 'From ₹' + dest.estimatedCostINR.min}</span>
            <button id="view-btn-${dest.id}" style="background-color: #d97706; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">Details</button>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('popupopen', () => {
        const btn = document.getElementById(`view-btn-${dest.id}`);
        if (btn) {
          btn.onclick = () => onSelectDestination(dest);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // 2. Food Place markers
    if (filterLayer === 'all' || filterLayer === 'food') {
      foodPlaces.forEach((food) => {
        // Approximate location offset near district center if direct coords not stored
        const baseDest = destinations.find((d) => d.district.toLowerCase() === food.district.toLowerCase());
        const lat = baseDest ? baseDest.coordinates.lat + 0.015 : 10.8;
        const lng = baseDest ? baseDest.coordinates.lng + 0.015 : 78.7;

        const foodIcon = L.divIcon({
          className: 'custom-food-pin',
          html: `
            <div style="background-color: #ea580c; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid white; cursor: pointer;">
              <span style="font-size: 11px;">🍲</span>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const foodMarker = L.marker([lat, lng], { icon: foodIcon });
        foodMarker.bindPopup(`
          <div style="min-width: 190px; font-family: inherit;">
            <div style="font-weight: 700; font-size: 13px; color: #1c1917;">${food.name}</div>
            <div style="font-size: 11px; color: #ea580c; font-weight: 600; margin-bottom: 4px;">${food.cuisine}</div>
            <div style="font-size: 11px; color: #57534e; margin-bottom: 4px;">${food.address}</div>
            <div style="font-size: 11px; font-weight: 600; color: #166534;">Avg ₹${food.avgCostPerPersonINR}/person • ${food.isVegetarianOnly ? 'Pure Veg' : 'Non-Veg'}</div>
          </div>
        `);
        markersLayerRef.current?.addLayer(foodMarker);
      });
    }
  }, [destinations, foodPlaces, filterLayer, onSelectDestination]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-stone-200 shadow-md bg-stone-100">
      {/* Map Control Bar */}
      <div className="absolute top-4 left-4 z-[1000] bg-stone-900/90 backdrop-blur-md p-1.5 rounded-xl border border-stone-800 shadow-lg flex flex-wrap gap-1">
        <button
          onClick={() => setFilterLayer('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
            filterLayer === 'all'
              ? 'bg-amber-600 text-white'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All</span>
        </button>
        <button
          onClick={() => setFilterLayer('temples')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLayer === 'temples'
              ? 'bg-amber-600 text-white'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          Temples
        </button>
        <button
          onClick={() => setFilterLayer('heritage')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLayer === 'heritage'
              ? 'bg-amber-600 text-white'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          Heritage
        </button>
        <button
          onClick={() => setFilterLayer('nature')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLayer === 'nature'
              ? 'bg-amber-600 text-white'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          Nature & Hills
        </button>
        <button
          onClick={() => setFilterLayer('hidden_gems')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
            filterLayer === 'hidden_gems'
              ? 'bg-purple-600 text-white'
              : 'text-purple-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Hidden Gems</span>
        </button>
        <button
          onClick={() => setFilterLayer('food')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            filterLayer === 'food'
              ? 'bg-orange-600 text-white'
              : 'text-stone-300 hover:text-white hover:bg-stone-800'
          }`}
        >
          Food Spots
        </button>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[460px] sm:h-[540px] z-0" />

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-xl border border-stone-200 shadow-md text-[11px] text-stone-700 space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          <span>Heritage & Temples</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>Nature & Waterfalls</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-600 inline-block" />
          <span>Verified Hidden Gems</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-600 inline-block" />
          <span>Authentic Regional Food</span>
        </div>
      </div>
    </div>
  );
};
