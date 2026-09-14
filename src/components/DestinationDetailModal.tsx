'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Heart,
  Star,
  MapPin,
  Calendar,
  Plane,
  Train,
  Bus,
  Mountain,
  Sparkles,
  Hotel,
  Compass,
  Ticket,
  ExternalLink
} from 'lucide-react';
import { Destination } from '@/types/travel';
import { buildBookingComUrl, buildMakeMyTripUrl } from '@/data/staysData';

const CATEGORY_FALLBACKS: Record<string, string> = {
  hills: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
  beaches: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80',
  heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&q=80',
  wildlife: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=1200&q=80',
  spiritual: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=1200&q=80',
  backwaters: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80';

interface DestinationDetailModalProps {
  destination: Destination | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenAiPlanner: (destination: Destination) => void;
  onOpenTrainAdvisor?: (destination: Destination, mode?: 'train' | 'flight' | 'bus') => void;
  onOpenStaysAdvisor?: (destination: Destination) => void;
}

export function DestinationDetailModal({
  destination,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenAiPlanner,
  onOpenTrainAdvisor,
  onOpenStaysAdvisor,
}: DestinationDetailModalProps) {
  const [imgSrc, setImgSrc] = useState(destination?.imageUrl || DEFAULT_FALLBACK);

  useEffect(() => {
    if (destination?.imageUrl) {
      setImgSrc(destination.imageUrl);
    }
  }, [destination?.imageUrl]);

  if (!isOpen || !destination) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[#0d1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Hero Photo Banner */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden shrink-0 bg-slate-900">
          <img
            src={imgSrc}
            alt={destination.name}
            onError={() => {
              const fallback = CATEGORY_FALLBACKS[destination.category] || DEFAULT_FALLBACK;
              if (imgSrc !== fallback) {
                setImgSrc(fallback);
              }
            }}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-[#0d1322]/40 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 flex items-center justify-center transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(destination.id)}
            className="absolute top-4 right-16 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-white hover:scale-110 active:scale-95 flex items-center justify-center transition-transform z-20"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
              }`}
            />
          </button>

          {/* Title & Tag on Hero */}
          <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#d4f938] text-black font-mono">
                  {destination.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400 bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-amber-400" />
                  <span className="font-bold">{destination.rating}</span>
                  <span className="text-slate-400">({destination.reviewsCount})</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {destination.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>
                  {destination.state}, {destination.country}
                </span>
              </p>
            </div>

            {/* Price Pill */}
            <div className="bg-black/70 backdrop-blur-md border border-slate-700 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Budget Backpacker
              </span>
              <span className="text-sm font-bold text-[#d4f938] font-mono">
                ₹ {destination.dailyCostBudget}
                <span className="text-xs text-slate-400 font-normal"> / day</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Description */}
          <p className="text-sm text-slate-300 leading-relaxed">
            {destination.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Optimal Travel Season</span>
              </span>
              <p className="text-xs font-bold text-[#d4f938] mt-1 leading-snug">
                {destination.bestSeason}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-400" />
                Recommended
              </span>
              <p className="text-xs font-bold text-white mt-1">
                {destination.avgVisitDays} Days
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Plane className="w-3 h-3 text-purple-400" />
                Nearest Airport
              </span>
              <p className="text-xs font-bold text-white mt-1 truncate" title={destination.nearestAirport}>
                {destination.nearestAirport.split('(')[0].trim()}
              </p>
            </div>
          </div>

          {/* Must-Visit Viewpoints */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Ticket className="w-4 h-4 text-cyan-400" />
              <span>Must-Visit Viewpoints & Attractions</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {destination.viewpoints.map((vp, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">
                      {vp.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold text-cyan-300">
                      {vp.entryFee === null ? 'Free' : `₹${vp.entryFee}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {vp.description}
                  </p>
                  {vp.visitTime && (
                    <span className="text-[10px] text-amber-400 block pt-0.5">
                      Best: {vp.visitTime}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Curated Dorms & Hostels */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Hotel className="w-4 h-4 text-[#d4f938]" />
                <span>Curated Backpacker Hostels &amp; Stays</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Check Live Rates on OTAs</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {destination.hostels.map((h, i) => {
                const cityName = destination.name.split('&')[0].split(' ')[0].trim();
                const bookingComUrl = buildBookingComUrl(cityName);
                const makeMyTripUrl = buildMakeMyTripUrl(cityName);

                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between gap-3"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold text-white truncate">{h.name}</h4>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold shrink-0">
                          {h.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {h.perks.map((p, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <a
                        href={bookingComUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Booking.com</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <a
                        href={makeMyTripUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-1.5 px-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-300 hover:text-white text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>MakeMyTrip</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>

            {onOpenStaysAdvisor && (
              <button
                onClick={() => {
                  onClose();
                  onOpenStaysAdvisor(destination);
                }}
                className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Hotel className="w-3.5 h-3.5" />
                <span>Search All Hotels, Dorms &amp; Hostels in {destination.name.split(' ')[0]} →</span>
              </button>
            )}
          </div>

          {/* Transport Guideline */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-slate-800 flex items-start gap-3">
            <Compass className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1 w-full">
              <span className="font-bold text-amber-300">
                Transport Booking Guidelines &amp; Routes
              </span>
              <p className="text-slate-300 leading-relaxed">
                {destination.transport.notes} IRCTC railway quota opens{' '}
                <strong className="text-[#d4f938]">
                  {destination.transport.trainAdvanceDays} days
                </strong>{' '}
                prior. Flights best price window:{' '}
                <strong className="text-cyan-300">
                  {destination.transport.flightAdvanceDays.min} -{' '}
                  {destination.transport.flightAdvanceDays.max} days
                </strong>
                .
              </p>
              {onOpenTrainAdvisor && (
                <div className="flex flex-wrap gap-2 pt-1.5">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenTrainAdvisor(destination, 'train');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#d4f938]/15 hover:bg-[#d4f938]/25 border border-[#d4f938]/30 text-[#d4f938] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Train className="w-3.5 h-3.5" />
                    <span>Train Booking Window →</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenTrainAdvisor(destination, 'flight');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>Flight Deals &amp; Airports →</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenTrainAdvisor(destination, 'bus');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Bus className="w-3.5 h-3.5" />
                    <span>Bus Schedules &amp; ISBTs →</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Modal Action CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenAiPlanner(destination);
              }}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4f938] to-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-lime-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Itinerary for {destination.name.split(' ')[0]}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
