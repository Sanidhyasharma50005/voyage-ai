'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CloudSun,
  Train,
  Sparkles,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { SavedTrip } from '@/types/travel';

interface RightSidebarProps {
  selectedCity?: string;
  selectedCityLat?: number;
  selectedCityLon?: number;
  savedTrips?: SavedTrip[];
  onSelectTrip?: (trip: SavedTrip) => void;
  onViewAllTrips?: () => void;
  onOpenAiPlanner?: () => void;
  onOpenTrainAdvisor?: () => void;
}

export function RightSidebar({
  selectedCity = 'Goa',
  selectedCityLat = 15.2993,
  selectedCityLon = 74.124,
  savedTrips = [],
  onSelectTrip,
  onViewAllTrips,
  onOpenAiPlanner,
  onOpenTrainAdvisor,
}: RightSidebarProps) {
  // Weather state (Live Open-Meteo)
  const [weather, setWeather] = useState<{
    temp: number;
    windSpeed: number;
    condition: string;
    loading: boolean;
  }>({
    temp: 28,
    windSpeed: 12,
    condition: 'Pleasant & Sunny',
    loading: false,
  });

  // Fetch live weather from Open-Meteo
  useEffect(() => {
    let isMounted = true;
    async function fetchWeather() {
      try {
        setWeather((prev) => ({ ...prev, loading: true }));
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${selectedCityLat}&longitude=${selectedCityLon}&current_weather=true`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.current_weather) {
            setWeather({
              temp: Math.round(data.current_weather.temperature),
              windSpeed: Math.round(data.current_weather.windspeed),
              condition: data.current_weather.weathercode < 3 ? 'Sunny & Clear' : 'Partly Cloudy',
              loading: false,
            });
          }
        }
      } catch {
        if (isMounted) {
          setWeather((prev) => ({ ...prev, loading: false }));
        }
      }
    }
    fetchWeather();
    return () => {
      isMounted = false;
    };
  }, [selectedCityLat, selectedCityLon]);

  return (
    <aside className="w-80 bg-[#0a0e1a] border-l border-slate-800/80 p-5 space-y-6 shrink-0 hidden xl:block select-none overflow-y-auto no-scrollbar max-h-screen sticky top-0">
      {/* 1. AI Trip Planner Quick Assistant */}
      <div className="relative overflow-hidden p-4 rounded-2xl bg-gradient-to-br from-lime-400/10 via-[#111827] to-[#0a0e1a] border border-[#d4f938]/25 shadow-sm group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#d4f938]/15 border border-[#d4f938]/30 flex items-center justify-center text-[#d4f938]">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#d4f938] font-mono">
              AI Trip Planner
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-mono font-semibold">
            Smart Budget
          </span>
        </div>

        <h4 className="text-sm font-bold text-white leading-snug">
          Custom Itinerary in Seconds
        </h4>
        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
          Generate day-by-day plans, realistic costs, and packing checklists across 280+ destinations.
        </p>

        {onOpenAiPlanner && (
          <button
            onClick={onOpenAiPlanner}
            className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-[#d4f938] hover:bg-[#c2e828] text-black text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-[#d4f938]/15 transition-all active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate Trip Plan</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Bookings & Saved Itineraries Section (Shows REAL saved trips!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-white tracking-tight">
              Bookings & Trips
            </h3>
            {savedTrips.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#d4f938] text-black font-bold font-mono">
                {savedTrips.length}
              </span>
            )}
          </div>
          {savedTrips.length > 0 && onViewAllTrips && (
            <button
              onClick={onViewAllTrips}
              className="text-xs font-semibold text-[#d4f938] hover:underline"
            >
              View All
            </button>
          )}
        </div>

        {savedTrips.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#111827] border border-slate-800 text-center space-y-2">
            <p className="text-xs text-slate-400">No saved itineraries yet.</p>
            {onOpenAiPlanner && (
              <button
                onClick={onOpenAiPlanner}
                className="w-full py-2 px-3 rounded-lg bg-[#d4f938]/10 hover:bg-[#d4f938]/20 border border-[#d4f938]/30 text-[#d4f938] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create AI Trip Plan</span>
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2.5">
            {savedTrips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onSelectTrip && onSelectTrip(trip)}
                className="flex items-center gap-3 p-2.5 bg-[#111827] hover:bg-[#162032] border border-slate-800 hover:border-slate-700/90 rounded-xl transition-all cursor-pointer group shadow-sm"
              >
                <img
                  src={trip.imageUrl}
                  alt={trip.destinationName}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80';
                  }}
                  className="w-12 h-12 rounded-lg object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-[#d4f938] transition-colors">
                    {trip.destinationName}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                    <CalendarIcon className="w-3 h-3 text-slate-400" />
                    <span>{trip.dates}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 block mb-0.5">
                    {trip.daysCount}D Plan
                  </span>
                  <span className="text-[10px] font-mono text-[#d4f938]">
                    ₹{(trip.totalCost).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. Live Weather Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-[#111827] to-slate-950 border border-cyan-900/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Live Weather: {selectedCity}</span>
          </div>
          <span className="text-[10px] text-cyan-400/80 font-mono">Open-Meteo</span>
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-white font-mono">
              {weather.temp}°
            </span>
            <span className="text-sm text-slate-400 font-medium">C</span>
          </div>
          <span className="text-xs font-medium text-cyan-300">
            {weather.condition}
          </span>
        </div>
        <div className="text-[11px] text-slate-400">
          Wind speed: {weather.windSpeed} km/h • High visibility
        </div>
      </div>

      {/* 4. Real-Data Train Booking Advisor Widget */}
      <div className="p-3.5 rounded-2xl bg-[#111827] border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Train className="w-4 h-4 text-amber-400" />
            <span>Train Booking Advisor</span>
          </div>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-bold">
            Real IRCTC
          </span>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">General ARP</span>
            <span className="font-bold text-[#d4f938] font-mono">60 Days @ 8 AM</span>
          </div>
          <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">AC Tatkal</span>
            <span className="font-bold text-cyan-300 font-mono">10:00 AM IST</span>
          </div>
          <div className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-slate-800">
            <span className="text-slate-400">Non-AC Tatkal</span>
            <span className="font-bold text-amber-300 font-mono">11:00 AM IST</span>
          </div>
        </div>

        {onOpenTrainAdvisor && (
          <button
            onClick={onOpenTrainAdvisor}
            className="w-full py-2 px-3 rounded-xl bg-[#d4f938]/10 hover:bg-[#d4f938]/20 border border-[#d4f938]/30 text-[#d4f938] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Launch Booking Advisor →</span>
          </button>
        )}
      </div>
    </aside>
  );
}
