import React, { useState } from 'react';
import {
  TripPlannerInput,
  TravelerType,
  BudgetTier,
  TravelPreference,
  ItineraryDay,
} from '../types';
import { TN_DISTRICTS } from '../config/appConfig';
import { generateItinerary } from '../services/itineraryEngine';
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Compass,
  DollarSign,
  Heart,
  Sliders,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface MultiStepPlannerProps {
  initialDistrict?: string;
  onTripGenerated: (input: TripPlannerInput, days: ItineraryDay[]) => void;
}

export const MultiStepPlanner: React.FC<MultiStepPlannerProps> = ({
  initialDistrict,
  onTripGenerated,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [districtSearch, setDistrictSearch] = useState('');

  // Form State
  const [destinationDistrict, setDestinationDistrict] = useState<string>(
    initialDistrict || 'Coimbatore'
  );
  const [travelDate, setTravelDate] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [numberOfDays, setNumberOfDays] = useState<number>(2);
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(2);
  const [travelerType, setTravelerType] = useState<TravelerType>('Family');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('Mid-range');
  const [customBudgetINR, setCustomBudgetINR] = useState<number>(5000);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Temples',
    'Heritage',
    'Food',
  ]);
  const [selectedPreferences, setSelectedPreferences] = useState<TravelPreference[]>([
    'Avoid crowds',
    'Early morning travel',
  ]);

  // Generation sequence states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState(0);

  const generationStages = [
    'Checking destination information across Tamil Nadu database…',
    'Checking verified temple and monument opening hours…',
    'Optimizing road travel times and minimizing back-tracking…',
    'Evaluating historical crowd patterns & scheduling quiet hours…',
    'Balancing your budget and calculating authentic food options…',
    'Finding suitable alternative gems and scenic routes…',
    'Finalizing day-wise itinerary (06:00 AM - 09:00 PM)…',
  ];

  const travelerTypeOptions: { type: TravelerType; label: string; desc: string }[] = [
    { type: 'Family', label: 'Family Trip', desc: 'Comfortable pacing, reliable dining, gentle walking' },
    { type: 'Solo', label: 'Solo Traveler', desc: 'Deep cultural immersion, flexible timing, local transit' },
    { type: 'Friends', label: 'Friends Group', desc: 'Active exploration, street delicacies, viewpoints' },
    { type: 'Couple', label: 'Couple Journey', desc: 'Scenic sunsets, heritage retreats, relaxed mornings' },
    { type: 'Student', label: 'Student / Youth', desc: 'Budget-smart, maximum sights, affordable tiffin' },
    { type: 'Senior-friendly', label: 'Senior-Friendly', desc: 'Wheelchair/ramp checks, zero steep climbs, slow tempo' },
  ];

  const interestOptions = [
    'Temples',
    'Heritage',
    'Beaches',
    'Hills',
    'Nature',
    'Wildlife',
    'Adventure',
    'Food',
    'Culture',
    'Shopping',
    'Photography',
    'Hidden Gems',
    'Relaxation',
  ];

  const preferenceOptions: TravelPreference[] = [
    'Avoid crowds',
    'Maximum places',
    'Slow travel',
    'Early morning travel',
    'Photography focused',
    'Food focused',
    'Family friendly',
    'Student friendly',
    'Short travel distances',
    'Finish before 6 PM',
  ];

  const filteredDistricts = TN_DISTRICTS.filter((d) =>
    d.toLowerCase().includes(districtSearch.toLowerCase())
  );

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const togglePreference = (pref: TravelPreference) => {
    if (selectedPreferences.includes(pref)) {
      setSelectedPreferences(selectedPreferences.filter((p) => p !== pref));
    } else {
      setSelectedPreferences([...selectedPreferences, pref]);
    }
  };

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setCurrentStep(9);

    let stage = 0;
    const interval = setInterval(() => {
      stage += 1;
      if (stage < generationStages.length) {
        setGenerationPhase(stage);
      } else {
        clearInterval(interval);
        const inputData: TripPlannerInput = {
          destinationDistrict,
          travelDate,
          numberOfDays,
          numberOfTravelers,
          travelerType,
          budgetTier,
          customBudgetINR: budgetTier === 'Custom' ? customBudgetINR : undefined,
          selectedInterests,
          selectedPreferences,
        };
        const generatedDays = generateItinerary(inputData);
        setTimeout(() => {
          setIsGenerating(false);
          onTripGenerated(inputData, generatedDays);
        }, 500);
      }
    }, 450);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header and Stepper Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-widest font-bold text-amber-600">
              TAMIZN VISA ENGINE
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Personalized Trip Planner
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-stone-500">Step {currentStep} of 8</span>
            <div className="text-[11px] text-stone-400">All 38 TN Districts Supported</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-600 h-full transition-all duration-300"
            style={{ width: `${(Math.min(currentStep, 8) / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP CONTENT CONTAINER */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl min-h-[460px] flex flex-col justify-between">
        
        {/* STEP 1: DESTINATION */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                Step 1: Choose Your Destination District
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Select from all 38 verified districts of Tamil Nadu.
              </p>
            </div>

            <input
              type="text"
              value={districtSearch}
              onChange={(e) => setDistrictSearch(e.target.value)}
              placeholder="Search Tamil Nadu district (e.g. Coimbatore, Madurai, Ramanathapuram)..."
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-64 overflow-y-auto p-1">
              {filteredDistricts.map((d) => (
                <button
                  key={d}
                  onClick={() => setDestinationDistrict(d)}
                  className={`p-3 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                    destinationDistrict.toLowerCase() === d.toLowerCase()
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-stone-100'
                  }`}
                >
                  <span>{d}</span>
                  {destinationDistrict.toLowerCase() === d.toLowerCase() && (
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />
                  )}
                </button>
              ))}
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl text-xs text-amber-900 border border-amber-200/80 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                Selected: <strong>{destinationDistrict} District</strong>. Complete historical visitation patterns loaded.
              </span>
            </div>
          </div>
        )}

        {/* STEP 2: TRAVEL DATE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-amber-600" />
                Step 2: When Are You Traveling?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Travel dates determine festival crowds, weekend surges, and seasonal weather factors.
              </p>
            </div>

            <div className="max-w-md mx-auto py-8">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                Departure Date
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-xs text-stone-500 mt-3">
                * Our crowd engine calculates weekday vs. weekend footfall shifts for accurate darshan scheduling.
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: NUMBER OF DAYS */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                Step 3: Number of Days
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Realistic 06:00 AM – 09:00 PM day windows organized geographically without backtracking.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
              {[1, 2, 3, 4, 5, 7].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumberOfDays(num)}
                  className={`p-6 rounded-2xl border text-center transition-all ${
                    numberOfDays === num
                      ? 'bg-amber-600 text-white border-amber-600 shadow-lg scale-102 font-bold'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100 hover:border-amber-300'
                  }`}
                >
                  <div className="text-3xl font-serif font-extrabold mb-1">{num}</div>
                  <div className="text-xs font-semibold uppercase tracking-wider">
                    {num === 1 ? 'Single Day' : `${num} Days`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: NUMBER OF TRAVELERS */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Step 4: Number of Travelers
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Used to balance taxi vs auto costs, boat booking limits, and dining estimates.
              </p>
            </div>

            <div className="max-w-md mx-auto py-8 text-center space-y-6">
              <div className="text-5xl font-serif font-bold text-amber-700">
                {numberOfTravelers} <span className="text-lg font-sans font-medium text-stone-500">traveler{numberOfTravelers > 1 ? 's' : ''}</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={numberOfTravelers}
                onChange={(e) => setNumberOfTravelers(parseInt(e.target.value))}
                className="w-full accent-amber-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs text-stone-400 font-bold">
                <span>1 (Solo)</span>
                <span>5 (Family)</span>
                <span>10 (Group)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: TRAVELER TYPE */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                Step 5: Traveler Profile
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Personalizes walking distances, ramp accessibility checks, and meal timings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 py-2">
              {travelerTypeOptions.map((opt) => (
                <button
                  key={opt.type}
                  onClick={() => setTravelerType(opt.type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    travelerType === opt.type
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{opt.label}</div>
                  <div className={`text-xs leading-relaxed ${
                    travelerType === opt.type ? 'text-amber-100' : 'text-stone-500'
                  }`}>
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: BUDGET */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-amber-600" />
                Step 6: Travel Budget
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Calculates transportation, verified entry tickets, and regional meals.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(['Budget', 'Mid-range', 'Luxury'] as BudgetTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setBudgetTier(tier)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    budgetTier === tier
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-bold text-base mb-1">{tier}</div>
                  <div className={`text-xs ${budgetTier === tier ? 'text-amber-100' : 'text-stone-500'}`}>
                    {tier === 'Budget' && 'Public buses, local messes, free entry darshans (₹800 - ₹1200 / day)'}
                    {tier === 'Mid-range' && 'Auto/cabs, heritage restaurants, special queues (₹1800 - ₹2800 / day)'}
                    {tier === 'Luxury' && 'Private taxi, boutique heritage dining, guided tours (₹4500+ / day)'}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 block mb-2">
                Or Specify Total Custom Budget (INR):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={customBudgetINR}
                  onChange={(e) => {
                    setCustomBudgetINR(parseInt(e.target.value) || 0);
                    setBudgetTier('Custom');
                  }}
                  step="500"
                  min="1000"
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-bold w-48 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-stone-500 font-medium">
                  Estimated budget per journey for {numberOfTravelers} travelers.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: INTERESTS */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-amber-600" />
                Step 7: Travel Interests (Multiple Selections)
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Select your core themes to customize destination prioritization.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 py-3">
              {interestOptions.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-300 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '} {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 8: PREFERENCES */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif font-bold text-stone-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-600" />
                Step 8: Intelligent Travel Rules & Preferences
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Rules directly re-order schedules, transit routes, and crowd avoidance timings.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              {preferenceOptions.map((pref) => {
                const isSelected = selectedPreferences.includes(pref);
                return (
                  <button
                    key={pref}
                    onClick={() => togglePreference(pref)}
                    className={`p-3.5 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                        : 'bg-stone-50 text-stone-800 border-stone-200 hover:border-amber-300 hover:bg-stone-100'
                    }`}
                  >
                    <span>{pref}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>

            <div className="p-3 bg-stone-100 rounded-xl text-xs text-stone-600 border border-stone-200">
              * Choosing <strong>Avoid crowds</strong> prioritizes 06:30 AM darshans and re-routes afternoon stops to serene heritage alternatives.
            </div>
          </div>
        )}

        {/* STEP 9: GENERATION PROGRESS */}
        {currentStep === 9 && (
          <div className="py-16 text-center space-y-6">
            <div className="inline-block p-4 rounded-full bg-amber-50 text-amber-600 animate-pulse">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-stone-900">
                Generating Intelligent Tamil Nadu Itinerary
              </h3>
              <p className="text-sm text-amber-800 font-semibold font-mono animate-fade-in">
                {generationStages[generationPhase]}
              </p>
            </div>
            <div className="max-w-md mx-auto bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-600 h-full transition-all duration-300"
                style={{ width: `${((generationPhase + 1) / generationStages.length) * 100}%` }}
              />
            </div>
            <p className="text-xs text-stone-400">
              Applying realistic 06:00 AM - 09:00 PM operating buffers and non-fabricated crowd models.
            </p>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        {currentStep <= 8 && (
          <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {currentStep < 8 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs tracking-wider uppercase flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleStartGeneration}
                className="px-8 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Intelligent Trip</span>
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
