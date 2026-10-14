import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Destination } from '../types';
import { X, QrCode, Download, ShieldCheck, PhoneCall, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface OfflinePlaceQRModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfflinePlaceQRModal: React.FC<OfflinePlaceQRModalProps> = ({
  destination,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (!destination || !isOpen) return;

    const deepLinkUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}#place=${destination.id}`
        : `https://tamizn-visa.web.app/#place=${destination.id}`;

    QRCode.toDataURL(deepLinkUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code:', err));
  }, [destination, isOpen]);

  if (!isOpen || !destination) return null;

  const deepLinkUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}#place=${destination.id}`
      : `https://tamizn-visa.web.app/#place=${destination.id}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 p-6 sm:p-8 text-center space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-700 block">
                Offline Deep Link
              </span>
              <h3 className="font-serif font-bold text-lg text-stone-900 leading-tight">
                {destination.name}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="flex justify-center p-3 bg-stone-50 rounded-2xl border border-stone-200">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt={`QR Code for ${destination.name}`}
              className="w-56 h-56 rounded-xl shadow-md border border-stone-300"
            />
          ) : (
            <div className="w-56 h-56 bg-stone-200 rounded-xl animate-pulse flex items-center justify-center text-xs text-stone-500">
              Generating Offline QR...
            </div>
          )}
        </div>

        {/* Explainability Callout */}
        <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200/80 text-left text-xs space-y-1.5 text-amber-950">
          <div className="font-bold flex items-center gap-1.5 text-amber-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Instant Offline Dossier Access</span>
          </div>
          <p className="text-[11px] leading-relaxed text-stone-700">
            Scan this QR code with any mobile camera. It instantly opens verified timings, dress code restrictions, emergency notes, and crowd forecasts—stored locally on your device for offline exploration.
          </p>
        </div>

        {/* Quick Details Preview */}
        <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-left text-xs space-y-1 text-stone-600">
          <div><strong>District:</strong> {destination.district}</div>
          <div><strong>Visiting Hours:</strong> {destination.openingTime} – {destination.closingTime}</div>
          <div><strong>Dress Code:</strong> {destination.dressRequirements}</div>
          <div><strong>Official Record:</strong> {destination.source.sourceName}</div>
        </div>

        {/* Deep Link URL */}
        <div className="pt-1">
          <div className="text-[10px] font-mono text-stone-400 truncate bg-stone-100 p-2 rounded-lg border border-stone-200">
            {deepLinkUrl}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-stone-800 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
