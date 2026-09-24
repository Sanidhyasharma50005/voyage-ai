'use client';

import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Navigation,
  Sparkles,
  Hotel,
  Heart,
  Train,
  Settings,
  LogOut,
  ArrowRight,
  BookmarkCheck
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';

import { useAuth } from '@/context/AuthContext';

export type NavTab =
  | 'dashboard'
  | 'explore'
  | 'nearme'
  | 'ai-planner'
  | 'trips'
  | 'stays'
  | 'favourites'
  | 'transport'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  favoritesCount: number;
  savedTripsCount?: number;
  onOpenAiPlanner: () => void;
  onOpenPromo: () => void;
}

export function Sidebar({
  currentTab,
  onSelectTab,
  favoritesCount,
  savedTripsCount = 0,
  onOpenAiPlanner,
  onOpenPromo,
}: SidebarProps) {
  const { isPro } = useAuth();
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'explore' as NavTab, label: 'Explore Places', icon: Compass },
    { id: 'nearme' as NavTab, label: 'Near Me Radar', icon: Navigation },
    { id: 'ai-planner' as NavTab, label: 'AI Trip Planner', icon: Sparkles, badge: 'AI' },
    { id: 'trips' as NavTab, label: 'My Itineraries', icon: BookmarkCheck, count: savedTripsCount },
    { id: 'stays' as NavTab, label: 'Hotels, Dorms & Hostels', icon: Hotel },
    { id: 'favourites' as NavTab, label: 'Favourites', icon: Heart, count: favoritesCount },
    { id: 'transport' as NavTab, label: 'Transport Advisor', icon: Train, badge: 'IRCTC' },
    { id: 'settings' as NavTab, label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#070a13] border-r border-slate-800/80 p-5 flex flex-col justify-between shrink-0 select-none">
      {/* Top: Logo & Main Navigation */}
      <div className="space-y-7">
        <div className="pt-1 pb-2">
          <BrandLogo />
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (item.id === 'ai-planner') {
                    onOpenAiPlanner();
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#d4f938] text-black font-semibold shadow-lg shadow-[#d4f938]/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-black' : 'text-slate-400 group-hover:text-cyan-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {/* Optional Badges */}
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive
                        ? 'bg-black/15 text-black'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : item.id === 'trips'
                        ? 'bg-[#d4f938]/20 text-[#d4f938] border border-[#d4f938]/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: 50% Promo Box from Image 2 & Logout */}
      <div className="space-y-4 pt-4 border-t border-slate-800/60">
        {/* Promo / Pro Plan Card */}
        <div
          onClick={onOpenPromo}
          className={`relative overflow-hidden rounded-2xl border p-4 cursor-pointer transition-all group ${
            isPro
              ? 'bg-gradient-to-br from-lime-500/15 via-[#111827] to-[#0a0e1a] border-[#d4f938]/40 hover:border-[#d4f938]'
              : 'bg-gradient-to-br from-lime-400/10 via-slate-900 to-slate-950 border-lime-400/20 hover:border-lime-400/50'
          }`}
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#d4f938] uppercase tracking-wider mb-1">
                <span>{isPro ? '⭐ Active Status' : 'Special Promo'}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-tight">
                {isPro ? 'Voyage Pro Member' : '50% Off Pro Pass'}
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug line-clamp-2">
                {isPro
                  ? 'Unlimited AI & Cloud PostgreSQL Sync Active'
                  : 'Upgrade for ₹299: Unlimited AI & Cloud Sync'}
              </p>
            </div>

            {/* Mascot Icon & Circular CTA Arrow */}
            <div className="flex flex-col items-center justify-between h-full pt-1">
              <span className="text-xl">{isPro ? '👑' : '🎒'}</span>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center mt-2 shadow-md group-hover:translate-x-0.5 transition-transform ${
                isPro ? 'bg-[#d4f938] text-black' : 'bg-[#f97316] text-white'
              }`}>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* User Account Info */}
        <div className="px-3 py-2 text-xs font-medium text-slate-400 rounded-lg flex items-center justify-between">
          <span>Voyage Pro v1.2</span>
          <span className="text-[#d4f938] font-mono">India Live</span>
        </div>
      </div>
    </aside>
  );
}
