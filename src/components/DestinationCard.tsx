'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Star, MapPin, Calendar, Compass } from 'lucide-react';
import { Destination } from '@/types/travel';

const CATEGORY_FALLBACKS: Record<string, string> = {
  hills: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
  beaches: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  heritage: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80',
  wildlife: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=80',
  spiritual: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
  backwaters: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80',
};
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80';

interface DestinationCardProps {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (destination: Destination) => void;
  distanceKm?: number | null;
}

export function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
  onSelect,
  distanceKm,
}: DestinationCardProps) {
  const [imgSrc, setImgSrc] = useState(destination.imageUrl);

  useEffect(() => {
    setImgSrc(destination.imageUrl);
  }, [destination.imageUrl]);

  return (
    <div
      onClick={() => onSelect(destination)}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 bg-[#111827] hover:bg-[#162032] border border-slate-800 hover:border-slate-700/80 rounded-2xl cursor-pointer group transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-900">
        <img
          src={imgSrc}
          alt={destination.name}
          loading="lazy"
          onError={() => {
            const fallback = CATEGORY_FALLBACKS[destination.category] || DEFAULT_FALLBACK;
            if (imgSrc !== fallback) {
              setImgSrc(fallback);
            }
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Floating Heart Bookmark Button (from Image 1 & 2) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(destination.id);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-transform"
        >
          <Heart
            className={`w-3 h-3 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white'
            }`}
          />
        </button>

        {/* Category badge */}
        <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-cyan-300">
          {destination.category}
        </span>
      </div>

      {/* Info details */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-1">
          <h4 className="font-bold text-sm text-white truncate group-hover:text-cyan-300 transition-colors">
            {destination.name.split('&')[0].trim()}
          </h4>
          <div className="flex items-center gap-1 text-xs text-amber-400 shrink-0">
            <Star className="w-3 h-3 fill-amber-400" />
            <span className="font-bold">{destination.rating}</span>
          </div>
        </div>

        {/* Location & State */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="truncate">{destination.state}, {destination.country}</span>
        </div>

        {/* Near Me Distance if calculated */}
        {distanceKm !== undefined && distanceKm !== null && (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-800/50">
            <Compass className="w-3 h-3" />
            <span>{distanceKm.toFixed(0)} km away</span>
          </div>
        )}

        {/* Daily price pill matching Image 2: "₹ 248 / day" in neon lime */}
        <div className="flex items-center justify-between pt-1">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#d4f938] font-mono bg-[#d4f938]/10 px-2.5 py-1 rounded-lg border border-[#d4f938]/20">
            <span>₹ {destination.dailyCostBudget}</span>
            <span className="text-[10px] text-slate-400 font-normal">/ day</span>
          </div>

          <span
            className="text-[11px] text-slate-400 hidden sm:inline max-w-[140px] truncate"
            title={destination.bestSeason}
          >
            Best: {destination.bestSeason.split('(')[0].split('&')[0].trim()}
          </span>
        </div>
      </div>
    </div>
  );
}
