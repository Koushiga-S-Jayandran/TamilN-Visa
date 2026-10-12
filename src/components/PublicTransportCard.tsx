import React, { useEffect, useState } from 'react';
import { DistrictTransportHub, PublicTransportService } from '../data/transport/types';
import { loadDistrictTransport } from '../data/transport';
import {
  Train,
  Bus,
  Clock,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Calendar,
  ShieldCheck,
  Compass,
} from 'lucide-react';

interface PublicTransportCardProps {
  district: string;
  isOfflineDossier?: boolean;
}

export const PublicTransportCard: React.FC<PublicTransportCardProps> = ({
  district,
  isOfflineDossier = false,
}) => {
  const [hub, setHub] = useState<DistrictTransportHub | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'all' | 'train' | 'bus'>('all');

  useEffect(() => {
    let isMounted = true;
    async function fetchTransport() {
      setLoading(true);
      try {
        const data = await loadDistrictTransport(district);
        if (isMounted) {
          setHub(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchTransport();
    return () => {
      isMounted = false;
    };
  }, [district]);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-stone-200 animate-pulse space-y-4">
        <div className="h-5 w-48 bg-stone-200 rounded" />
        <div className="h-32 bg-stone-100 rounded-2xl" />
      </div>
    );
  }

  if (!hub) {
    return (
      <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 text-xs text-stone-600">
        <strong className="block text-stone-900 mb-1">Public Transit for {district}</strong>
        Timetables and bookings can be confirmed at:
        <a
          href="https://www.irctc.co.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 underline font-semibold mx-1 inline-flex items-center gap-0.5"
        >
          IRCTC <ExternalLink className="w-3 h-3" />
        </a>
        and
        <a
          href="https://www.tnstc.in"
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-800 underline font-semibold mx-1 inline-flex items-center gap-0.5"
        >
          TNSTC <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    );
  }

  const filteredServices = hub.verifiedServices.filter((s) => {
    if (activeTab === 'all') return true;
    return s.mode === activeTab;
  });

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-200">
              Getting There & Around
            </span>
            <span className="text-xs text-stone-500">
              Verified Public Transit Guide
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 mt-1 flex items-center gap-2">
            Trains & Buses for {district}
          </h3>
        </div>

        {/* Quick Portal Links */}
        {!isOfflineDossier && (
          <div className="flex items-center gap-2 text-xs">
            <a
              href={hub.officialTrainBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <Train className="w-3.5 h-3.5 text-amber-400" />
              <span>IRCTC Trains</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={hub.officialBusBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold inline-flex items-center gap-1 transition-colors"
            >
              <Bus className="w-3.5 h-3.5 text-emerald-200" />
              <span>TNSTC Buses</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>

      {/* District Transport Hubs: Nearest Railway Station and Bus Terminals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nearest Railway Station */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Train className="w-4 h-4 text-amber-700" />
            <span>Nearest Major Railway Station</span>
          </div>
          <div className="text-sm font-bold text-stone-900 font-serif">
            {hub.nearestMajorRailwayStation}
          </div>
          <div className="text-[11px] text-stone-500">
            Station Code: <strong className="font-mono text-stone-800">{hub.nearestRailwayCode}</strong> (Southern Railway Division)
          </div>
        </div>

        {/* Major Bus Stands */}
        <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
            <Bus className="w-4 h-4 text-emerald-700" />
            <span>Primary Bus Stands & Terminals</span>
          </div>
          <ul className="space-y-1 text-xs text-stone-800 font-medium">
            {hub.majorBusStands.map((stand, sIdx) => (
              <li key={sIdx} className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span>{stand}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Warning Notice (Mandatory Requirement) */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-950">
          <strong className="block font-bold">
            Important Travel Advisory: Timings can change. Verify on the official site.
          </strong>
          <p className="text-amber-900 leading-relaxed font-medium">
            {hub.warningNotice} Schedule verified as of: <strong className="font-mono">{hub.lastVerified}</strong> via {hub.sourceName}.
          </p>
        </div>
      </div>

      {/* Verified Transit Services */}
      {hub.verifiedServices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-widest font-bold text-stone-400">
              Verified Key Timetables & Services
            </label>
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-0.5 rounded-lg font-semibold ${
                  activeTab === 'all' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab('train')}
                className={`px-2.5 py-0.5 rounded-lg font-semibold ${
                  activeTab === 'train' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'
                }`}
              >
                Trains
              </button>
              <button
                onClick={() => setActiveTab('bus')}
                className={`px-2.5 py-0.5 rounded-lg font-semibold ${
                  activeTab === 'bus' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600'
                }`}
              >
                Buses
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredServices.map((svc) => (
              <div
                key={svc.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-bold text-[10px] uppercase bg-stone-200 text-stone-800">
                      {svc.operator}
                    </span>
                    {svc.serviceNumber && (
                      <span className="font-mono font-bold text-amber-900 bg-amber-100/70 px-1.5 py-0.5 rounded text-[11px]">
                        #{svc.serviceNumber}
                      </span>
                    )}
                    <span className="font-bold text-stone-900 text-sm">
                      {svc.serviceName}
                    </span>
                  </div>
                  <div className="text-stone-600 flex items-center gap-2">
                    <span>{svc.fromStation}</span>
                    <span className="text-stone-400">→</span>
                    <span>{svc.toStation}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-stone-600 font-mono text-[11px]">
                  {svc.departureTime && (
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase">Dep / Arr</span>
                      <strong>{svc.departureTime}</strong> – <strong>{svc.arrivalTime || 'TBD'}</strong>
                    </div>
                  )}
                  <div>
                    <span className="text-stone-400 block text-[9px] uppercase">Frequency</span>
                    <span>{svc.daysOfOperation}</span>
                  </div>
                  {svc.fareINR !== null ? (
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase">Verified Fare</span>
                      <strong className="text-emerald-700 text-xs">₹{svc.fareINR}</strong>
                    </div>
                  ) : (
                    <div>
                      <span className="text-stone-400 block text-[9px] uppercase">Fare</span>
                      <span className="text-stone-500 italic">Check on portal</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
