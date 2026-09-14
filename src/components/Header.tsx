'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, Sparkles, X, MapPin, CornerDownLeft, Compass } from 'lucide-react';
import { ALL_DESTINATIONS } from '@/data/destinations';
import { searchDestinations, SearchResult } from '@/lib/searchEngine';
import { Destination } from '@/types/travel';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: () => void;
  onOpenAiPlanner: () => void;
  onOpenProfile?: () => void;
  travelerName?: string;
  onSelectDestination?: (dest: Destination) => void;
  userLocation?: { lat: number; lng?: number; lon?: number } | null;
}

export function Header({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenAiPlanner,
  onOpenProfile,
  travelerName = 'SANIDHYA',
  onSelectDestination,
  userLocation,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search for autocomplete suggestions (150ms)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(() => {
      const results = searchDestinations(ALL_DESTINATIONS, trimmed, {
        userLocation,
        limit: 6,
        minScore: 50,
      });
      setSuggestions(results);
      setIsOpen(results.length > 0);
      setActiveIndex(-1);
    }, 150);

    return () => clearTimeout(timer);
  }, [searchQuery, userLocation]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (item: SearchResult) => {
      onSearchChange(item.destination.name);
      setIsOpen(false);
      if (onSelectDestination) {
        onSelectDestination(item.destination);
      } else {
        onSearchSubmit();
      }
    },
    [onSearchChange, onSelectDestination, onSearchSubmit]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        onSearchSubmit();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          handleSelect(suggestions[activeIndex]);
        } else {
          setIsOpen(false);
          onSearchSubmit();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setActiveIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Check top suggestion for typo-correction / "Did you mean?" banner
  const topResult = suggestions.length > 0 ? suggestions[0] : null;
  const showTypoBadge = topResult?.isAutoCorrected && topResult.suggestedTerm;

  return (
    <header className="h-20 bg-[#0a0e1a]/85 backdrop-blur-md border-b border-slate-800/80 px-8 flex items-center justify-between gap-6 sticky top-0 z-30">
      {/* Search Bar with Accessible WAI-ARIA Combobox Autocomplete */}
      <div ref={containerRef} className="flex-1 max-w-2xl flex items-center gap-2 relative">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-controls="search-autocomplete-listbox"
            aria-activedescendant={activeIndex >= 0 ? `search-opt-${activeIndex}` : undefined}
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (suggestions.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search all Indian destinations, states, hills, beaches, heritage... (e.g. Andaman, Kashmir, Munnar)"
            className="w-full bg-[#111827] border border-slate-700/60 rounded-xl pl-11 pr-16 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#d4f938] focus:ring-1 focus:ring-[#d4f938] transition-all"
          />

          {searchQuery && (
            <button
              onClick={() => {
                onSearchChange('');
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/60 px-2 py-0.5 rounded-md hover:bg-slate-700 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}

          {/* Autocomplete Dropdown Menu */}
          {isOpen && suggestions.length > 0 && (
            <div
              id="search-autocomplete-listbox"
              role="listbox"
              aria-label="Search suggestions"
              className="absolute left-0 right-0 top-full mt-2 bg-[#0f172a] border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150"
            >
              {/* Optional "Did You Mean / Auto-Correct" Header */}
              {showTypoBadge && (
                <div className="px-4 py-2 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-transparent border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>
                      Did you mean{' '}
                      <strong className="text-[#d4f938] underline decoration-dotted">
                        {topResult.suggestedTerm}
                      </strong>
                      ? Showing smart fuzzy results.
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                    Typo Tolerant
                  </span>
                </div>
              )}

              <ul className="py-1 divide-y divide-slate-800/50 max-h-[380px] overflow-y-auto">
                {suggestions.map((item, index) => {
                  const isSelected = activeIndex === index;
                  const dest = item.destination;

                  return (
                    <li
                      key={dest.id}
                      id={`search-opt-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`px-4 py-3 cursor-pointer flex items-center justify-between gap-4 transition-colors ${
                        isSelected
                          ? 'bg-[#d4f938]/10 text-white'
                          : 'hover:bg-slate-800/60 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-800 border border-slate-700/50">
                          <img
                            src={dest.imageUrl}
                            alt={dest.name}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80';
                            }}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm truncate text-white">
                              {dest.name}
                            </span>
                            {dest.destinationGroup && (
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                                {dest.destinationGroup}
                              </span>
                            )}
                            {item.isAutoCorrected && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                                Auto-corrected
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                              {dest.state}
                              {dest.country !== 'India' ? `, ${dest.country}` : ''}
                            </span>

                            {item.explanation && (
                              <>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400 italic truncate text-[11px]">
                                  {item.explanation}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 text-right">
                        <span className="text-xs font-semibold text-[#d4f938]">
                          ₹{dest.startingPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {dest.category.toUpperCase()}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-3">
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                      ↑
                    </kbd>{' '}
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                      ↓
                    </kbd>{' '}
                    navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                      ↵
                    </kbd>{' '}
                    select
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                      esc
                    </kbd>{' '}
                    dismiss
                  </span>
                </div>
                <span className="text-slate-500">200+ Destinations across India</span>
              </div>
            </div>
          )}
        </div>

        {/* Bright Electric Lime "Search" Button */}
        <button
          onClick={() => {
            setIsOpen(false);
            onSearchSubmit();
          }}
          className="bg-[#d4f938] hover:bg-[#bde629] text-black font-semibold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md shadow-[#d4f938]/15 hover:shadow-[#d4f938]/30 active:scale-95 shrink-0"
        >
          Search
        </button>
      </div>

      {/* Right Controls: AI Assistant Trigger + Notification + Profile */}
      <div className="flex items-center gap-4">
        {/* Quick AI Planner Button */}
        <button
          onClick={onOpenAiPlanner}
          className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-blue-500/15 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-semibold transition-all hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>AI Itinerary</span>
        </button>

        {/* Notification Bell with indicator dot */}
        <button
          onClick={() =>
            alert(
              'Notifications:\n1. 🏝️ Andaman high-speed ferries operating normal schedules.\n2. 🚆 IRCTC 120-day quota open for Kashmir & South India journeys.'
            )
          }
          className="relative w-10 h-10 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
        </button>

        {/* User Avatar Badge — Clickable to View Profile */}
        <button
          onClick={onOpenProfile}
          type="button"
          title="Click to view traveler profile"
          className="flex items-center gap-3 pl-2 border-l border-slate-800 hover:opacity-95 transition-all group text-left cursor-pointer focus:outline-none"
        >
          <div className="relative w-10 h-10 rounded-full ring-2 ring-[#d4f938]/50 group-hover:ring-[#d4f938] overflow-hidden bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-md transition-transform group-hover:scale-105">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80"
              alt="User Avatar"
              className="w-full h-full object-cover rounded-full"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d4f938] border-2 border-[#0a0e1a]"></span>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-sm font-bold text-white leading-tight group-hover:text-[#d4f938] transition-colors">
              {travelerName}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">Traveler Pro</span>
          </div>
        </button>
      </div>
    </header>
  );
}
