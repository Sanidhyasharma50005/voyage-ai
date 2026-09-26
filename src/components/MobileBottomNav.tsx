'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Compass,
  Sparkles,
  Train,
  Menu,
  X,
  Navigation,
  BookmarkCheck,
  Hotel,
  Heart,
  Settings,
  ArrowRight,
  User,
  Zap
} from 'lucide-react';
import { NavTab } from './Sidebar';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '@/context/AuthContext';

interface MobileBottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
  savedTripsCount?: number;
  onOpenAiPlanner: () => void;
  onOpenPromo: () => void;
  onOpenProfile?: () => void;
}

export function MobileBottomNav({
  currentTab,
  onSelectTab,
  favoritesCount,
  savedTripsCount = 0,
  onOpenAiPlanner,
  onOpenPromo,
  onOpenProfile,
}: MobileBottomNavProps) {
  const { user, profile, isPro, setIsAuthModalOpen } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleTabClick = (tab: NavTab) => {
    onSelectTab(tab);
    setIsMenuOpen(false);
    if (tab === 'ai-planner') {
      onOpenAiPlanner();
    }
  };

  const moreBadgeCount = (savedTripsCount > 0 ? 1 : 0) + (favoritesCount > 0 ? 1 : 0);

  return (
    <>
      {/* 1. Slide-over Mobile Menu Drawer (for extra tabs: Radar, Stays, Trips, Favs, Settings) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Sheet */}
          <div className="relative bg-[#0d1322] border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <BrandLogo size="sm" showSubtitle={false} />
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Profile Quick Bar */}
            <div className="p-3.5 rounded-2xl bg-[#162032] border border-slate-700/80 flex items-center justify-between">
              <div
                onClick={() => {
                  setIsMenuOpen(false);
                  if (user && onOpenProfile) {
                    onOpenProfile();
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-teal-500 p-0.5 shrink-0 flex items-center justify-center text-black font-bold text-xs">
                  {profile?.avatar_url || user?.user_metadata?.avatar_url ? (
                    <img
                      src={profile?.avatar_url || user?.user_metadata?.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{(profile?.full_name || user?.email || 'V')[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-bold text-white block truncate">
                    {profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Guest Traveler'}
                  </span>
                  <span className={`text-[10px] font-mono font-bold uppercase ${isPro ? 'text-[#d4f938]' : 'text-slate-400'}`}>
                    {isPro ? '⭐ Pro Member' : 'Free Explorer · Tap to Sign In'}
                  </span>
                </div>
              </div>

              {!isPro && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenPromo();
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-[#d4f938] text-black text-[11px] font-extrabold shrink-0 ml-2 shadow-md shadow-[#d4f938]/20 flex items-center gap-1"
                >
                  <Zap className="w-3 h-3 fill-black" />
                  <span>50% OFF</span>
                </button>
              )}
            </div>

            {/* Menu Nav Links Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* My Itineraries */}
              <button
                onClick={() => handleTabClick('trips')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  currentTab === 'trips'
                    ? 'bg-[#d4f938]/15 border-[#d4f938] text-[#d4f938]'
                    : 'bg-[#111827] border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <BookmarkCheck className="w-5 h-5 text-[#d4f938]" />
                  {savedTripsCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#d4f938] text-black">
                      {savedTripsCount}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">My Trips</span>
                  <span className="text-[10px] text-slate-400">Saved itineraries</span>
                </div>
              </button>

              {/* Favourites */}
              <button
                onClick={() => handleTabClick('favourites')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  currentTab === 'favourites'
                    ? 'bg-rose-500/15 border-rose-500 text-rose-300'
                    : 'bg-[#111827] border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500/30" />
                  {favoritesCount > 0 && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-rose-500 text-white">
                      {favoritesCount}
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">Favourites</span>
                  <span className="text-[10px] text-slate-400">Bookmarked spots</span>
                </div>
              </button>

              {/* Hotels, Hostels & Dorms */}
              <button
                onClick={() => handleTabClick('stays')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  currentTab === 'stays'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300'
                    : 'bg-[#111827] border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <Hotel className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Hotels &amp; Hostels</span>
                  <span className="text-[10px] text-slate-400">Verified backpacker stays</span>
                </div>
              </button>

              {/* Near Me GPS Radar */}
              <button
                onClick={() => handleTabClick('nearme')}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all ${
                  currentTab === 'nearme'
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300'
                    : 'bg-[#111827] border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                <Navigation className="w-5 h-5 text-teal-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Near Me Radar</span>
                  <span className="text-[10px] text-slate-400">GPS distance sort</span>
                </div>
              </button>
            </div>

            {/* Pro Upgrade Pass Promo Card */}
            <div
              onClick={() => {
                setIsMenuOpen(false);
                onOpenPromo();
              }}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-lime-500/10 via-slate-900 to-[#111827] border border-[#d4f938]/30 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#d4f938]/20 flex items-center justify-center text-xl shrink-0">
                  {isPro ? '👑' : '🎒'}
                </div>
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isPro ? 'Voyage Pro Member Active' : 'Upgrade to Voyage Pro · ₹299'}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {isPro ? 'Cloud PostgreSQL sync enabled' : 'Unlimited Gemini AI & priority IRCTC alerts'}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-[#d4f938] shrink-0" />
            </div>

            {/* Settings & Profile Links */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleTabClick('settings')}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Settings</span>
              </button>

              {onOpenProfile && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5 text-[#d4f938]" />
                  <span>Profile</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Fixed Bottom Navigation Bar for Mobile */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#070a13]/95 backdrop-blur-xl border-t border-slate-800/90 px-3 py-2 lg:hidden flex items-center justify-around shadow-2xl safe-area-pb"
      >
        {/* 1. Dashboard (Home) */}
        <button
          onClick={() => handleTabClick('dashboard')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'dashboard'
              ? 'text-[#d4f938]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Home</span>
        </button>

        {/* 2. Explore */}
        <button
          onClick={() => handleTabClick('explore')}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'explore'
              ? 'text-[#d4f938]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Explore</span>
        </button>

        {/* 3. Central AI Trip Planner Button (Electric Lime Float) */}
        <button
          onClick={() => {
            onOpenAiPlanner();
          }}
          className="relative -top-3 flex flex-col items-center justify-center cursor-pointer group"
          title="Create AI Trip Plan"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#d4f938] to-lime-300 text-black flex items-center justify-center shadow-lg shadow-lime-500/30 group-hover:scale-105 active:scale-95 transition-transform border-4 border-[#070a13]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <span className="text-[10px] font-extrabold text-[#d4f938] mt-0.5 tracking-tight">
            AI Plan
          </span>
        </button>

        {/* 4. Transport (IRCTC Trains) */}
        <button
          onClick={() => handleTabClick('transport')}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            currentTab === 'transport'
              ? 'text-[#d4f938]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Train className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">Trains</span>
          <span className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
        </button>

        {/* 5. More / Menu Drawer Trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            isMenuOpen || currentTab === 'trips' || currentTab === 'stays' || currentTab === 'favourites' || currentTab === 'nearme' || currentTab === 'settings'
              ? 'text-[#d4f938]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1 tracking-tight">More</span>

          {moreBadgeCount > 0 && (
            <span className="absolute top-0.5 right-1.5 w-2 h-2 rounded-full bg-[#d4f938] border border-[#070a13]" />
          )}
        </button>
      </nav>
    </>
  );
}
