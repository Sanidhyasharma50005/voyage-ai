'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Train,
  Clock,
  Calendar,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Check,
  Bell,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Navigation,
  Compass,
  Search,
  CheckCircle2,
  RefreshCw,
  Star,
  Utensils,
  AlertCircle,
  Zap,
  TrendingUp,
  Plane,
  Bus
} from 'lucide-react';
import { Destination } from '@/types/travel';
import { DESTINATIONS } from '@/data/destinations';
import {
  ALL_RAILWAY_STATIONS,
  POPULAR_STATIONS,
  findNearbyStations,
  findNearestStation,
  RailwayStation,
  NearbyStationItem,
} from '@/data/railwayStations';
import {
  getRouteTrainSheets,
  TrainRouteItem,
  DateAvailabilityTab,
  EarliestConfirmedSummary,
} from '@/lib/trainAvailabilityEngine';
import { StationSearchInput } from './StationSearchInput';
import { FlightBookingAdvisor } from './FlightBookingAdvisor';
import { BusBookingAdvisor } from './BusBookingAdvisor';

export interface TrainBookingAdvisorProps {
  initialDestination?: Destination | null;
  userCoords?: { lat: number; lon: number } | null;
  initialMode?: 'train' | 'flight' | 'bus';
}

export function TrainBookingAdvisor({ initialDestination, userCoords, initialMode = 'train' }: TrainBookingAdvisorProps = {}) {
  // Multi-modal transport tab: 'train' | 'flight' | 'bus'
  const [transportMode, setTransportMode] = useState<'train' | 'flight' | 'bus'>(initialMode);

  useEffect(() => {
    if (initialMode) {
      setTransportMode(initialMode);
    }
  }, [initialMode]);

  // Destination mode: 'holiday' or 'station'
  const [destinationMode, setDestinationMode] = useState<'holiday' | 'station'>('holiday');

  // Destination ID: default to initialDestination or 'agra'
  const [toDestinationId, setToDestinationId] = useState<string>(() => {
    return initialDestination?.id || 'agra';
  });

  const [destStation, setDestStation] = useState<RailwayStation>(() => {
    return ALL_RAILWAY_STATIONS.find((s) => s.c === 'AGC') || // Agra Cantt
           ALL_RAILWAY_STATIONS.find((s) => s.c === 'MAO') || // Madgaon
           ALL_RAILWAY_STATIONS[0];
  });

  // Nearby stations detected from user GPS (e.g., Gwalior Jn + Birlanagar)
  const [nearbyStations, setNearbyStations] = useState<NearbyStationItem[]>([]);

  // Origin station: initialize based on userCoords if available, else Gwalior (GWL)
  const [originStation, setOriginStation] = useState<RailwayStation>(() => {
    if (userCoords) {
      const nearby = findNearbyStations(userCoords.lat, userCoords.lon, 4);
      if (nearby.length > 0) {
        return nearby[0].station;
      }
    }
    return ALL_RAILWAY_STATIONS.find((s) => s.c === 'GWL') ||
           ALL_RAILWAY_STATIONS.find((s) => s.c === 'NDLS') ||
           ALL_RAILWAY_STATIONS[0];
  });

  const [detectingLocation, setDetectingLocation] = useState<boolean>(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  // Default travel date: 13 Sept 2026 (or today + 1 day)
  const getDefaultDate = () => {
    const d = new Date();
    // Default to near date to demonstrate live seat search & earliest confirmed unlock
    return d.toISOString().split('T')[0];
  };

  const [travelDate, setTravelDate] = useState<string>(getDefaultDate);
  const [copiedClass, setCopiedClass] = useState<string | null>(null);

  // Active date tab index in the 7-day sheet (defaults to selected date at index 0)
  const [selectedDateTabIdx, setSelectedDateTabIdx] = useState<number>(0);

  // Partner API Modal & Configuration
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [partnerApiKey, setPartnerApiKey] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('IRCTC_PARTNER_API_KEY') || '';
    }
    return '';
  });
  const [apiStatusMsg, setApiStatusMsg] = useState<string | null>(null);

  const handleSaveApiKey = (key: string) => {
    setPartnerApiKey(key);
    if (typeof window !== 'undefined') {
      if (key.trim()) {
        localStorage.setItem('IRCTC_PARTNER_API_KEY', key.trim());
        setApiStatusMsg('API credentials saved securely in local browser storage.');
      } else {
        localStorage.removeItem('IRCTC_PARTNER_API_KEY');
        setApiStatusMsg('API credentials cleared. Active in Zero-Mock inform-and-link mode.');
      }
    }
  };

  // Sync initialDestination if it changes externally (e.g. user clicks Agra modal button)
  useEffect(() => {
    if (initialDestination) {
      setToDestinationId(initialDestination.id);
      setDestinationMode('holiday');
      const match = initialDestination.nearestRailway?.match(/\(([A-Z]+)\)/);
      if (match && match[1]) {
        const found = ALL_RAILWAY_STATIONS.find((s) => s.c === match[1]);
        if (found) setDestStation(found);
      }
    }
  }, [initialDestination]);

  // Sync userCoords if available
  useEffect(() => {
    if (userCoords) {
      const nearby = findNearbyStations(userCoords.lat, userCoords.lon, 4);
      setNearbyStations(nearby);
      if (nearby.length > 0) {
        const majorHub = nearby.find((item) => item.isMajorHub);
        setOriginStation(majorHub ? majorHub.station : nearby[0].station);
        setLocationStatus(`📍 Located near ${nearby[0].station.n} (${nearby[0].station.c}) · ${nearby.length} stations in your area`);
      }
    }
  }, [userCoords]);

  // Selected holiday destination info
  const selectedDest = useMemo(() => {
    return DESTINATIONS.find((d) => d.id === toDestinationId) || DESTINATIONS[0];
  }, [toDestinationId]);

  // Effective destination station object
  const effectiveDestStation = useMemo(() => {
    if (destinationMode === 'station') {
      return destStation;
    }
    // Match station from nearestRailway
    const match = selectedDest.nearestRailway?.match(/\(([A-Z]+)\)/);
    if (match && match[1]) {
      const found = ALL_RAILWAY_STATIONS.find((s) => s.c === match[1]);
      if (found) return found;
    }
    return destStation;
  }, [destinationMode, destStation, selectedDest]);

  // Destination name string for titles & alerts
  const destDisplayName = useMemo(() => {
    if (destinationMode === 'holiday') {
      return `${selectedDest.name.split('&')[0].trim()} (${effectiveDestStation.c})`;
    }
    return `${destStation.n} (${destStation.c})`;
  }, [destinationMode, selectedDest, effectiveDestStation, destStation]);

  // Compute live 7-day train availability sheets
  const trainAvailability = useMemo(() => {
    return getRouteTrainSheets(originStation, effectiveDestStation, travelDate);
  }, [originStation, effectiveDestStation, travelDate]);

  // Active date tab object and trains list
  const activeTab = trainAvailability.dateTabs[selectedDateTabIdx] || trainAvailability.dateTabs[0];
  const activeDateTrains = trainAvailability.sheetsByDate[activeTab?.dateStr] || [];
  const earliestAdvice = trainAvailability.earliestConfirmedAdvice;

  // Auto-detect nearest stations via GPS
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLocation(true);
    setLocationStatus('Accessing your GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearby = findNearbyStations(latitude, longitude, 4);

        if (nearby.length > 0) {
          setNearbyStations(nearby);
          const majorHub = nearby.find((item) => item.isMajorHub);
          const chosen = majorHub ? majorHub.station : nearby[0].station;
          setOriginStation(chosen);
          setDetectingLocation(false);
          setLocationStatus(
            `📍 Nearest station: ${nearby[0].station.n} (${nearby[0].station.c}) ~${nearby[0].distanceKm} km. Recommended Hub: ${chosen.n} (${chosen.c})`
          );
        } else {
          setDetectingLocation(false);
          setLocationStatus('Could not find nearby stations.');
        }
      },
      (err) => {
        setDetectingLocation(false);
        setLocationStatus('GPS permission denied. You can search or select a station below.');
      },
      { timeout: 9000, enableHighAccuracy: false }
    );
  };

  // Explicit calculation button handler
  const handleCalculateAdvice = () => {
    setIsCalculating(true);
    setTimeout(() => {
      setIsCalculating(false);
      // Auto-jump to the first date tab with trains if available
      const firstTabWithTrains = trainAvailability.dateTabs.findIndex((t) => t.trainsCount > 0);
      if (firstTabWithTrains !== -1) {
        setSelectedDateTabIdx(firstTabWithTrains);
      }
    }, 300);
  };

  // General 60-day ARP calculation
  const bookingCalculations = useMemo(() => {
    if (!travelDate) return null;
    const [year, month, day] = travelDate.split('-').map(Number);
    const journeyDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((journeyDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const arpDate = new Date(journeyDate);
    arpDate.setDate(arpDate.getDate() - 60);

    const tatkalDate = new Date(journeyDate);
    tatkalDate.setDate(tatkalDate.getDate() - 1);

    const formatDateStr = (d: Date) => {
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    };

    const isOpenNow = diffDays <= 60 && diffDays >= 0;
    const daysUntilOpen = diffDays - 60;

    return {
      diffDays,
      isOpenNow,
      daysUntilOpen: daysUntilOpen > 0 ? daysUntilOpen : 0,
      generalOpeningDateStr: formatDateStr(arpDate),
      tatkalDateStr: formatDateStr(tatkalDate),
      journeyDateStr: formatDateStr(journeyDate),
    };
  }, [travelDate]);

  const handleCopyAlert = (className: string, daysNotice: string, time: string) => {
    if (!bookingCalculations) return;
    const alertMsg = `🚆 IRCTC Booking Reminder: ${originStation.n} (${originStation.c}) to ${destDisplayName}\nClass: ${className}\nTrip Date: ${activeTab?.dateStr || bookingCalculations.journeyDateStr}\nRecommended Window: Book ${daysNotice} before travel.\n• General Booking Opens: ${bookingCalculations.generalOpeningDateStr} at 08:00 AM IST\n• Tatkal Backup: ${bookingCalculations.tatkalDateStr} at ${time}`;
    navigator.clipboard.writeText(alertMsg);
    setCopiedClass(className);
    setTimeout(() => setCopiedClass(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fadeIn">
      {/* Multi-Modal Transport Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-[#111827] border border-slate-800 gap-2 max-w-2xl mx-auto shadow-xl">
        <button
          type="button"
          onClick={() => setTransportMode('train')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            transportMode === 'train'
              ? 'bg-[#d4f938] text-black shadow-md shadow-lime-500/20 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Trains (IRCTC 60D Engine)</span>
        </button>

        <button
          type="button"
          onClick={() => setTransportMode('flight')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            transportMode === 'flight'
              ? 'bg-sky-400 text-black shadow-md shadow-sky-400/20 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Plane className="w-4 h-4" />
          <span>Flights (Airports &amp; Live Search)</span>
        </button>

        <button
          type="button"
          onClick={() => setTransportMode('bus')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            transportMode === 'bus'
              ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20 font-extrabold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bus className="w-4 h-4" />
          <span>Buses (ISBTs &amp; Live redBus)</span>
        </button>
      </div>

      {transportMode === 'flight' && (
        <FlightBookingAdvisor initialDestination={initialDestination} userCoords={userCoords} />
      )}

      {transportMode === 'bus' && (
        <BusBookingAdvisor initialDestination={initialDestination} userCoords={userCoords} />
      )}

      {transportMode === 'train' && (
        <>
          {/* Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4f938]/15 border border-[#d4f938]/30 text-[#d4f938] text-xs font-bold font-mono">
            <Train className="w-3.5 h-3.5" />
            <span>Train Booking Sheet & Availability Advisor</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <span>⚡ 8,989 Stations in India</span>
          </div>
          {initialDestination && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <span>Trip to: {initialDestination.name.split('&')[0]}</span>
            </div>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Find Earliest Confirmed Train Tickets & Booking Window
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          The algorithm scans every train booking sheet along your route and provides the <strong>exact earliest day & time</strong> when you can get confirmed tickets for <strong>Sleeper</strong>, <strong>3AC</strong>, and <strong>2AC</strong>.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Origin Station Searchable Combobox */}
          <div className="space-y-2">
            <StationSearchInput
              label="From (Your Nearest Station)"
              selectedStation={originStation}
              onSelectStation={(st) => {
                setOriginStation(st);
                setLocationStatus(null);
              }}
              placeholder="Search station or code (e.g. GWL, BLNR, NDLS)..."
              showGpsButton={true}
              onGpsClick={handleDetectLocation}
              isLocating={detectingLocation}
            />

            {/* Nearby Stations from GPS (e.g., Gwalior Jn vs Birlanagar) */}
            {nearbyStations.length > 0 && (
              <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-700/60 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-[#d4f938] tracking-wider flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Nearby Stations (Your Location):</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {nearbyStations.map((item) => {
                    const isSelected = originStation.c === item.station.c;
                    return (
                      <button
                        key={item.station.c}
                        type="button"
                        onClick={() => {
                          setOriginStation(item.station);
                          setLocationStatus(`Selected ${item.station.n} (${item.station.c}) · ${item.distanceKm} km away`);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#d4f938] text-black font-extrabold shadow-md'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>{item.station.n}</span>
                        <span className="font-mono text-[10px] opacity-80">({item.station.c})</span>
                        <span className="text-[10px] px-1 rounded bg-black/20 font-mono">
                          {item.distanceKm} km
                        </span>
                        {item.isMajorHub && (
                          <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-bold">
                            Major Hub
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Popular Hubs */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                Popular Hubs:
              </span>
              <div className="flex flex-wrap gap-1">
                {POPULAR_STATIONS.slice(0, 8).map((st) => (
                  <button
                    key={st.c}
                    type="button"
                    onClick={() => {
                      setOriginStation(st);
                      setLocationStatus(null);
                    }}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold transition-colors cursor-pointer ${
                      originStation.c === st.c
                        ? 'bg-[#d4f938] text-black'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st.c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2. Destination Selection (Holiday spot vs Any Station) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5 text-amber-400" />
                <span>To (Trip Destination)</span>
              </label>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-800 border border-slate-700 text-[10px]">
                <button
                  type="button"
                  onClick={() => setDestinationMode('holiday')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                    destinationMode === 'holiday'
                      ? 'bg-[#d4f938] text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Spot
                </button>
                <button
                  type="button"
                  onClick={() => setDestinationMode('station')}
                  className={`px-2 py-0.5 rounded-md font-bold transition-colors ${
                    destinationMode === 'station'
                      ? 'bg-[#d4f938] text-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Any Station
                </button>
              </div>
            </div>

            {destinationMode === 'holiday' ? (
              <div className="space-y-1.5">
                <select
                  value={toDestinationId}
                  onChange={(e) => setToDestinationId(e.target.value)}
                  className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4f938]"
                >
                  {DESTINATIONS.filter((d) => d.country === 'India').map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name.split('&')[0].trim()} ({d.state})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-400 block truncate">
                  Nearest Rail: {selectedDest.nearestRailway}
                </span>
              </div>
            ) : (
              <StationSearchInput
                label="Destination Station"
                selectedStation={destStation}
                onSelectStation={(st) => setDestStation(st)}
                placeholder="Search any destination station in India..."
              />
            )}
          </div>

          {/* 3. Travel Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#d4f938]" />
              <span>Trip Departure Date</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full bg-[#162032] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#d4f938]"
            />
            {bookingCalculations && (
              <span className="text-[11px] text-slate-400 block">
                {bookingCalculations.diffDays > 0
                  ? `Trip is in ${bookingCalculations.diffDays} days`
                  : 'Selected date is today/passed'}
              </span>
            )}
          </div>
        </div>

        {/* GPS location feedback if active */}
        {locationStatus && (
          <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{locationStatus}</span>
          </div>
        )}

        {/* User Search & Calculate Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#d4f938]" />
            <span>
              Route Selected: <strong className="text-white">{originStation.n} ({originStation.c})</strong> ➔ <strong className="text-[#d4f938]">{destDisplayName}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleCalculateAdvice}
            disabled={isCalculating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#d4f938] to-cyan-400 hover:from-lime-400 hover:to-cyan-300 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCalculating ? 'animate-spin' : ''}`} />
            <span>{isCalculating ? 'Searching Train Sheets...' : 'Search Trains & Booking Sheets'}</span>
          </button>
        </div>
      </div>

      {/* 🎯 CORE FEATURE: VERIFIED SCHEDULED SERVICES SUMMARY */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#111827] to-cyan-950/40 border border-emerald-500/30 shadow-2xl space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Train className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authoritative Schedule &amp; Tariff Advisory</span>
              </span>
              <h3 className="text-base font-extrabold text-white">
                Scheduled Express Services ({originStation.c} ➔ {effectiveDestStation.c})
              </h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{partnerApiKey ? 'API: Connected' : 'Live API: Zero-Mock Mode'}</span>
            </button>
            <span className="text-xs text-slate-400 font-mono">
              ~{trainAvailability.distanceKm} track km
            </span>
          </div>
        </div>

        {/* 3 Summary Cards for Verified Service Classes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* 1. Sleeper Service */}
          <div className="p-4 rounded-2xl bg-[#162032] border border-amber-500/30 space-y-2 hover:border-amber-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🛏️ Sleeper (SL)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Standard Tariff
              </span>
            </div>
            {earliestAdvice.sleeper ? (
              <div>
                <div className="text-sm font-extrabold text-white">
                  {earliestAdvice.sleeper.trainName} ({earliestAdvice.sleeper.trainNumber})
                </div>
                <div className="text-xs text-amber-300 font-bold mt-1 flex items-center gap-1.5">
                  <span>Est. Base Fare: ₹{earliestAdvice.sleeper.fare}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Departs at {earliestAdvice.sleeper.departureTime}</span>
                  <a
                    href="https://www.irctc.co.in/nget/booking/train-list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Check Berths</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                No direct sleeper train in verified schedule. Check connecting routes.
              </div>
            )}
          </div>

          {/* 2. 3-Tier AC Service */}
          <div className="p-4 rounded-2xl bg-[#162032] border border-[#d4f938]/40 space-y-2 hover:border-[#d4f938] transition-colors ring-1 ring-[#d4f938]/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#d4f938] uppercase tracking-wider flex items-center gap-1.5">
                <span>❄️ 3-Tier AC (3AC / 3E)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#d4f938]/20 text-[#d4f938] font-bold">
                Standard Tariff
              </span>
            </div>
            {earliestAdvice.threeAC ? (
              <div>
                <div className="text-sm font-extrabold text-white">
                  {earliestAdvice.threeAC.trainName} ({earliestAdvice.threeAC.trainNumber})
                </div>
                <div className="text-xs text-[#d4f938] font-bold mt-1 flex items-center gap-1.5">
                  <span>Est. Base Fare: ₹{earliestAdvice.threeAC.fare}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Departs at {earliestAdvice.threeAC.departureTime}</span>
                  <a
                    href="https://www.irctc.co.in/nget/booking/train-list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d4f938] hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Check Berths</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                No direct 3AC train in verified schedule.
              </div>
            )}
          </div>

          {/* 3. 2-Tier AC Service */}
          <div className="p-4 rounded-2xl bg-[#162032] border border-cyan-500/30 space-y-2 hover:border-cyan-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>🌟 2-Tier AC (2AC)</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                Standard Tariff
              </span>
            </div>
            {earliestAdvice.twoAC ? (
              <div>
                <div className="text-sm font-extrabold text-white">
                  {earliestAdvice.twoAC.trainName} ({earliestAdvice.twoAC.trainNumber})
                </div>
                <div className="text-xs text-cyan-300 font-bold mt-1 flex items-center gap-1.5">
                  <span>Est. Base Fare: ₹{earliestAdvice.twoAC.fare}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>Departs at {earliestAdvice.twoAC.departureTime}</span>
                  <a
                    href="https://www.irctc.co.in/nget/booking/train-list"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-0.5 text-[10px]"
                  >
                    <span>Check Berths</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400">
                No direct 2AC train in verified schedule.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📅 7-DAY SCHEDULE AVAILABILITY STRIP */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Train Operating Schedule Across Dates ({originStation.c} ➔ {effectiveDestStation.c})
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any date to inspect scheduled trains
          </span>
        </div>

        {/* Horizontal Date Tabs Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {trainAvailability.dateTabs.map((tab, idx) => {
            const isSelected = selectedDateTabIdx === idx;
            const isDirect = tab.statusSummary === 'Verified Schedule';
            const isAlt = tab.statusSummary === 'Alternate Stations';

            return (
              <button
                key={tab.dateStr}
                type="button"
                onClick={() => setSelectedDateTabIdx(idx)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border transition-all cursor-pointer text-left min-w-[130px] ${
                  isSelected
                    ? 'bg-[#162032] border-[#d4f938] shadow-lg shadow-lime-500/10 ring-1 ring-[#d4f938]'
                    : 'bg-[#111827] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white">
                    {tab.dayLabel}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {tab.monthLabel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isDirect ? 'bg-emerald-400' : isAlt ? 'bg-amber-400' : 'bg-slate-600'
                    }`}
                  />
                  <span
                    className={`text-[11px] font-semibold ${
                      isDirect ? 'text-emerald-300' : isAlt ? 'text-amber-300' : 'text-slate-400'
                    }`}
                  >
                    {tab.trainsCount > 0
                      ? `${tab.trainsCount} ${tab.trainsCount === 1 ? 'Train' : 'Trains'}`
                      : 'No Trains'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🚆 VERIFIED TRAIN SCHEDULES FOR SELECTED DATE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Trains on</span>
              <span className="text-[#d4f938]">{activeTab?.dayLabel} {activeTab?.monthLabel}</span>
              <span className="text-slate-400 font-normal text-xs">({originStation.n} ➔ {effectiveDestStation.n})</span>
            </h3>
            <span className="text-xs text-slate-400">
              {activeDateTrains.length} Express / Superfast Services Verified for this corridor
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.irctc.co.in/nget/booking/train-list"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#d4f938] hover:bg-lime-400 text-xs font-extrabold text-black flex items-center gap-1.5 transition-colors shadow-md shadow-lime-500/10"
            >
              <span>Book on IRCTC</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* List of Verified Train Cards */}
        <div className="space-y-4">
          {activeDateTrains.map((train) => (
            <div
              key={train.trainNumber}
              className={`p-5 rounded-3xl bg-[#111827] border space-y-4 shadow-lg transition-all ${
                train.isAlternateStation
                  ? 'border-amber-500/40 bg-gradient-to-br from-[#111827] via-[#111827] to-amber-950/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              {/* Train Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                    {train.trainNumber}
                  </span>
                  <span className="text-sm font-extrabold text-white flex items-center gap-1">
                    <span>{train.trainName.toUpperCase()}</span>
                  </span>
                  <span className="text-[10px] font-semibold text-[#d4f938] bg-[#d4f938]/10 border border-[#d4f938]/30 px-2 py-0.5 rounded-full">
                    {train.trainType}
                  </span>
                  {train.runsOnDays && (
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded">
                      Runs On: {train.runsOnDays}
                    </span>
                  )}
                  {train.foodAvailable && (
                    <span title="Catering / Pantry Car Available" className="p-1 rounded bg-slate-800 text-slate-300">
                      <Utensils className="w-3 h-3" />
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={train.partnerDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 underline font-semibold flex items-center gap-1"
                  >
                    <span>ConfirmTkt Live</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={train.irctcDeepLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#d4f938] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>IRCTC NGET</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Alternate Station Notice if applicable */}
              {train.isAlternateStation && (
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Alternate Gateway Station: </span>
                    <span>{train.alternateNotice}</span>
                  </div>
                </div>
              )}

              {/* Timing & Stations Bar (matching IRCTC layout) */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs">
                <div className="space-y-0.5">
                  <div className="text-base font-extrabold text-white flex items-center gap-1.5">
                    <span>{train.departureTime}</span>
                    <span className="font-mono text-xs text-sky-300 font-semibold">| {train.departureStationName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {activeTab?.dayLabel} {activeTab?.monthLabel}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-1 text-slate-400">
                  <span className="font-mono text-[11px] font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {train.duration}
                  </span>
                  <div className="flex items-center gap-1 text-slate-600 text-[10px]">
                    <span>────────►</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-right">
                  <div className="text-base font-extrabold text-white flex items-center gap-1.5 justify-end">
                    <span>{train.arrivalTime}</span>
                    <span className="font-mono text-xs text-indigo-300 font-semibold">| {train.arrivalStationName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {train.arrivalDayLabel || '+1 day'}
                  </div>
                </div>
              </div>

              {/* Travel Classes Grid with Official Distance-Based Estimates and Real IRCTC Links */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Available Classes &amp; Distance-Based Tariff Estimates:</span>
                  <span className="italic">Live seat counts update dynamically on IRCTC</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
                  {train.classes.map((cls) => (
                    <div
                      key={cls.classCode}
                      className="p-3 rounded-2xl border border-slate-800 bg-[#162032] hover:border-slate-700 transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">
                          {cls.className} ({cls.classCode})
                        </span>
                      </div>

                      <div className="mt-2">
                        <div className="text-base font-extrabold font-mono text-[#d4f938]">
                          ₹{cls.fare}
                        </div>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Est. Fare (not live)
                        </span>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
                        <a
                          href={train.partnerDeepLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                        >
                          <span>Check Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-[9px] font-mono text-slate-500">
                          {cls.slabVersion}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {activeDateTrains.length === 0 && (
            <div className="p-8 rounded-3xl bg-[#111827] border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <Train className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">No Direct Trains Scheduled on This Date</h4>
                <p className="text-xs text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Under our strict Zero-Mock policy, we never generate synthetic trains. No direct scheduled trains in our verified database run between {originStation.n} ({originStation.c}) and {effectiveDestStation.n} ({effectiveDestStation.c}) on {activeTab?.dayLabel}.
                </p>
              </div>
              <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
                <a
                  href="https://www.irctc.co.in/nget/booking/train-list"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#d4f938] text-black font-extrabold text-xs hover:bg-lime-400 transition-colors shadow-md shadow-lime-500/10"
                >
                  <span>Search Connecting Trains on IRCTC NGET</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔐 IRCTC PARTNER API CREDENTIALS MODAL */}
      {isApiModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-slate-700 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Connect IRCTC Partner API</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApiModalOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              By default, Voyage displays verified Indian Railways timetables, running days, and distance-based fare estimates under our strict Zero-Mock policy. To stream real-time seat counts and live PNR statuses directly into the app, you may provide an authorized IRCTC B2B Partner or RailAPI merchant token.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">
                Partner / Merchant API Key:
              </label>
              <input
                type="password"
                value={partnerApiKey}
                onChange={(e) => setPartnerApiKey(e.target.value)}
                placeholder="Enter authorized partner key..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {apiStatusMsg && (
              <p className="text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/40">
                {apiStatusMsg}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSaveApiKey('')}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold cursor-pointer"
              >
                Clear / Disconnect
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSaveApiKey(partnerApiKey);
                  setTimeout(() => setIsApiModalOpen(false), 800);
                }}
                className="px-4 py-2 rounded-xl bg-[#d4f938] text-black font-extrabold text-xs hover:bg-lime-400 cursor-pointer shadow-md shadow-lime-500/10"
              >
                Save &amp; Connect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IRCTC 60-Day Advance Reservation Rule & Tatkal Times Card */}
      {bookingCalculations && (
        <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              IRCTC 60-Day Advance Reservation Rule & Opening Timings
            </span>
            <span className="text-xs text-[#d4f938] font-bold font-mono">
              Official Railway Board Rule (Effective Nov 1, 2024)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sleeper Rule */}
            <div className="p-4 rounded-2xl bg-[#162032] border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-400">
                  🛏️ Sleeper Class (SL) Window
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Book 45–60 Days Prior
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">General Quota:</span>
                  <strong className="text-white">08:00 AM IST (60 days prior)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unlock Date:</span>
                  <strong className="text-[#d4f938] font-mono">{bookingCalculations.generalOpeningDateStr}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Tatkal Quota:</span>
                  <strong className="text-amber-300">11:00 AM IST (1 day prior)</strong>
                </div>
              </div>
              <button
                onClick={() => handleCopyAlert('Sleeper Class (SL)', '45–60 days', '11:00 AM IST')}
                className="w-full mt-2 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedClass === 'Sleeper Class (SL)' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#d4f938]" />
                    <span>Alert Copied!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Copy Sleeper Booking Alert</span>
                  </>
                )}
              </button>
            </div>

            {/* 3AC Rule */}
            <div className="p-4 rounded-2xl bg-[#162032] border border-[#d4f938]/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#d4f938]">
                  ❄️ 3-Tier AC (3AC) Window
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#d4f938]/20 text-[#d4f938] font-bold">
                  Book 30–45 Days Prior
                </span>
              </div>
              <div className="text-xs text-slate-300 space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">General Quota:</span>
                  <strong className="text-white">08:00 AM IST (60 days prior)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Unlock Date:</span>
                  <strong className="text-[#d4f938] font-mono">{bookingCalculations.generalOpeningDateStr}</strong>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Tatkal Quota:</span>
                  <strong className="text-cyan-300">10:00 AM IST (1 day prior)</strong>
                </div>
              </div>
              <button
                onClick={() => handleCopyAlert('3-Tier AC (3AC)', '30–45 days', '10:00 AM IST')}
                className="w-full mt-2 py-2 rounded-xl bg-[#d4f938] hover:bg-lime-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-lime-500/20 cursor-pointer"
              >
                {copiedClass === '3-Tier AC (3AC)' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-black" />
                    <span>Alert Copied!</span>
                  </>
                ) : (
                  <>
                    <Bell className="w-3.5 h-3.5" />
                    <span>Copy 3AC Booking Alert</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
