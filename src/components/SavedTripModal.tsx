'use client';

import React, { useState } from 'react';
import {
  X,
  Calendar,
  Wallet,
  Clock,
  Utensils,
  Lightbulb,
  Check,
  Copy,
  Trash2,
  ShieldAlert,
  Compass
} from 'lucide-react';
import { SavedTrip } from '@/types/travel';

interface SavedTripModalProps {
  trip: SavedTrip | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteTrip?: (id: string) => void;
}

export function SavedTripModal({
  trip,
  isOpen,
  onClose,
  onDeleteTrip,
}: SavedTripModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const { plan } = trip;

  const handleCopy = () => {
    const text = `${plan.title}\n\n${plan.summary}\n\n` +
      plan.days.map((d) => `Day ${d.day}: ${d.theme}\nMorning: ${d.morning}\nAfternoon: ${d.afternoon}\nEvening: ${d.evening}\nCost: ₹${d.estimatedCost}\n`).join('\n') +
      `\nTotal Cost: ₹${plan.totalEstimatedCost}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Banner with Destination Photo */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden shrink-0">
          <img
            src={trip.imageUrl}
            alt={trip.destinationName}
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80';
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/50 to-black/30" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title on Banner */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#d4f938] text-black font-mono">
                  Saved Itinerary
                </span>
                <span className="text-xs text-slate-300 font-mono">
                  {trip.dates}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {plan.title}
              </h2>
            </div>

            <div className="bg-black/70 backdrop-blur-md border border-slate-700 px-3.5 py-1.5 rounded-xl self-start sm:self-auto text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Total Estimated Cost
              </span>
              <span className="text-sm font-bold text-[#d4f938] font-mono">
                ₹ {plan.totalEstimatedCost.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Itinerary Schedule */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
            {plan.summary}
          </p>

          {/* Day-by-day */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Day-by-Day Detailed Schedule</span>
            </h4>

            {plan.days.map((day) => (
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

          {/* Packing and safety */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#111827] border border-slate-800 space-y-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#d4f938]" />
                <span>Packing Checklist</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {plan.packingList.map((item, i) => (
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
                <span>Transport & Advice</span>
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {plan.transportTips}
              </p>
              <ul className="space-y-1 text-[11px] text-slate-400 pt-1">
                {plan.safetyTips.map((tip, i) => (
                  <li key={i}>• {tip}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            {onDeleteTrip && (
              <button
                onClick={() => {
                  if (confirm('Delete this saved itinerary?')) {
                    onDeleteTrip(trip.id);
                    onClose();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Itinerary</span>
              </button>
            )}

            <div className="flex items-center gap-3 ml-auto">
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
                    <span>Copy Text</span>
                  </>
                )}
              </button>

              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#d4f938] hover:bg-[#bde629] text-black font-extrabold text-xs transition-colors"
              >
                Close Itinerary
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
