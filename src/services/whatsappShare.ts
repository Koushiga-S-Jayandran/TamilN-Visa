import { ItineraryDay, TripPlannerInput, SavedTrip } from '../types';

/**
 * Format and trigger WhatsApp share for an itinerary or saved trip
 */
export function shareTripViaWhatsApp(params: {
  tripName: string;
  plannerInput?: TripPlannerInput;
  itineraryDays: ItineraryDay[];
  district: string;
  travelDate?: string;
  numberOfDays?: number;
  travelers?: number;
  travelerType?: string;
  budgetINR?: number;
  isPlanBActive?: boolean;
}) {
  const {
    tripName,
    plannerInput,
    itineraryDays,
    district,
    travelDate = plannerInput?.travelDate || 'Upcoming',
    numberOfDays = plannerInput?.numberOfDays || itineraryDays.length,
    travelers = plannerInput?.numberOfTravelers || 2,
    travelerType = plannerInput?.travelerType || 'Travelers',
    budgetINR = plannerInput?.customBudgetINR || itineraryDays.reduce((acc, d) => acc + d.dayBudgetINR, 0),
    isPlanBActive = false,
  } = params;

  let message = `🌴 *TAMIZN VISA - TRIP DOSSIER* 🌴\n`;
  message += `*${tripName}*\n`;
  message += `📍 *District:* ${district}\n`;
  message += `📅 *Travel Date:* ${travelDate} (${numberOfDays} Days)\n`;
  message += `👥 *Party:* ${travelers} Travelers (${travelerType})\n`;
  message += `💰 *Est. Budget:* ₹${budgetINR.toLocaleString()}\n`;
  if (isPlanBActive) {
    message += `🌦️ *Mode:* Plan B – Weather Adjusted (Indoor/Sheltered alternatives active)\n`;
  }
  message += `\n─────────────────────\n`;
  message += `🗓️ *DAY-BY-DAY ITINERARY TIMELINE*\n`;
  message += `─────────────────────\n\n`;

  itineraryDays.forEach((day) => {
    message += `📍 *DAY ${day.dayNumber}: ${day.focusArea}*\n`;
    message += `_${day.summary}_\n\n`;

    day.activities.forEach((act) => {
      const typeIcon =
        act.activityType === 'MEAL'
          ? '🍽️'
          : act.activityType === 'REST'
          ? '☕'
          : '🏛️';
      message += `${typeIcon} *${act.timeWindow}* — ${act.title}\n`;
      if (act.whyNowReason) {
        message += `   ↳ _${act.whyNowReason}_\n`;
      }
    });
    message += `\n`;
  });

  message += `─────────────────────\n`;
  message += `⚠️ *CULTURAL & SAFETY ADVISORIES*\n`;
  message += `─────────────────────\n`;
  message += `• *Dress Code:* Traditional attire (dhoti/saree/churidar) required for Hindu temple sanctums.\n`;
  message += `• *Midday Heat:* Avoid walking bare-foot on stone temple prakarams between 12:00 PM and 03:30 PM.\n`;
  message += `• *Zero Fabrication:* All timings and heritage records verified from TTDC, ASI & HR&CE.\n\n`;

  message += `─────────────────────\n`;
  message += `🆘 *VERIFIED EMERGENCY HELPLINES*\n`;
  message += `─────────────────────\n`;
  message += `• Tamil Nadu Tourist Police: 044-25384444\n`;
  message += `• Police Emergency: 112 / 100\n`;
  message += `• Women Safety: 1091\n`;
  message += `• Medical Ambulance: 108\n`;
  message += `• Fire & Rescue: 101\n\n`;

  const webUrl = typeof window !== 'undefined' ? `${window.location.origin}/#district=${district}` : 'https://tamizn-visa.web.app';
  message += `🔗 *View Interactive Plan & Offline Dossier:*\n${webUrl}\n`;
  message += `_Created with TamizN Visa • Designed & Developed by Koushiga.S.Jayandran_`;

  const encodedUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  
  if (typeof window !== 'undefined') {
    window.open(encodedUrl, '_blank');
  }
}
