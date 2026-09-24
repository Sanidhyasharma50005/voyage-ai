'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, MapPin, Navigation, X, Check, Train } from 'lucide-react';
import { RailwayStation, searchStations } from '@/data/railwayStations';

interface StationSearchInputProps {
  label: string;
  selectedStation: RailwayStation;
  onSelectStation: (station: RailwayStation) => void;
  placeholder?: string;
  showGpsButton?: boolean;
  onGpsClick?: () => void;
  isLocating?: boolean;
}

export function StationSearchInput({
  label,
  selectedStation,
  onSelectStation,
  placeholder = 'Search by station name or code (e.g. NDLS, Kanpur, HWH)...',
  showGpsButton = false,
  onGpsClick,
  isLocating = false,
}: StationSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute matched stations dynamically
  const results = useMemo(() => {
    return searchStations(query, 25);
  }, [query]);

  const handleSelect = (station: RailwayStation) => {
    onSelectStation(station);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="space-y-1.5 relative">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>{label}</span>
        </label>
        {showGpsButton && onGpsClick && (
          <button
            type="button"
            onClick={onGpsClick}
            disabled={isLocating}
            className="text-[11px] font-bold text-[#d4f938] hover:text-lime-300 flex items-center gap-1 cursor-pointer transition-colors disabled:opacity-50"
            title="Detect nearest railway station from your current GPS location"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Auto-Detect GPS'}</span>
          </button>
        )}
      </div>

      {/* Main Selected Input / Search Trigger */}
      <div className="relative">
        <div
          onClick={() => setIsOpen(true)}
          className={`w-full bg-[#162032] border ${
            isOpen ? 'border-[#d4f938] ring-1 ring-[#d4f938]/30' : 'border-slate-700'
          } rounded-xl px-3.5 py-2.5 flex items-center justify-between gap-2 cursor-pointer transition-all`}
        >
          <div className="flex items-center gap-2.5 truncate">
            <Train className="w-4 h-4 text-slate-400 shrink-0" />
            <div className="truncate">
              <span className="text-sm font-semibold text-white mr-2">
                {selectedStation.n}
              </span>
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-[#d4f938]/20 text-[#d4f938]">
                {selectedStation.c}
              </span>
              {selectedStation.s && (
                <span className="text-xs text-slate-400 ml-2">
                  ({selectedStation.s})
                </span>
              )}
            </div>
          </div>
          <span className="text-xs text-slate-400 shrink-0 font-medium hover:text-white">
            Change
          </span>
        </div>

        {/* Search Popover Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
            {/* Search Input field */}
            <div className="p-3 border-b border-slate-800 flex items-center gap-2 bg-[#162032]">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-sm text-white focus:outline-none placeholder:text-slate-500"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 custom-scrollbar">
              {results.length > 0 ? (
                results.map((st) => {
                  const isSelected = st.c === selectedStation.c;
                  return (
                    <div
                      key={st.c}
                      onClick={() => handleSelect(st)}
                      className={`p-3 flex items-center justify-between gap-2 hover:bg-[#1f2d42] cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#d4f938]/10' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                          <Train className="w-3.5 h-3.5 text-slate-300" />
                        </div>
                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white truncate">
                              {st.n}
                            </span>
                            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-[#d4f938]">
                              {st.c}
                            </span>
                          </div>
                          {st.s && (
                            <span className="text-xs text-slate-400 block truncate">
                              State: {st.s}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#d4f938] shrink-0" />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-6 text-center text-xs text-slate-400">
                  No stations found matching &quot;{query}&quot;. Try searching by station code (e.g. NDLS, HWH) or city name.
                </div>
              )}
            </div>

            {/* Dropdown footer info */}
            <div className="px-3 py-2 bg-[#0d131f] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Showing {results.length} stations</span>
              <span className="text-[#d4f938] font-mono">8,989 Stations in India</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
