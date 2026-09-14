'use client';

import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export function BrandLogo({ size = 'md', showSubtitle = true }: BrandLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      {/* Camper Van + Sunset Palm Badge (Inspired by Image 1) */}
      <div
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 shadow-md transition-transform group-hover:scale-105 ${
          isSm ? 'w-9 h-9' : isLg ? 'w-14 h-14' : 'w-11 h-11'
        }`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={isSm ? 'w-6 h-6' : isLg ? 'w-9 h-9' : 'w-7 h-7'}
        >
          {/* Sunset Sun */}
          <circle cx="27" cy="21" r="10" fill="#f97316" />
          <circle cx="27" cy="21" r="7" fill="#fbbf24" />

          {/* Palm Tree */}
          <path
            d="M13 36 C14 26 18 19 23 15"
            stroke="#0f172a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M23 15 C20 12 14 13 11 15 M23 15 C22 10 18 8 15 8 M23 15 C25 10 28 8 31 8 M23 15 C26 12 30 13 33 15"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Camper Van Silhouette */}
          <rect x="18" y="24" width="18" height="12" rx="3" fill="#ffffff" />
          <rect x="20" y="26" width="6" height="5" rx="1" fill="#0f172a" />
          <rect x="28" y="26" width="6" height="5" rx="1" fill="#0f172a" />
          <path d="M18 29 L36 29" stroke="#06b6d4" strokeWidth="1.5" />
          <circle cx="22" cy="36" r="2.5" fill="#0f172a" />
          <circle cx="32" cy="36" r="2.5" fill="#0f172a" />
        </svg>

        {/* Live green dot indicator from Image 2 */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d4f938] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#d4f938] border-2 border-[#090d16]"></span>
        </span>
      </div>

      {/* Typography: "Voyage" cursive branding + Smart Travel Assistant */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif tracking-tight font-extrabold italic text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300 ${
              isSm ? 'text-xl' : isLg ? 'text-3xl' : 'text-2xl'
            }`}
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Voyage
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#d4f938] text-black font-mono">
            Pro
          </span>
        </div>
        {showSubtitle && (
          <span className="text-[11px] text-slate-400 font-medium tracking-wide">
            AI Travel Assistant
          </span>
        )}
      </div>
    </div>
  );
}
