'use client';

import React from 'react';
import { Heart, ChevronRight, Sparkles } from 'lucide-react';
import { Destination } from '@/types/travel';

interface EasyVisaCarouselProps {
  destinations: Destination[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectDestination: (destination: Destination) => void;
  onViewAll: () => void;
}

export function EasyVisaCarousel({
  destinations,
  favorites,
  onToggleFavorite,
  onSelectDestination,
  onViewAll,
}: EasyVisaCarouselProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Easy Visa Destinations
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium">
            Handpicked
          </span>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs font-semibold text-slate-400 hover:text-[#d4f938] transition-colors flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex items-center gap-5 overflow-x-auto pb-3 no-scrollbar scroll-smooth">
        {destinations.map((dest) => {
          const isFav = favorites.includes(dest.id);

          return (
            <div
              key={dest.id}
              onClick={() => onSelectDestination(dest)}
              className="relative w-64 sm:w-80 shrink-0 h-44 sm:h-48 rounded-2xl overflow-hidden cursor-pointer group border border-slate-800/80 hover:border-slate-700 transition-all duration-300 shadow-lg hover:shadow-cyan-950/20"
            >
              {/* Destination Photo */}
              <img
                src={dest.imageUrl}
                alt={dest.name}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />

              {/* Heart Bookmark Button (Inspired by Image 1 & 2) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(dest.id);
                }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform z-10"
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    isFav ? 'fill-rose-500 text-rose-500' : 'text-white'
                  }`}
                />
              </button>

              {/* Easy Visa / Fast Track Tag */}
              {dest.isEasyVisa && (
                <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                  Visa on Arrival
                </span>
              )}

              {/* Bottom Information Bar matching Image 2 */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white leading-tight drop-shadow-sm">
                    {dest.name.split(' ')[0]}
                  </h3>
                  <p className="text-[11px] text-slate-300 font-medium">
                    {dest.country}
                  </p>
                </div>

                {/* Starting Price Pill matching Image 2 ("Starting at ₹ 19,600") */}
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-300 uppercase tracking-wider">
                    Starting at
                  </span>
                  <span className="text-xs font-bold text-[#d4f938] font-mono">
                    ₹ {dest.startingPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
