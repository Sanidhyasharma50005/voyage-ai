'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, Sparkles, X, MapPin, CornerDownLeft, Compass, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ALL_DESTINATIONS } from '@/data/destinations';
import { searchDestinations, SearchResult } from '@/lib/searchEngine';
import { Destination } from '@/types/travel';
import { BrandLogo } from './BrandLogo';

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
  const { user, profile, isPro, setIsAuthModalOpen } = useAuth();
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
    <header className="bg-[#0a0e1a]/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 sm:px-6 lg:px-8 py-2.5 lg:py-0 lg:h-20 sticky top-0 z-30">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-2.5 lg:gap-6">
        {/* Mobile Top Row: Logo on left, Notification & Profile on right (Hidden on lg+) */}
        <div className="flex items-center justify-between lg:hidden w-full">
          <BrandLogo size="sm" showSubtitle={false} />

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <button
              onClick={() =>
                alert(
                  'Notifications:\n1. 🏝️ Andaman high-speed ferries operating normal schedules.\n2. 🚆 IRCTC 60-day ARP quota open for Kashmir & South India journeys.'
                )
              }
              className="relative w-8 h-8 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
            </button>

            {/* User Profile Avatar or Sign In CTA on mobile */}
            {user ? (
              <button
                onClick={onOpenProfile}
                type="button"
                className="relative w-8 h-8 rounded-full ring-2 ring-[#d4f938]/50 overflow-hidden bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-md flex items-center justify-center cursor-pointer"
              >
                {profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img
                    src={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#162032] flex items-center justify-center font-bold text-white text-xs rounded-full">
                    {(profile?.full_name || user.email || 'T')[0].toUpperCase()}
                  </div>
                )}
                {isPro && (
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#d4f938] border-2 border-[#0a0e1a]"></span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 hover:border-[#d4f938] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <UserIcon className="w-3.5 h-3.5 text-[#d4f938]" />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar with Accessible WAI-ARIA Combobox Autocomplete (Full-width on mobile, flex-1 on lg) */}
        <div ref={containerRef} className="w-full lg:flex-1 lg:max-w-2xl flex items-center gap-1.5 sm:gap-2 relative min-w-0">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
              placeholder="Search destinations, states, hills... (e.g. Goa, Manali)"
              className="w-full bg-[#111827] border border-slate-700/60 rounded-xl pl-9 sm:pl-11 pr-10 sm:pr-16 py-2 sm:py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-[#d4f938] focus:ring-1 focus:ring-[#d4f938] transition-all"
            />

            {searchQuery && (
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search query"
                className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/60 px-1.5 sm:px-2 py-0.5 rounded-md hover:bg-slate-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            {/* Autocomplete Dropdown Menu */}
            {isOpen && suggestions.length > 0 && (
              <div
                id="search-autocomplete-listbox"
                role="listbox"
              aria-label="Search suggestions"
              className="absolute left-0 right-0 top-full mt-2 bg-[#0f172a] border border-slate-700/90 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden z-50 animate-slideInFromTop"
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

        {/* Bright Electric Lime "Search" Button (Icon on mobile, text on sm+) */}
        <button
          onClick={() => {
            setIsOpen(false);
            onSearchSubmit();
          }}
          className="bg-[#d4f938] hover:bg-[#bde629] text-black font-semibold text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-2.5 rounded-xl transition-all shadow-md shadow-[#d4f938]/15 hover:shadow-[#d4f938]/30 active:scale-95 shrink-0 flex items-center justify-center gap-1.5"
          title="Search destinations"
        >
          <Search className="w-3.5 h-3.5 sm:hidden" />
          <span className="hidden sm:inline">Search</span>
        </button>
      </div>

        {/* Desktop Right Controls (hidden on mobile, rendered on top bar on mobile) */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Quick AI Planner Button */}
          <button
            onClick={onOpenAiPlanner}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500/15 via-teal-500/15 to-blue-500/15 border border-cyan-500/30 text-cyan-300 hover:text-white hover:border-cyan-400 text-xs font-semibold transition-all hover:scale-105 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>AI Itinerary</span>
          </button>

          {/* Notification Bell with indicator dot */}
          <button
            onClick={() =>
              alert(
                'Notifications:\n1. 🏝️ Andaman high-speed ferries operating normal schedules.\n2. 🚆 IRCTC 60-day ARP quota open for Kashmir & South India journeys.'
              )
            }
            className="relative w-10 h-10 rounded-xl bg-[#111827] border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500"></span>
          </button>

          {/* User Account / Profile Badge or Sign In CTA */}
          {user ? (
            <button
              onClick={onOpenProfile}
              type="button"
              title="Click to view traveler profile"
              className="flex items-center gap-3 pl-2 border-l border-slate-800 hover:opacity-95 transition-all group text-left cursor-pointer focus:outline-none"
            >
              <div className="relative w-10 h-10 rounded-full ring-2 ring-[#d4f938]/50 group-hover:ring-[#d4f938] overflow-hidden bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-md transition-transform group-hover:scale-105 flex items-center justify-center">
                {profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                  <img
                    src={profile?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-[#162032] flex items-center justify-center font-bold text-white text-xs rounded-full">
                    {(profile?.full_name || user.email || 'T')[0].toUpperCase()}
                  </div>
                )}
                {isPro && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d4f938] border-2 border-[#0a0e1a]"></span>
                )}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white leading-tight group-hover:text-[#d4f938] transition-colors truncate max-w-[120px]">
                  {profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || travelerName}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isPro ? 'text-[#d4f938]' : 'text-slate-400'}`}>
                  {isPro ? 'Voyage Pro' : 'Free Explorer'}
                </span>
              </div>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 hover:border-[#d4f938] text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <UserIcon className="w-3.5 h-3.5 text-[#d4f938]" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
