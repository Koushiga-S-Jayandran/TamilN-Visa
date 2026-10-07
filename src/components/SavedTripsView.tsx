import React, { useState } from 'react';
import { SavedTrip } from '../types';
import { StorageService } from '../services/storageService';
import {
  Bookmark,
  Calendar,
  MapPin,
  Clock,
  Trash2,
  Copy,
  Download,
  Eye,
  Edit2,
  Check,
  X,
  Printer,
  Sparkles,
} from 'lucide-react';

interface SavedTripsViewProps {
  onOpenTrip: (trip: SavedTrip) => void;
  onOpenOfflineDossier: (trip: SavedTrip) => void;
  onStartNewTrip: () => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  onOpenTrip,
  onOpenOfflineDossier,
  onStartNewTrip,
}) => {
  const [trips, setTrips] = useState<SavedTrip[]>(StorageService.getSavedTrips());
  const [editingTripId, setEditingTripId] = useState<string | null>(null);
  const [renameText, setRenameText] = useState<string>('');

  const refreshTrips = () => {
    setTrips(StorageService.getSavedTrips());
  };

  const handleDelete = (id: string) => {
    StorageService.deleteTrip(id);
    refreshTrips();
  };

  const handleDuplicate = (id: string) => {
    StorageService.duplicateTrip(id);
    refreshTrips();
  };

  const handleStartRename = (trip: SavedTrip) => {
    setEditingTripId(trip.id);
    setRenameText(trip.name);
  };

  const handleSaveRename = (id: string) => {
    if (renameText.trim()) {
      StorageService.updateTrip(id, { name: renameText.trim() });
      setEditingTripId(null);
      refreshTrips();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-amber-600 block">
            OFFLINE PERSISTENCE
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
            Saved Trips & Offline Journeys
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Access your custom itineraries, timing schedules, and emergency notes even with zero mobile connectivity.
          </p>
        </div>

        <button
          onClick={onStartNewTrip}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center gap-2 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Trips List or Empty State */}
      {trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-stone-200 shadow-sm max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
            <Bookmark className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-stone-900">
              Your journeys will appear here.
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
              Use the Multi-Step Trip Planner to generate an evidence-optimized itinerary for any Tamil Nadu district, then click Save Trip for offline access.
            </p>
          </div>
          <button
            onClick={onStartNewTrip}
            className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Create Your First Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Status Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Saved Offline
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {new Date(trip.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Title or Inline Edit */}
                {editingTripId === trip.id ? (
                  <div className="flex items-center gap-1.5 pt-1">
                    <input
                      type="text"
                      value={renameText}
                      onChange={(e) => setRenameText(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-sm font-bold border border-amber-500 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveRename(trip.id)}
                      className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingTripId(null)}
                      className="p-1.5 bg-stone-200 text-stone-700 rounded-lg hover:bg-stone-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-stone-900 leading-snug line-clamp-2">
                      {trip.name}
                    </h3>
                    <button
                      onClick={() => handleStartRename(trip)}
                      className="p-1 text-stone-400 hover:text-stone-700"
                      title="Rename trip"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Metrics */}
                <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span className="font-semibold text-stone-800">{trip.destinationDistrict} District</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{trip.numberOfDays} Days • {trip.travelers} Travelers ({trip.travelerType})</span>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-800 pt-1">
                    Estimated Budget: ₹{trip.budgetUsedINR.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenTrip(trip)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Open</span>
                </button>

                <button
                  onClick={() => onOpenOfflineDossier(trip)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Print / View Offline Dossier"
                >
                  <Printer className="w-4 h-4 text-amber-700" />
                </button>

                <button
                  onClick={() => StorageService.exportTripJson(trip)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4 text-stone-600" />
                </button>

                <button
                  onClick={() => handleDuplicate(trip.id)}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  title="Duplicate trip"
                >
                  <Copy className="w-4 h-4 text-stone-600" />
                </button>

                <button
                  onClick={() => handleDelete(trip.id)}
                  className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                  title="Delete trip"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
