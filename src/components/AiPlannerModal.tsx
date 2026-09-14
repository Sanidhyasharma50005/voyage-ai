'use client';

import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Calendar,
  Wallet,
  Compass,
  Check,
  Copy,
  Download,
  AlertCircle,
  MapPin,
  Clock,
  Utensils,
  Lightbulb,
  ShieldAlert
} from 'lucide-react';
import { Destination, TripPlan } from '@/types/travel';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  destinations: Destination[];
  initialDestination?: Destination | null;
  onSaveTrip?: (
    trip: TripPlan,
    destination: Destination,
    days: number,
    budgetTier: 'budget' | 'comfort' | 'luxury'
  ) => void;
}

export function AiPlannerModal({
  isOpen,
  onClose,
  destinations,
  initialDestination,
  onSaveTrip,
}: AiPlannerModalProps) {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(
    initialDestination ? initialDestination.id : destinations[0]?.id || 'goa'
  );
  const [days, setDays] = useState<number>(initialDestination?.avgVisitDays || 4);
  const [budgetTier, setBudgetTier] = useState<'budget' | 'comfort' | 'luxury'>('budget');
  const [travelStyle, setTravelStyle] = useState<'solo' | 'couple' | 'family' | 'friends'>('solo');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    'Heritage',
    'Food',
    'Nature',
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<TripPlan | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync when modal opens with a different destination
  React.useEffect(() => {
    if (isOpen && initialDestination) {
      setSelectedPlaceId(initialDestination.id);
      setDays(initialDestination.avgVisitDays || 4);
      setGeneratedPlan(null);
    }
  }, [isOpen, initialDestination]);

  if (!isOpen) return null;

  const currentPlace =
    destinations.find((d) => d.id === selectedPlaceId) || destinations[0];

  const availableInterests = [
    'Heritage',
    'Beaches',
    'Treks & Adventure',
    'Local Food & Cafes',
    'Nature & Sunsets',
    'Spiritual & Yoga',
    'Nightlife & Markets',
    'Photography',
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  // Generate itinerary function (calls Gemini API if available, or intelligent realistic fallback)
  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedPlan(null);

    try {
      // First attempt to call the backend route
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          placeId: currentPlace.id,
          placeName: currentPlace.name,
          days,
          budgetTier,
          travelStyle,
          interests: selectedInterests,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Only use API result if it actually contains a valid plan (has days array)
        if (data && Array.isArray(data.days) && data.days.length > 0) {
          setGeneratedPlan(data);
          setIsLoading(false);
          return;
        }
      }
    } catch {
      // Fallback below
    }

    // Realistic intelligent fallback plan tailored specifically to the destination:
    setTimeout(() => {
      const dailyRate =
        budgetTier === 'budget'
          ? currentPlace.dailyCostBudget
          : budgetTier === 'comfort'
          ? currentPlace.dailyCostComfort
          : currentPlace.dailyCostLuxury;

      const plan: TripPlan = {
        title: `${days}-Day ${budgetTier.toUpperCase()} Voyage in ${currentPlace.name}`,
        summary: `A personalized ${days}-day itinerary crafted for a ${travelStyle} traveler seeking ${selectedInterests.join(
          ', '
        )}. Experience highlights, viewpoints, authentic eateries, and optimal travel timings.`,
        totalEstimatedCost: dailyRate * days,
        days: Array.from({ length: days }).map((_, idx) => {
          const dayNum = idx + 1;
          const viewpoints = currentPlace?.viewpoints || [];
          const hostels = currentPlace?.hostels || [];
          const vp = viewpoints.length > 0 ? viewpoints[idx % viewpoints.length] : null;
          const hostel = hostels.length > 0 ? hostels[idx % hostels.length] : null;

          return {
            day: dayNum,
            theme:
              dayNum === 1
                ? 'Arrival, Orientation & Sunset Vibes'
                : dayNum === days
                ? 'Souvenirs, Cultural Heritage & Farewell'
                : `Deep Exploration of ${vp?.name || 'Local Gems'}`,
            morning: `Early start at 7:30 AM. Head to ${
              vp?.name || 'the primary viewpoint'
            } to catch morning light and avoid crowds. Enjoy local chai and breakfast nearby.`,
            afternoon: `1:00 PM. Experience local cuisine. Relax during midday heat, then explore the historic old quarter or local artisans.`,
            evening: `5:30 PM. Sunset gathering at scenic ridge or beach point. Enjoy dinner at a recommended local restaurant with authentic regional flavors.`,
            meals: {
              breakfast: 'Local street deli or homestyle breakfast (₹80 - ₹150)',
              lunch: 'Authentic regional thali or fresh seafood café (₹150 - ₹350)',
              dinner: 'Rooftop dining with evening ambiance and live acoustic vibes (₹250 - ₹600)',
            },
            estimatedCost: dailyRate,
            tips: `Stay at ${hostel?.name || 'curated stays'}. Carry cash for local autos and remember to pre-book permits.`,
          };
        }),
        packingList: [
          'Comfortable walking/hiking shoes',
          'Lightweight breathable linen/cotton wear',
          'Power bank & universal adapter',
          'Sunscreen SPF 50 & insect repellent',
          'Reusable insulated water bottle',
          'Government photo ID for hostel and monument check-ins',
        ],
        safetyTips: [
          'Emergency SOS: Dial 112 across India.',
          'Always negotiate auto/taxi fares beforehand or use registered prepaid booths.',
          'Dress modestly when visiting active spiritual shrines and temples.',
        ],
        transportTips: currentPlace?.transport?.notes || 'Book IRCTC trains and advance tickets early.',
      };

      setGeneratedPlan(plan);
      setIsLoading(false);
    }, 1200);
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    const text = `${generatedPlan.title}\n\n${generatedPlan.summary}\n\n` +
      generatedPlan.days.map((d) => `Day ${d.day}: ${d.theme}\nMorning: ${d.morning}\nAfternoon: ${d.afternoon}\nEvening: ${d.evening}\nCost: ₹${d.estimatedCost}\n`).join('\n') +
      `\nTotal Cost: ₹${generatedPlan.totalEstimatedCost}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0d1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header with gradient badge */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-cyan-950/30 via-slate-900 to-[#0d1322]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center text-black shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Voyage AI Trip Planner
                </h2>
                <span className="text-[10px] font-mono uppercase bg-[#d4f938] text-black font-bold px-2 py-0.5 rounded-full">
                  Gemini Flash
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Instant day-by-day smart itinerary with cost breakdown & packing guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 1. Destination & Duration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destination Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Select Destination</span>
              </label>
              <select
                value={selectedPlaceId}
                onChange={(e) => setSelectedPlaceId(e.target.value)}
                className="w-full bg-[#162032] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4f938]"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.state || d.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Days Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#d4f938]" />
                  <span>Trip Duration: {days} Days</span>
                </label>
                <span className="text-xs font-mono font-bold text-[#d4f938]">
                  {days} Days / {days - 1} Nights
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-[#d4f938] cursor-pointer"
              />
            </div>
          </div>

          {/* 2. Budget Tier & Travel Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Budget */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Budget Tier</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'budget', label: 'Budget', sub: '₹248 - 600/d' },
                    { id: 'comfort', label: 'Comfort', sub: '₹1.5k - 2.5k/d' },
                    { id: 'luxury', label: 'Luxury', sub: '₹5k - 10k/d' },
                  ] as const
                ).map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setBudgetTier(tier.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex flex-col items-center border transition-all ${
                      budgetTier === tier.id
                        ? 'bg-[#d4f938] text-black border-[#d4f938] shadow-md'
                        : 'bg-[#162032] text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    <span>{tier.label}</span>
                    <span className="text-[10px] font-normal opacity-80">{tier.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Travel Style</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['solo', 'couple', 'family', 'friends'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setTravelStyle(style)}
                    className={`py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${
                      travelStyle === style
                        ? 'bg-cyan-400 text-black border-cyan-400 shadow-md'
                        : 'bg-[#162032] text-slate-300 border-slate-700 hover:border-slate-600'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Interests Pills */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Travel Interests (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#d4f938]/20 border-[#d4f938] text-[#d4f938]'
                        : 'bg-[#162032] border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#d4f938] via-lime-400 to-emerald-400 hover:opacity-95 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Voyage AI is drafting your smart itinerary...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate {days}-Day Itinerary with AI</span>
              </>
            )}
          </button>

          {/* Results Display */}
          {generatedPlan && (
            <div className="pt-4 space-y-6 border-t border-slate-800 animate-fadeIn">
              {/* Plan Summary Banner */}
              <div className="p-4 rounded-2xl bg-[#111827] border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">
                    {generatedPlan.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                    {generatedPlan.summary}
                  </p>
                </div>
                <div className="bg-[#090d16] px-4 py-2 rounded-xl border border-slate-800 shrink-0 text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Total Estimated Cost
                  </span>
                  <div className="text-lg font-bold text-[#d4f938] font-mono">
                    ₹ {generatedPlan.totalEstimatedCost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Day-by-Day Cards */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Day-by-Day Schedule</span>
                </h4>

                {generatedPlan.days.map((day) => (
                  <div
                    key={day.day}
                    className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-[#d4f938] text-black font-extrabold text-xs flex items-center justify-center font-mono">
                          D{day.day}
                        </span>
                        <h5 className="font-bold text-sm text-white">{day.theme}</h5>
                      </div>
                      <span className="text-xs font-mono font-semibold text-slate-400">
                        ₹ {day.estimatedCost} / day
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-cyan-300 flex items-center gap-1 mb-1">
                          <Clock className="w-3 h-3" /> Morning
                        </span>
                        <p className="text-slate-300 leading-relaxed">{day.morning}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-amber-300 flex items-center gap-1 mb-1">
                          <Utensils className="w-3 h-3" /> Afternoon
                        </span>
                        <p className="text-slate-300 leading-relaxed">{day.afternoon}</p>
                      </div>

                      <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                        <span className="font-bold text-rose-300 flex items-center gap-1 mb-1">
                          <Compass className="w-3 h-3" /> Evening
                        </span>
                        <p className="text-slate-300 leading-relaxed">{day.evening}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/40 p-2.5 rounded-lg">
                      <Lightbulb className="w-3.5 h-3.5 text-[#d4f938] shrink-0" />
                      <span>{day.tips}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Packing list & Safety */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#d4f938]" />
                    <span>Packing Essentials</span>
                  </h5>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {generatedPlan.packingList.map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Local Transport & Safety</span>
                  </h5>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {generatedPlan.transportTips}
                  </p>
                  <ul className="space-y-1 text-[11px] text-slate-400 pt-1">
                    {generatedPlan.safetyTips.map((tip, i) => (
                      <li key={i}>• {tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#d4f938]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Itinerary</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (onSaveTrip && generatedPlan) {
                      onSaveTrip(generatedPlan, currentPlace, days, budgetTier);
                    }
                    onClose();
                  }}
                  className="px-5 py-2 rounded-xl bg-[#d4f938] hover:bg-lime-400 text-xs font-extrabold text-black flex items-center gap-1.5 transition-colors shadow-md shadow-lime-500/20 active:scale-95 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Save to My Trips</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
