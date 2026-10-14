/**
 * TAMIZN VISA - Safety Trail & Offline Check-In Service (Part 8.2)
 * Persists offline safety check-in checkpoints to localStorage and
 * provides instant Web Share / WhatsApp emergency location broadcasts.
 */

export interface SafetyCheckIn {
  id: string;
  stopTitle: string;
  district: string;
  locality?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string; // ISO string
}

const STORAGE_KEY = 'tamizn_safety_trail';

export const SafetyTrailService = {
  getCheckIns(): SafetyCheckIn[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  logCheckIn(stopTitle: string, district: string, locality?: string, lat?: number, lng?: number): SafetyCheckIn {
    const list = this.getCheckIns();
    const newEntry: SafetyCheckIn = {
      id: `checkin-${Date.now()}`,
      stopTitle,
      district,
      locality,
      latitude: lat,
      longitude: lng,
      timestamp: new Date().toISOString(),
    };
    const updated = [newEntry, ...list].slice(0, 50); // Keep last 50
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save safety check-in:', e);
    }
    return newEntry;
  },

  isCheckedIn(stopTitle: string, district: string): boolean {
    const list = this.getCheckIns();
    return list.some((c) => c.stopTitle === stopTitle && c.district === district);
  },

  buildShareMessage(stopTitle: string, district: string, locality?: string, lat?: number, lng?: number): string {
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    let message = `🛡️ TAMIZN VISA Live Safety Check-in:\nI have safely arrived at: ${stopTitle}`;
    if (locality) message += `, ${locality}`;
    message += ` (${district} District, Tamil Nadu).\n`;
    message += `🕒 Timestamp: ${timeStr}, ${dateStr}\n`;
    if (lat && lng) {
      message += `📍 Live Coordinates: https://maps.google.com/?q=${lat},${lng}\n`;
    }
    message += `🚨 Emergency: Dial 112 / Women Helpline 1091 / 181`;
    return message;
  },

  async shareLocation(stopTitle: string, district: string, locality?: string, lat?: number, lng?: number): Promise<boolean> {
    const message = this.buildShareMessage(stopTitle, district, locality, lat, lng);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Safety Check-in: ${stopTitle}`,
          text: message,
        });
        return true;
      } catch (e: any) {
        if (e.name === 'AbortError') return false;
      }
    }
    // Fallback to WhatsApp
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    return true;
  },
};
