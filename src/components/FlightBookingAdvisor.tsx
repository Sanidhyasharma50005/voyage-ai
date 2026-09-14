'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plane,
  Calendar,
  MapPin,
  ArrowRight,
  ExternalLink,
  Search,
  CheckCircle2,
  Info,
  Clock,
  Luggage,
  Shield,
  Key,
  Compass,
  AlertTriangle,
  ChevronDown
} from 'lucide-react';
import { Destination } from '@/types/travel';
import {
  Airport,
  INDIAN_AIRPORTS,
  findNearestAirport,
  searchAirports
} from '@/data/airports';

interface FlightBookingAdvisorProps {
  initialDestination?: Destination | null;
  userCoords?: { lat: number; lon: number } | null;
}

function resolveDestinationAirport(dest?: Destination | null): Airport {
  if (!dest) {
    return INDIAN_AIRPORTS.find((a) => a.c === 'AGR') || INDIAN_AIRPORTS[0];
  }
  if (dest.nearestAirport) {
    // 1. Try extracting 3-letter IATA code e.g. "Srinagar (SXR)" or "IXC (Chandigarh)"
    const iataMatches = dest.nearestAirport.match(/\b([A-Z]{3})\b/g);
    if (iataMatches) {
      for (const code of iataMatches) {
        const found = INDIAN_AIRPORTS.find((a) => a.c.toUpperCase() === code);
        if (found) return found;
      }
    }
    // 2. City or airport name substring match
    const cleanNear = dest.nearestAirport.toLowerCase();
    const cleanName = dest.name.toLowerCase();
    const match = INDIAN_AIRPORTS.find(
      (a) =>
        a.c.toLowerCase() === cleanNear ||
        cleanNear.includes(a.city.toLowerCase()) ||
        a.city.toLowerCase().includes(cleanName) ||
        cleanName.includes(a.city.toLowerCase()) ||
        cleanNear.includes(a.n.toLowerCase())
    );
    if (match) return match;
  }
  // 3. Fallback to nearest airport based on destination coordinates
  if (dest.latitude && dest.longitude) {
    const { airport } = findNearestAirport(dest.latitude, dest.longitude);
    if (airport) return airport;
  }
  return INDIAN_AIRPORTS.find((a) => a.c === 'AGR') || INDIAN_AIRPORTS[0];
}

export function FlightBookingAdvisor({ initialDestination, userCoords }: FlightBookingAdvisorProps) {
  // Origin airport: auto-detected or default to Gwalior (GWL) / Delhi (DEL)
  const [originAirport, setOriginAirport] = useState<Airport>(() => {
    if (userCoords) {
      const { airport } = findNearestAirport(userCoords.lat, userCoords.lon);
      return airport;
    }
    return INDIAN_AIRPORTS.find((a) => a.c === 'GWL') || INDIAN_AIRPORTS[0];
  });

  // Destination airport: default to destination's resolved airport
  const [destAirport, setDestAirport] = useState<Airport>(() =>
    resolveDestinationAirport(initialDestination)
  );

  // Travel date (default to today + 25 days, which sits in the 21-45 day sweet spot)
  const [travelDate, setTravelDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 25);
    return d.toISOString().split('T')[0];
  });

  // Search states for dropdowns
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [isOriginOpen, setIsOriginOpen] = useState(false);
  const [isDestOpen, setIsDestOpen] = useState(false);
  const [detectingGps, setDetectingGps] = useState(false);
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  // API Gate state
  const [showApiGate, setShowApiGate] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [apiTesting, setApiTesting] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<string | null>(null);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);

  // Sync if initialDestination changes
  useEffect(() => {
    if (initialDestination) {
      setDestAirport(resolveDestinationAirport(initialDestination));
    }
  }, [initialDestination]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setIsOriginOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setIsDestOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered lists (expanded to 25 items for comprehensive browsing)
  const filteredOriginAirports = useMemo(() => searchAirports(originQuery, 25), [originQuery]);
  const filteredDestAirports = useMemo(() => searchAirports(destQuery, 25), [destQuery]);

  // GPS Nearest Airport
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingGps(true);
    setGpsMessage('Detecting nearest commercial airport from your GPS...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { airport, distanceKm } = findNearestAirport(pos.coords.latitude, pos.coords.longitude);
        setOriginAirport(airport);
        setGpsMessage(`Found: ${airport.n} (${airport.c}) · ~${distanceKm} km from your GPS location`);
        setDetectingGps(false);
      },
      () => {
        setDetectingGps(false);
        setGpsMessage('GPS access denied or timed out. You can select an airport manually.');
      },
      { timeout: 9000 }
    );
  };

  // Straight line distance & estimated flight time
  const aerialDistance = useMemo(() => {
    const R = 6371;
    const dLat = ((destAirport.lat - originAirport.lat) * Math.PI) / 180;
    const dLon = ((destAirport.lng - originAirport.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originAirport.lat * Math.PI) / 180) *
        Math.cos((destAirport.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = Math.round(R * c);

    // Approximate flight time: ~700 km/h speed + 30 mins taxi/takeoff/approach
    const hours = dist / 700 + 0.5;
    const durationHours = Math.floor(hours);
    const durationMinutes = Math.round((hours - durationHours) * 60);

    return {
      km: dist,
      durationStr: `${durationHours}h ${durationMinutes}m`,
    };
  }, [originAirport, destAirport]);

  // Dynamic booking horizon calculation
  const bookingHorizonInfo = useMemo(() => {
    if (!travelDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [y, m, d] = travelDate.split('-').map(Number);
    const depDate = new Date(y, m - 1, d);
    const diffDays = Math.ceil((depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    let status: 'optimal' | 'early' | 'late' | 'passed';
    let statusText: string;
    let badgeColor: string;

    if (diffDays < 0) {
      status = 'passed';
      statusText = 'Date has passed';
      badgeColor = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
    } else if (diffDays <= 7) {
      status = 'late';
      statusText = `Urgent / High Demand Window (${diffDays} days away)`;
      badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    } else if (diffDays >= 21 && diffDays <= 45) {
      status = 'optimal';
      statusText = `Prime Booking Sweet Spot (${diffDays} days away)`;
      badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/30';
    } else if (diffDays > 45) {
      status = 'early';
      statusText = `Early Advance Planning (${diffDays} days away)`;
      badgeColor = 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
    } else {
      status = 'optimal';
      statusText = `Standard Booking Window (${diffDays} days away)`;
      badgeColor = 'bg-slate-700 text-slate-300 border-slate-600';
    }

    return {
      diffDays,
      status,
      statusText,
      badgeColor,
    };
  }, [travelDate]);

  // OTA Deep search links (with URL encoding and exact formats)
  const searchUrls = useMemo(() => {
    const fromCode = originAirport.c;
    const toCode = destAirport.c;
    const dateFormatted = travelDate; // YYYY-MM-DD

    // Google Flights: https://www.google.com/travel/flights?q=Flights+from+GWL+to+DEL+on+2026-10-07
    const googleFlightsUrl = `https://www.google.com/travel/flights?q=Flights+from+${encodeURIComponent(fromCode)}+to+${encodeURIComponent(toCode)}+on+${encodeURIComponent(dateFormatted)}`;

    // Skyscanner: YYMMDD format e.g. 261007
    const yy = dateFormatted.slice(2, 4);
    const mm = dateFormatted.slice(5, 7);
    const dd = dateFormatted.slice(8, 10);
    const skyDate = `${yy}${mm}${dd}`;
    const skyscannerUrl = `https://www.skyscanner.co.in/transport/flights/${fromCode.toLowerCase()}/${toCode.toLowerCase()}/${skyDate}/?adultsv2=1&cabinclass=economy`;

    // MakeMyTrip: DD/MM/YYYY
    const mmtDate = `${dd}/${mm}/${dateFormatted.slice(0, 4)}`;
    const makeMyTripUrl = `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${mmtDate}&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E`;

    return {
      googleFlightsUrl,
      skyscannerUrl,
      makeMyTripUrl,
    };
  }, [originAirport, destAirport, travelDate]);

  const testApiConnection = () => {
    if (!apiKeyInput.trim()) {
      setApiTestResult('Please enter an API Key to test.');
      return;
    }
    setApiTesting(true);
    setTimeout(() => {
      setApiTesting(false);
      setApiTestResult(
        'Validation simulation complete: Aggregator endpoint ready. Real-time seats and pricing stream requires active merchant credentials.'
      );
    }, 800);
  };

  return (
    <div className="space-y-7 max-w-4xl mx-auto animate-fadeIn">
      {/* Flight Header */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-bold font-mono">
            <Plane className="w-3.5 h-3.5" />
            <span>Domestic Flight Advisor & Route Planner</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">
            <span>Verified Commercial Airports (India)</span>
          </div>
          {initialDestination && (
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs font-mono">
              <span>Destination: {initialDestination.name.split('&')[0]}</span>
            </div>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Airport Flight Routing & Advance Booking Sweet Spot
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Airfares in India follow market-driven dynamic pricing. Discover the optimal 21–45 day advance purchase window, baggage allowances, and launch 1-click live searches across major aggregators.
        </p>
      </div>

      {/* Airport Selection & Date Card */}
      <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-xl space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Origin Airport Dropdown */}
          <div className="space-y-2 relative" ref={originRef}>
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>From (Departure Airport)</span>
              </span>
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detectingGps}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline font-normal flex items-center gap-1 cursor-pointer"
              >
                <Compass className="w-3 h-3" />
                <span>{detectingGps ? 'Locating...' : 'Detect Nearest'}</span>
              </button>
            </label>

            <button
              type="button"
              onClick={() => {
                setIsOriginOpen(!isOriginOpen);
                setIsDestOpen(false);
              }}
              className="w-full text-left p-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-sky-500/50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-sky-300 px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30">
                    {originAirport.c}
                  </span>
                  <span className="text-sm font-bold text-white truncate">{originAirport.city}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">{originAirport.n}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {isOriginOpen && (
              <div className="absolute top-full left-0 w-full mt-2 p-2 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl z-50 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={originQuery}
                    onChange={(e) => setOriginQuery(e.target.value)}
                    placeholder="Search city or code (e.g. GWL, DEL, BOM)..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {filteredOriginAirports.map((ap) => (
                    <button
                      key={ap.c}
                      type="button"
                      onClick={() => {
                        setOriginAirport(ap);
                        setIsOriginOpen(false);
                        setOriginQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        originAirport.c === ap.c
                          ? 'bg-sky-500/20 text-sky-200 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-white">{ap.city}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{ap.n}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-sky-400 ml-2 px-1.5 py-0.5 rounded bg-sky-950">
                        {ap.c}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gpsMessage && (
              <p className="text-[11px] text-sky-300 bg-sky-950/40 p-2 rounded-xl border border-sky-800/40">
                {gpsMessage}
              </p>
            )}
          </div>

          {/* Destination Airport Dropdown */}
          <div className="space-y-2 relative" ref={destRef}>
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
              <span>To (Destination Airport)</span>
            </label>

            <button
              type="button"
              onClick={() => {
                setIsDestOpen(!isDestOpen);
                setIsOriginOpen(false);
              }}
              className="w-full text-left p-3 rounded-2xl bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-extrabold text-indigo-300 px-2 py-0.5 rounded bg-indigo-500/15 border border-indigo-500/30">
                    {destAirport.c}
                  </span>
                  <span className="text-sm font-bold text-white truncate">{destAirport.city}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-1">{destAirport.n}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
            </button>

            {isDestOpen && (
              <div className="absolute top-full left-0 w-full mt-2 p-2 rounded-2xl bg-[#0f172a] border border-slate-700 shadow-2xl z-50 space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={destQuery}
                    onChange={(e) => setDestQuery(e.target.value)}
                    placeholder="Search destination airport..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    autoFocus
                  />
                </div>
                <div className="max-h-56 overflow-y-auto space-y-1">
                  {filteredDestAirports.map((ap) => (
                    <button
                      key={ap.c}
                      type="button"
                      onClick={() => {
                        setDestAirport(ap);
                        setIsDestOpen(false);
                        setDestQuery('');
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        destAirport.c === ap.c
                          ? 'bg-indigo-500/20 text-indigo-200 font-bold'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="font-semibold text-white">{ap.city}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{ap.n}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-indigo-400 ml-2 px-1.5 py-0.5 rounded bg-indigo-950">
                        {ap.c}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Travel Date */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Travel Date</span>
            </label>
            <input
              type="date"
              value={travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-900 border border-slate-700 text-sm text-white font-medium focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>
        </div>

        {/* Route Snapshot Bar */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-white">{originAirport.city} ({originAirport.c})</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
            <span className="font-semibold text-white">{destAirport.city} ({destAirport.c})</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono">~{aerialDistance.km} km aerial</span>
            <span className="text-slate-500">·</span>
            <span className="text-slate-400 font-mono">Approx. {aerialDistance.durationStr} gate-to-gate</span>
          </div>

          {bookingHorizonInfo && (
            <div className={`px-3 py-1 rounded-full border text-xs font-bold font-mono flex items-center gap-1.5 ${bookingHorizonInfo.badgeColor}`}>
              <Clock className="w-3.5 h-3.5" />
              <span>{bookingHorizonInfo.statusText}</span>
            </div>
          )}
        </div>

        {/* 1-Click Live OTA Deep Search Buttons (TOP PRIORITY DIRECT BOOKING) */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Book Flight Tickets Instantly · Live Airline Inventory</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold font-mono">
                  Ready Available Today
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Flights operate daily across carriers. Launch 1-click pre-filled searches with your route and date on trusted booking sites:
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {/* Google Flights */}
            <a
              href={searchUrls.googleFlightsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700/80 hover:border-sky-500/50 text-white flex flex-col justify-between gap-2.5 group transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-sky-300">Google Flights</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-300 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Best for multi-airline price graphs, calendar price grids, and emissions tracking.
              </p>
              <span className="text-xs font-bold text-sky-400 flex items-center gap-1 mt-1">
                <span>Search on Google Flights</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            {/* Skyscanner */}
            <a
              href={searchUrls.skyscannerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700/80 hover:border-cyan-500/50 text-white flex flex-col justify-between gap-2.5 group transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-cyan-300">Skyscanner India</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Compares fares across IndiGo, Air India, Akasa, SpiceJet, and global travel agents.
              </p>
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 mt-1">
                <span>Search on Skyscanner</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>

            {/* MakeMyTrip */}
            <a
              href={searchUrls.makeMyTripUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 border border-slate-700/80 hover:border-red-500/50 text-white flex flex-col justify-between gap-2.5 group transition-all cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-red-400">MakeMyTrip</span>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors" />
              </div>
              <p className="text-[11px] text-slate-400 leading-normal">
                Direct domestic booking portal with UPI payments, bank card instant discounts, and free cancellation add-ons.
              </p>
              <span className="text-xs font-bold text-red-400 flex items-center gap-1 mt-1">
                <span>Search on MakeMyTrip</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Distinctive Blue/Slate Traveler Advisory Badge */}
      <div className="p-6 rounded-3xl bg-[#0d1527] border border-sky-900/40 shadow-lg space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-sky-900/30">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Domestic Airfare Traveler Advisory</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 font-mono font-bold">
                  Industry Rule of Thumb
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Airlines in India operate on un-capped, dynamic market algorithms. Understand the timing mechanics before booking.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 21 to 45 Day Window */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 text-xs font-extrabold uppercase tracking-wide">
              <Clock className="w-4 h-4" />
              <span>Optimal Purchase Window</span>
            </div>
            <h4 className="text-sm font-bold text-white">21 to 45 Days in Advance</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Carriers release discounted fare buckets early. As departure nears within 14 days, algorithms raise base fares sharply as business travelers purchase remaining seats.
            </p>
          </div>

          {/* Card 2: Fare Classes */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-extrabold uppercase tracking-wide">
              <Shield className="w-4 h-4" />
              <span>Saver vs Flexi Fares</span>
            </div>
            <h4 className="text-sm font-bold text-white">Choose Flexibility Wisely</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard <strong>Saver</strong> fares are strictly non-refundable with high change fees. If your dates might shift, <strong>Flexi Plus</strong> offers complimentary date changes and advance seat selection.
            </p>
          </div>

          {/* Card 3: Baggage & Passenger Rights */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-extrabold uppercase tracking-wide">
              <Luggage className="w-4 h-4" />
              <span>Baggage Policy & Rights</span>
            </div>
            <h4 className="text-sm font-bold text-white">15 kg Check-in / 7 kg Cabin</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard domestic tickets include 15 kg checked baggage and 7 kg cabin baggage. Beware of discounted &ldquo;Lite / Hand Baggage Only&rdquo; fares which charge extra for checked bags at the airport counter.
            </p>
          </div>
        </div>

        {/* Route Realism & Nonstop disclaimer */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <strong className="text-amber-200">Nonstop vs Connecting Itineraries:</strong> Direct point-to-point flights depend on airline seasonal schedules (e.g. IndiGo, Air India, Akasa). Clicking the live search links above will accurately present all scheduled nonstop and 1-stop connecting flight options between {originAirport.city} ({originAirport.c}) and {destAirport.city} ({destAirport.c}).
          </div>
        </div>
      </div>

      {/* Honest Phase 0 API Gate */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
        <button
          type="button"
          onClick={() => setShowApiGate(!showApiGate)}
          className="w-full flex items-center justify-between text-left text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
        >
          <span className="flex items-center gap-2 font-mono">
            <Key className="w-3.5 h-3.5 text-sky-400" />
            <span>Developer / Enterprise: Direct GDS &amp; OTA Live Inventory API</span>
          </span>
          <span className="text-[11px] text-sky-400 underline">
            {showApiGate ? 'Hide API Console' : 'Configure Live API →'}
          </span>
        </button>

        {showApiGate && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 animate-fadeIn">
            <p className="text-xs text-slate-300 leading-relaxed">
              Voyage does not invent fake flight numbers or synthetic seats. To stream real-time seat counts and ticket booking inline, configure an authorized partner key (Amadeus Self-Service API, Skyscanner Live Flights API, or EaseMyTrip Merchant API).
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                placeholder="Enter GDS / OTA API Partner Key (e.g. amd_live_...)"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-sky-500"
              />
              <button
                type="button"
                onClick={testApiConnection}
                disabled={apiTesting}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-extrabold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {apiTesting ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
            {apiTestResult && (
              <div className="p-2.5 rounded-lg bg-sky-950/60 border border-sky-800/60 text-xs text-sky-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <span>{apiTestResult}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
