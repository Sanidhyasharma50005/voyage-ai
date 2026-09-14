'use client';

import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  MapPin,
  Calendar,
  Sparkles,
  Heart,
  Compass,
  Award,
  Check,
  Edit3,
  BookmarkCheck,
  Camera,
  LogOut
} from 'lucide-react';
import { SavedTrip } from '@/types/travel';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  travelerName: string;
  onUpdateName: (name: string) => void;
  savedTripsCount: number;
  favoritesCount: number;
  onViewTrips: () => void;
}

export function ProfileModal({
  isOpen,
  onClose,
  travelerName,
  onUpdateName,
  savedTripsCount,
  favoritesCount,
  onViewTrips,
}: ProfileModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(travelerName);
  const [emailInput, setEmailInput] = useState('sanidhya@voyage.in');
  const [locationInput, setLocationInput] = useState('New Delhi, India');
  const [bioInput, setBioInput] = useState(
    'Passionate backpacker exploring the hidden gems of India, from high Himalayan passes to serene coastal backwaters. Voyage AI curator.'
  );

  if (!isOpen) return null;

  const handleSave = () => {
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0d1322] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 flex flex-col">
        {/* Cover Background Banner */}
        <div className="relative h-36 bg-gradient-to-r from-cyan-900/60 via-slate-900 to-emerald-950/60 p-6 flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-[#d4f938] text-black font-extrabold px-2.5 py-0.5 rounded-full">
              Verified Explorer
            </span>
            <span className="text-xs text-slate-300 font-mono">Member since 2024</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar & Header Info */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <div className="relative w-24 h-24 rounded-full ring-4 ring-[#0d1322] overflow-hidden bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80"
                  alt="Profile Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
                <button
                  title="Change avatar photo"
                  onClick={() => alert('Photo upload simulated! Avatar updated.')}
                  className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-[#d4f938] text-black flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-extrabold text-white leading-tight">
                    {travelerName}
                  </h2>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#d4f938]/20 text-[#d4f938] border border-[#d4f938]/30 font-bold font-mono">
                    PRO
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{locationInput}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors self-start sm:self-auto border border-slate-700"
            >
              {isEditing ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#d4f938]" />
                  <span>Save Profile</span>
                </>
              ) : (
                <>
                  <Edit3 className="w-3.5 h-3.5 text-slate-300" />
                  <span>Edit Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Edit Form or Bio View */}
          {isEditing ? (
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 mb-6 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4f938]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Home Base / City
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4f938]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Traveler Bio
                </label>
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#d4f938]"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-slate-900/50 p-3 rounded-xl border border-slate-800/80">
              {bioInput}
            </p>
          )}

          {/* Travel Stats Metrics */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div
              onClick={() => {
                onClose();
                onViewTrips();
              }}
              className="p-3.5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-[#d4f938]/40 cursor-pointer transition-all text-center group"
            >
              <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-xl bg-cyan-500/10 text-cyan-400 mb-1 group-hover:scale-110 transition-transform">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-mono block">
                {savedTripsCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider group-hover:text-[#d4f938] transition-colors">
                Saved Trips
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111827] border border-slate-800 text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-xl bg-rose-500/10 text-rose-400 mb-1">
                <Heart className="w-4 h-4 fill-rose-500/20" />
              </div>
              <span className="text-lg font-bold text-white font-mono block">
                {favoritesCount}
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Bookmarks
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#111827] border border-slate-800 text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto rounded-xl bg-amber-500/10 text-amber-400 mb-1">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-[#d4f938] font-mono block">
                Level 5
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">
                Explorer Rank
              </span>
            </div>
          </div>

          {/* Travel Style Badges */}
          <div className="space-y-2 mb-6">
            <span className="text-xs font-bold text-white uppercase tracking-wider block">
              Traveler Profile & Badges
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#d4f938]/15 text-[#d4f938] border border-[#d4f938]/30">
                ⚡ Solo Backpacker
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                🚆 Vande Bharat Enthusiast
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                🏔️ Himalayan Pass Pioneer
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                🍛 Regional Street Foodie
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                🤖 AI Itinerary Curator
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => {
                alert('Voyage Pro is currently running in local mode.');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch Account</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onViewTrips();
              }}
              className="px-5 py-2.5 rounded-xl bg-[#d4f938] hover:bg-[#bde629] text-black font-extrabold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#d4f938]/20"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>View My Saved Itineraries ({savedTripsCount})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
