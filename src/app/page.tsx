'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, NavTab } from '@/components/Sidebar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { Header } from '@/components/Header';
import { EasyVisaCarousel } from '@/components/EasyVisaCarousel';
import { DestinationCard } from '@/components/DestinationCard';
import { RightSidebar } from '@/components/RightSidebar';
import { AiPlannerModal } from '@/components/AiPlannerModal';
import { DestinationDetailModal } from '@/components/DestinationDetailModal';
import { ProfileModal } from '@/components/ProfileModal';
import { SavedTripModal } from '@/components/SavedTripModal';
import { AuthModal } from '@/components/AuthModal';
import { ProPlanModal } from '@/components/ProPlanModal';
import { TrainBookingAdvisor } from '@/components/TrainBookingAdvisor';
import { StaysBookingAdvisor } from '@/components/StaysBookingAdvisor';
import { DESTINATIONS } from '@/data/destinations';
import { searchDestinations, SearchResult } from '@/lib/searchEngine';
import { Destination, DestinationCategory, SavedTrip, TripPlan } from '@/types/travel';
import { useAuth } from '@/context/AuthContext';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import {
  Sparkles,
  Navigation2,
  Train,
  Plane,
  Bus,
  ShieldAlert,
  Clock,
  Settings as SettingsIcon,
  CheckCircle2,
  Trash2,
  Heart,
  Hotel,
  BookmarkCheck,
  Calendar,
  ExternalLink,
  MapPin,
  Check
} from 'lucide-react';

const DEFAULT_SAVED_TRIPS: SavedTrip[] = [
  {
    id: 'trip_default_1',
    destinationId: 'goa',
    destinationName: 'Goa Beaches',
    title: '4-Day BUDGET Voyage: Goa Beaches',
    daysCount: 4,
    budgetTier: 'budget',
    travelStyle: 'solo',
    totalCost: 1400,
    createdAt: new Date().toISOString(),
    dates: '16 Apr – 20 Apr',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80',
    plan: {
      title: '4-Day BUDGET Voyage: Goa Beaches',
      summary: 'Golden sunsets, heritage Portuguese villas in Fontainhas, vibrant beach shacks, and seaside scooter rides.',
      totalEstimatedCost: 1400,
      days: [
        {
          day: 1,
          theme: 'Arrival, Fontainhas Heritage & Sunset at Panjim',
          morning: 'Arrive at Madgaon/Thivim, check in to hostel, rent a scooter (₹350/day).',
          afternoon: 'Stroll through pastel-colored Latin Quarter of Fontainhas and visit traditional bakeries.',
          evening: 'Miramar beach sunset followed by authentic Goan fish curry thali dinner.',
          meals: {
            breakfast: 'Pao bhaji & tea at local Panjim bakery (₹80)',
            lunch: 'Goan fish thali at local canteen (₹180)',
            dinner: 'Rooftop seaside café dinner (₹250)',
          },
          estimatedCost: 350,
          tips: 'Rent a scooter with helmet at the railway station for easiest coastal transit.',
        },
        {
          day: 2,
          theme: 'North Goa Clifftops & Anjuna Flea Market',
          morning: 'Early morning hike up to Chapora Fort for panoramic sea cliff views.',
          afternoon: 'Relax at Vagator beach, explore Anjuna flea market, sample fresh poi sandwiches.',
          evening: 'Sunset gathering at Arambol beach followed by live acoustic music.',
          meals: {
            breakfast: 'Smoothie bowl & filter coffee (₹120)',
            lunch: 'Shack thali meal (₹180)',
            dinner: 'Beachfront acoustic dinner (₹280)',
          },
          estimatedCost: 350,
          tips: 'Carry cash for beach flea markets; UPI connectivity can be spotty right on the shore.',
        },
        {
          day: 3,
          theme: 'South Goa Hidden Coves & Palolem Kayaking',
          morning: 'Scenic coastal ride down to Palolem and Butterfly Beach; morning kayaking in calm waters.',
          afternoon: 'Explore Cabo de Rama fort ruins jutting dramatically into the turquoise Arabian Sea.',
          evening: 'Quiet sunset dinner at Agonda beach shack with fresh grilled catch.',
          meals: {
            breakfast: 'Pancakes and fresh tender coconut (₹100)',
            lunch: 'South Goan seafood lunch (₹200)',
            dinner: 'Agonda candlelit dinner (₹300)',
          },
          estimatedCost: 350,
          tips: 'South Goa beaches are much quieter and cleaner than North Goa.',
        },
        {
          day: 4,
          theme: 'Dudhsagar Waterfalls & Farewell Souvenirs',
          morning: 'Morning jeep safari excursion through Bhagwan Mahaveer Sanctuary to Dudhsagar Falls.',
          afternoon: 'Visit Sahakari Spice Farm for traditional buffet lunch and spice trail.',
          evening: 'Pick up cashew feni and bebinca sweets in Margao before departing.',
          meals: {
            breakfast: 'Puri bhaji at station canteen (₹80)',
            lunch: 'Traditional buffet at spice farm (₹200)',
            dinner: 'Station café snack (₹120)',
          },
          estimatedCost: 350,
          tips: 'Book Dudhsagar safari jeeps early in the morning to beat the rush.',
        },
      ],
      packingList: [
        'Quick-dry swim shorts & beachwear',
        'High SPF 50 sunscreen & sunglasses',
        'Waterproof phone pouch for kayaking',
        'Valid Driving License for scooter rental',
      ],
      safetyTips: [
        'Do not swim in red-flag zones or high swells.',
        'Wear helmets strictly while riding two-wheelers in Goa.',
      ],
      transportTips: 'Rent a two-wheeler (scooter) for ₹300-400/day. Vande Bharat Express connects Mumbai to Goa in 8 hours.',
    },
  },
];

export default function HomePage() {
  // Navigation & View state - Default to 'nearme' GPS radar as requested
  const [currentTab, setCurrentTab] = useState<NavTab>('nearme');
  const [selectedCategory, setSelectedCategory] = useState<DestinationCategory>('all');
  const [activeSubTab, setActiveSubTab] = useState<'popular' | 'offers' | 'nearme' | 'hostels'>('nearme');

  // Search & Filtering state
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['kerala', 'goa', 'kashmir']);
  const [travelerName, setTravelerName] = useState('SANIDHYA');

  // Auth & Database Context
  const { user, profile, isPro, isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const [isProModalOpen, setIsProModalOpen] = useState(false);
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  // Saved Trips state (Direct PostgreSQL + Guest LocalStorage fallback)
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>(DEFAULT_SAVED_TRIPS);
  const [selectedSavedTrip, setSelectedSavedTrip] = useState<SavedTrip | null>(null);
  const [isSavedTripModalOpen, setIsSavedTripModalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Modals state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiInitialDest, setAiInitialDest] = useState<Destination | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [trainAdvisorTargetDest, setTrainAdvisorTargetDest] = useState<Destination | null>(null);
  const [transportAdvisorMode, setTransportAdvisorMode] = useState<'train' | 'flight' | 'bus'>('train');

  // User Geolocation state for "Near Me" (Default to Gwalior coordinates: 26.2298, 78.1734)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>({ lat: 26.2298, lon: 78.1734 });

  // On mount or user change: load itineraries from PostgreSQL or localStorage
  useEffect(() => {
    handleRequestLocation();

    try {
      const savedFavs = localStorage.getItem('voyage_favs');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      const savedName = localStorage.getItem('voyage_name');
      if (savedName) {
        setTravelerName(savedName);
      }
    } catch {}

    // If authenticated, load directly from PostgreSQL public.itineraries with RLS
    if (user) {
      async function loadDatabaseItineraries() {
        try {
          const { data, error } = await supabase
            .from('itineraries')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const mapped: SavedTrip[] = data.map((row: any) => ({
              id: row.id,
              destinationId: row.destination_id,
              destinationName: row.destination_name,
              title: row.title,
              daysCount: row.days_count,
              budgetTier: row.budget_tier,
              travelStyle: row.travel_style,
              totalCost: Number(row.total_cost),
              createdAt: row.created_at,
              dates: row.dates,
              imageUrl: row.image_url || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1000&q=80',
              plan: row.plan_data as TripPlan,
            }));
            setSavedTrips(mapped);
          }
        } catch (err) {
          console.warn('Error loading cloud itineraries:', err);
        }
      }
      loadDatabaseItineraries();
    } else {
      // Guest mode: load from localStorage
      try {
        const storedTrips = localStorage.getItem('voyage_saved_trips');
        if (storedTrips) {
          const parsed = JSON.parse(storedTrips);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSavedTrips(parsed);
          }
        }
      } catch {}
    }
  }, [user, supabase]);

  // Save favorites
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem('voyage_favs', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Save generated trip to Supabase PostgreSQL or LocalStorage (Bug 6 Fix: Direct DB call)
  const handleSaveTrip = async (
    plan: TripPlan,
    destination: Destination,
    days: number,
    budgetTier: 'budget' | 'comfort' | 'luxury'
  ) => {
    const formattedDates = `${days} Days (${destination.bestSeason.split('(')[0].split('&')[0].trim()})`;
    const title = plan.title || `${days}-Day ${budgetTier.toUpperCase()} Voyage: ${destination.name.split(' ')[0]}`;
    const totalCost = plan.totalEstimatedCost || (destination.dailyCostBudget * days);

    if (user) {
      // Authenticated: insert directly into Supabase public.itineraries table
      try {
        const { data, error } = await supabase
          .from('itineraries')
          .insert({
            user_id: user.id,
            destination_id: destination.id,
            destination_name: destination.name.split('&')[0].trim(),
            title,
            days_count: days,
            budget_tier: budgetTier,
            travel_style: 'solo',
            total_cost: totalCost,
            dates: formattedDates,
            image_url: destination.imageUrl,
            plan_data: plan,
          })
          .select()
          .single();

        if (!error && data) {
          const newTrip: SavedTrip = {
            id: data.id,
            destinationId: data.destination_id,
            destinationName: data.destination_name,
            title: data.title,
            daysCount: data.days_count,
            budgetTier: data.budget_tier,
            travelStyle: data.travel_style,
            totalCost: Number(data.total_cost),
            createdAt: data.created_at,
            dates: data.dates,
            imageUrl: data.image_url || destination.imageUrl,
            plan: data.plan_data as TripPlan,
          };
          setSavedTrips((prev) => [newTrip, ...prev]);
          setSaveToast(`🎉 Cloud Synced! Your ${days}-day plan for ${destination.name.split(' ')[0]} is saved to PostgreSQL!`);
          setTimeout(() => setSaveToast(null), 5000);
          return;
        }
      } catch (err) {
        console.warn('Direct database insert failed, falling back to local state:', err);
      }
    }

    // Guest fallback: save to local state & localStorage
    const localTrip: SavedTrip = {
      id: 'trip_' + Date.now(),
      destinationId: destination.id,
      destinationName: destination.name.split('&')[0].trim(),
      title,
      daysCount: days,
      budgetTier: budgetTier,
      travelStyle: 'solo',
      totalCost,
      createdAt: new Date().toISOString(),
      dates: formattedDates,
      imageUrl: destination.imageUrl,
      plan,
    };

    const updated = [localTrip, ...savedTrips.filter((t) => t.id !== localTrip.id)];
    setSavedTrips(updated);
    try {
      localStorage.setItem('voyage_saved_trips', JSON.stringify(updated));
    } catch {}

    setSaveToast(`🎉 Saved locally! Sign in to sync your ${days}-day itinerary to the cloud.`);
    setTimeout(() => setSaveToast(null), 5000);
  };

  // Delete saved trip (PostgreSQL if authenticated, localStorage if guest)
  const handleDeleteTrip = async (id: string) => {
    if (user && !id.startsWith('trip_')) {
      try {
        await supabase.from('itineraries').delete().eq('id', id);
      } catch (err) {
        console.warn('Error deleting itinerary from database:', err);
      }
    }

    const updated = savedTrips.filter((t) => t.id !== id);
    setSavedTrips(updated);
    try {
      localStorage.setItem('voyage_saved_trips', JSON.stringify(updated));
    } catch {}
  };

  // Trigger browser geolocation for "Near Me"
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: 26.2298, lon: 78.1734 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      () => {
        setUserLocation({ lat: 26.2298, lon: 78.1734 });
      }
    );
  };

  // Haversine distance in km
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Handle sidebar tab changes
  const handleTabChange = (tab: NavTab) => {
    setCurrentTab(tab);
    setSearchQuery('');

    if (tab === 'nearme') {
      setActiveSubTab('nearme');
      handleRequestLocation();
    } else if (tab === 'stays') {
      setActiveSubTab('hostels');
    } else if (tab === 'dashboard' || tab === 'explore') {
      setActiveSubTab('popular');
    }
  };

  // Open AI planner with optional pre-selected destination
  const openAiPlanner = (dest?: Destination | null) => {
    setAiInitialDest(dest || null);
    setIsAiModalOpen(true);
  };

  // Handle search text changes with automatic tab switching if on non-grid tabs
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim() && (currentTab === 'stays' || currentTab === 'transport' || currentTab === 'settings' || currentTab === 'trips')) {
      setCurrentTab('explore');
    }
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim() && (currentTab === 'stays' || currentTab === 'transport' || currentTab === 'settings' || currentTab === 'trips')) {
      setCurrentTab('explore');
    }
  };

  // Search results metadata for UI feedback
  const searchResultsMeta = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return null;
    return searchDestinations(DESTINATIONS, trimmed, {
      userLocation,
      limit: 120,
      minScore: 50,
    });
  }, [searchQuery, userLocation]);

  // Filtered destinations list
  const filteredDestinations = useMemo(() => {
    let list: Destination[] = [];

    // If search query is active, use searchEngine (relevance is PRIMARY)
    if (searchQuery.trim()) {
      const results = searchResultsMeta || searchDestinations(DESTINATIONS, searchQuery.trim(), {
        userLocation,
        limit: 120,
        minScore: 50,
      });
      list = results.map((r) => r.destination);

      // Only apply category filter if user explicitly selected a specific category
      if (selectedCategory !== 'all') {
        list = list.filter((d) => d.category === selectedCategory);
      }
      return list;
    }

    list = [...DESTINATIONS];

    // Distance sorting is primary ONLY when query is empty and user is in nearme mode
    if ((activeSubTab === 'nearme' || currentTab === 'nearme') && userLocation) {
      list = list.filter((d) => d.country === 'India');
      list.sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude);
        const distB = calculateDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude);
        return distA - distB;
      });
    }

    // Sidebar tab filters
    if (currentTab === 'favourites') {
      list = list.filter((d) => favorites.includes(d.id));
    } else if (currentTab === 'stays') {
      list = list.filter((d) => d.hostels && d.hostels.length > 0);
    }

    // Category filter
    if (selectedCategory !== 'all' && (currentTab === 'dashboard' || currentTab === 'explore')) {
      list = list.filter((d) => d.category === selectedCategory);
    }

    // Sub-tab filter (for offers and hostels)
    if (activeSubTab === 'offers') {
      list = list.filter((d) => d.isSpecialOffer || (d.discountPercent && d.discountPercent > 0));
    } else if (activeSubTab === 'hostels') {
      list = list.filter((d) => d.hostels && d.hostels.length > 0);
    }

    return list;
  }, [searchQuery, searchResultsMeta, selectedCategory, activeSubTab, currentTab, favorites, userLocation]);

  // Easy Visa destinations carousel
  const easyVisaList = useMemo(() => {
    return DESTINATIONS.filter((d) => d.isEasyVisa || ['kashmir', 'goa'].includes(d.id));
  }, []);

  const openDestinationDetails = (destination: Destination) => {
    setSelectedDestination(destination);
    setIsDetailModalOpen(true);
  };

  const categories: Array<{ id: DestinationCategory; label: string; icon: string }> = [
    { id: 'all', label: 'All Places', icon: '✨' },
    { id: 'hills', label: 'Hills & Treks', icon: '🏔️' },
    { id: 'beaches', label: 'Beaches', icon: '🏖️' },
    { id: 'heritage', label: 'Heritage', icon: '🏰' },
    { id: 'wildlife', label: 'Wildlife', icon: '🐯' },
    { id: 'backwaters', label: 'Backwaters', icon: '🛶' },
    { id: 'spiritual', label: 'Spiritual', icon: '🛕' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#070a13] text-slate-100 font-sans selection:bg-[#d4f938] selection:text-black">
      {/* 1. Left Sidebar Navigation (Desktop only, hidden on mobile) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        favoritesCount={favorites.length}
        savedTripsCount={savedTrips.length}
        onOpenAiPlanner={() => openAiPlanner()}
        onOpenPromo={() => setIsProModalOpen(true)}
      />

      {/* 2. Mobile Bottom Navigation (Mobile & Tablet only, hidden on desktop) */}
      <MobileBottomNav
        currentTab={currentTab}
        onSelectTab={handleTabChange}
        favoritesCount={favorites.length}
        savedTripsCount={savedTrips.length}
        onOpenAiPlanner={() => openAiPlanner()}
        onOpenPromo={() => setIsProModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Center */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0e1a]">
        {/* Top Header with Clickable Profile Picture */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
          onOpenAiPlanner={() => openAiPlanner()}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          travelerName={travelerName}
          onSelectDestination={openDestinationDetails}
          userLocation={userLocation}
        />

        {/* Floating Toast when itinerary saved */}
        {saveToast && (
          <div className="fixed top-20 sm:top-24 right-4 sm:right-8 left-4 sm:left-auto z-50 p-4 rounded-2xl bg-[#111827] border border-[#d4f938]/60 text-xs text-white shadow-2xl flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#d4f938] text-black flex items-center justify-center font-bold shrink-0">
                ✓
              </div>
              <div>
                <p className="font-bold text-white leading-tight">{saveToast}</p>
                <button
                  onClick={() => {
                    setSaveToast(null);
                    handleTabChange('trips');
                  }}
                  className="text-[11px] text-[#d4f938] hover:underline font-semibold mt-0.5 cursor-pointer"
                >
                  View in My Itineraries →
                </button>
              </div>
            </div>
            <button
              onClick={() => setSaveToast(null)}
              className="text-slate-400 hover:text-white text-xs ml-2 p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Scrollable Main Body (Native window scroll on mobile, contained on desktop) */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:overflow-y-auto lg:max-h-[calc(100vh-5rem)] pb-28 lg:pb-8">
          {/* TAB 1: DASHBOARD VIEW */}
          {currentTab === 'dashboard' && (
            <>
              {/* Hero Greeting */}
              <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                      Hello {travelerName}!
                    </h1>
                    <span className="text-2xl">👋</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Welcome back — explore {DESTINATIONS.filter(d => d.country === 'India').length}+ Indian destinations across all states with accurate seasonal travel guides.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => handleTabChange('nearme')}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Navigation2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Radar Near Me</span>
                  </button>

                  <button
                    onClick={() => openAiPlanner()}
                    className="flex-1 sm:flex-initial px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#d4f938] to-lime-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create AI Plan</span>
                  </button>
                </div>
              </section>

              {/* Saved Trips Preview on Dashboard (FIX PROBLEM 3) */}
              {savedTrips.length > 0 && (
                <section className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookmarkCheck className="w-4 h-4 text-[#d4f938]" />
                      <h3 className="text-sm font-bold text-white">Your Saved Itineraries</h3>
                      <span className="text-[10px] font-mono font-bold bg-[#d4f938] text-black px-2 py-0.5 rounded-full">
                        {savedTrips.length} Active
                      </span>
                    </div>
                    <button
                      onClick={() => handleTabChange('trips')}
                      className="text-xs font-semibold text-[#d4f938] hover:underline"
                    >
                      View All Trips →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {savedTrips.slice(0, 3).map((trip) => (
                      <div
                        key={trip.id}
                        onClick={() => {
                          setSelectedSavedTrip(trip);
                          setIsSavedTripModalOpen(true);
                        }}
                        className="flex items-center gap-3 p-3 bg-[#162032] hover:bg-slate-800 border border-slate-700/80 rounded-xl cursor-pointer transition-all group"
                      >
                        <img
                          src={trip.imageUrl}
                          alt={trip.destinationName}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=200&q=80';
                          }}
                          className="w-12 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-white truncate group-hover:text-[#d4f938] transition-colors">
                            {trip.title}
                          </h4>
                          <span className="text-[11px] text-slate-400 block mt-0.5">
                            {trip.dates} • ₹{trip.totalCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Easy Visa Carousel */}
              <EasyVisaCarousel
                destinations={easyVisaList}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectDestination={openDestinationDetails}
                onViewAll={() => handleTabChange('explore')}
              />

              {/* Category Filter Pills */}
              <section className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      selectedCategory === cat.id
                        ? 'bg-[#d4f938] text-black border-[#d4f938] font-bold shadow-md shadow-[#d4f938]/15'
                        : 'bg-[#111827] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </section>

              {/* Sub-Tabs */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm font-semibold overflow-x-auto no-scrollbar whitespace-nowrap py-0.5 w-full sm:w-auto">
                  {[
                    { key: 'popular' as const, label: 'Most Popular' },
                    { key: 'offers' as const, label: 'Special Offers', badge: '50%', badgeColor: 'bg-rose-500/20 text-rose-300' },
                    { key: 'nearme' as const, label: 'Near Me', badge: 'GPS', badgeColor: 'bg-teal-500/20 text-teal-300' },
                    { key: 'hostels' as const, label: 'Backpacker Stays' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => {
                        setActiveSubTab(tab.key);
                        if (tab.key === 'nearme' && !userLocation) handleRequestLocation();
                      }}
                      className={`relative pb-2.5 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${
                        activeSubTab === tab.key ? 'text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${tab.badgeColor}`}>
                          {tab.badge}
                        </span>
                      )}
                      {activeSubTab === tab.key && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#d4f938] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <span className="text-xs text-slate-400 font-medium hidden md:inline shrink-0 ml-4">
                  {filteredDestinations.length} destinations
                </span>
              </div>
            </>
          )}

          {/* TAB 2: EXPLORE ALL PLACES VIEW */}
          {currentTab === 'explore' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  🧭 Explore India Directory
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Discover {DESTINATIONS.length} destinations with exact seasonal travel windows across all Indian states and territories.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                      selectedCategory === cat.id
                        ? 'bg-[#d4f938] text-black border-[#d4f938] font-bold shadow-md shadow-[#d4f938]/15'
                        : 'bg-[#111827] text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
                <span>Showing {filteredDestinations.length} matching destinations</span>
                <span>Sorted by curated popularity</span>
              </div>
            </div>
          )}

          {/* TAB: MY SAVED ITINERARIES (FIX PROBLEM 3) */}
          {currentTab === 'trips' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    <BookmarkCheck className="w-7 h-7 text-[#d4f938]" />
                    <span>My Saved Itineraries</span>
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">
                    Access, view full day-by-day schedules, packing lists, and manage your saved travel plans.
                  </p>
                </div>

                <button
                  onClick={() => openAiPlanner()}
                  className="px-5 py-2.5 rounded-xl bg-[#d4f938] hover:bg-[#bde629] text-black font-extrabold text-xs flex items-center gap-2 shadow-md shadow-[#d4f938]/20 transition-all self-start sm:self-auto"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate New Itinerary</span>
                </button>
              </div>

              {savedTrips.length === 0 ? (
                <div className="text-center py-16 p-8 rounded-3xl bg-[#111827] border border-slate-800 space-y-4">
                  <div className="text-5xl">🎒</div>
                  <h3 className="text-lg font-bold text-white">No Saved Itineraries Yet</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Generate an itinerary with our AI Trip Planner and click &ldquo;Save to My Trips&rdquo; to store it here for offline access!
                  </p>
                  <button
                    onClick={() => openAiPlanner()}
                    className="px-5 py-2.5 rounded-xl bg-[#d4f938] text-black text-xs font-bold"
                  >
                    Create Your First Itinerary
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {savedTrips.map((trip) => (
                    <div
                      key={trip.id}
                      className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700 space-y-4 flex flex-col justify-between shadow-lg group transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={trip.imageUrl}
                          alt={trip.destinationName}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-[#d4f938]/15 text-[#d4f938]">
                              {trip.daysCount} Days
                            </span>
                            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300">
                              {trip.budgetTier}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-white leading-tight">
                            {trip.title}
                          </h3>
                          <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{trip.dates}</span>
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                        {trip.plan.summary}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                            Estimated Total
                          </span>
                          <span className="text-sm font-bold text-[#d4f938] font-mono">
                            ₹ {trip.totalCost.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeleteTrip(trip.id)}
                            title="Delete Itinerary"
                            className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSavedTrip(trip);
                              setIsSavedTripModalOpen(true);
                            }}
                            className="px-4 py-2 rounded-xl bg-[#d4f938] hover:bg-[#bde629] text-black font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-[#d4f938]/15"
                          >
                            <span>View Full Plan</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: NEAR ME RADAR VIEW */}
          {currentTab === 'nearme' && !searchQuery.trim() && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Navigation2 className="w-6 h-6 text-teal-400" />
                  <span>Near Me GPS Radar</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Indian travel spots sorted by real spherical distance from your exact GPS location.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-800/40 flex items-center justify-between text-xs text-teal-200">
                <div className="flex items-center gap-2">
                  <Navigation2 className="w-4 h-4 text-teal-400 animate-pulse" />
                  <span>
                    {userLocation
                      ? `Active GPS: (${userLocation.lat.toFixed(2)}°N, ${userLocation.lon.toFixed(2)}°E) • Destinations sorted closest to farthest`
                      : 'Requesting GPS access to calculate distances...'}
                  </span>
                </div>
                <button onClick={handleRequestLocation} className="text-xs font-bold text-[#d4f938] hover:underline">
                  Recalculate GPS
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: HOTELS, DORMS & HOSTELS ADVISOR */}
          {currentTab === 'stays' && (
            <StaysBookingAdvisor
              initialDestination={selectedDestination}
              userCoords={userLocation}
            />
          )}

          {/* TAB 5: FAVOURITES VIEW */}
          {currentTab === 'favourites' && !searchQuery.trim() && (
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                  <span>Your Saved Favourites</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {favorites.length > 0
                    ? `You have saved ${favorites.length} destinations for your upcoming journeys.`
                    : 'No saved destinations yet. Click the ❤️ heart icon on any destination card to bookmark it!'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 6: MULTI-MODAL TRANSPORT ADVISOR (TRAIN, FLIGHT, BUS) */}
          {currentTab === 'transport' && (
            <TrainBookingAdvisor
              initialDestination={trainAdvisorTargetDest}
              userCoords={userLocation}
              initialMode={transportAdvisorMode}
            />
          )}

          {/* TAB 7: SETTINGS VIEW */}
          {currentTab === 'settings' && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <SettingsIcon className="w-6 h-6 text-slate-400" />
                  <span>Traveler Profile & Settings</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Configure your traveler display name, preferences, and offline data.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Traveler Display Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={travelerName}
                      onChange={(e) => {
                        setTravelerName(e.target.value);
                        try {
                          localStorage.setItem('voyage_name', e.target.value);
                        } catch {}
                      }}
                      className="flex-1 bg-[#162032] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#d4f938]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    AI Itinerary Engine
                  </span>
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">Google Gemini 2.0 Flash</span>
                      <span className="text-slate-400">100% Free Tier (1M tokens/day) with smart built-in fallback</span>
                    </div>
                    <span className="text-[10px] font-mono bg-[#d4f938] text-black font-bold px-2 py-0.5 rounded-md">
                      Active
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">Clear Saved Favourites</span>
                    <span className="text-[11px] text-slate-400">Removes all {favorites.length} bookmarks from local storage</span>
                  </div>
                  <button
                    onClick={() => {
                      setFavorites([]);
                      try {
                        localStorage.removeItem('voyage_favs');
                      } catch {}
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Favourites</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* DESTINATIONS GRID (RENDERED FOR DASHBOARD, EXPLORE, NEARME, FAVOURITES) */}
          {currentTab !== 'transport' && currentTab !== 'settings' && currentTab !== 'trips' && currentTab !== 'stays' && (
            <>
              {/* Search Feedback Banner */}
              {searchQuery.trim() && (
                <div className="p-4 rounded-2xl bg-[#111827] border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#d4f938]/15 border border-[#d4f938]/30 flex items-center justify-center text-[#d4f938] shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-white">
                          Showing {filteredDestinations.length} result{filteredDestinations.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
                        </span>
                        {searchResultsMeta && searchResultsMeta.length > 0 && searchResultsMeta[0].isAutoCorrected && searchResultsMeta[0].suggestedTerm && (
                          <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                            Fuzzy matched &ldquo;{searchResultsMeta[0].suggestedTerm}&rdquo;
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Layered matching active: exact titles &amp; aliases take precedence over tags with typo tolerance.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSearchQuery('')}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto shrink-0 border border-slate-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear Search</span>
                  </button>
                </div>
              )}

              {filteredDestinations.length === 0 ? (
                <div className="text-center py-16 p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-3">
                  <div className="text-4xl">🏝️</div>
                  <h3 className="text-base font-bold text-white">No destinations found</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Try adjusting your search or switch category to see all Indian destinations.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setActiveSubTab('popular');
                      setCurrentTab('dashboard');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#d4f938] text-black text-xs font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-3.5 sm:gap-4">
                  {filteredDestinations.map((dest) => {
                    const dist =
                      userLocation
                        ? calculateDistance(userLocation.lat, userLocation.lon, dest.latitude, dest.longitude)
                        : null;

                    return (
                      <DestinationCard
                        key={dest.id}
                        destination={dest}
                        isFavorite={favorites.includes(dest.id)}
                        onToggleFavorite={toggleFavorite}
                        onSelect={openDestinationDetails}
                        distanceKm={activeSubTab === 'nearme' || currentTab === 'nearme' ? dist : null}
                      />
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 3. Right Sidebar (Calendar, Bookings & Real Saved Trips, Live Weather, IRCTC countdown) */}
      <RightSidebar
        selectedCity={selectedDestination ? selectedDestination.name.split(' ')[0] : 'Goa'}
        selectedCityLat={selectedDestination ? selectedDestination.latitude : 15.2993}
        selectedCityLon={selectedDestination ? selectedDestination.longitude : 74.124}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => {
          setSelectedSavedTrip(trip);
          setIsSavedTripModalOpen(true);
        }}
        onViewAllTrips={() => handleTabChange('trips')}
        onOpenAiPlanner={() => openAiPlanner()}
        onOpenTrainAdvisor={() => {
          if (selectedDestination) {
            setTrainAdvisorTargetDest(selectedDestination);
          }
          handleTabChange('transport');
        }}
      />

      {/* 4. AI Trip Planner Modal (Gemini Flash + smart guaranteed generator + ON SAVE HANDLER) */}
      <AiPlannerModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        destinations={DESTINATIONS}
        initialDestination={aiInitialDest}
        onSaveTrip={handleSaveTrip}
      />

      {/* 5. Place Details Modal (Viewpoints, Hostels, Weather, Booking Rules) */}
      <DestinationDetailModal
        destination={selectedDestination}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        isFavorite={selectedDestination ? favorites.includes(selectedDestination.id) : false}
        onToggleFavorite={toggleFavorite}
        onOpenAiPlanner={(dest) => {
          setIsDetailModalOpen(false);
          openAiPlanner(dest);
        }}
        onOpenTrainAdvisor={(dest, mode = 'train') => {
          setIsDetailModalOpen(false);
          setTrainAdvisorTargetDest(dest);
          setTransportAdvisorMode(mode);
          handleTabChange('transport');
        }}
        onOpenStaysAdvisor={(dest) => {
          setIsDetailModalOpen(false);
          setSelectedDestination(dest);
          handleTabChange('stays');
        }}
      />

      {/* 6. Profile Modal (FIX PROBLEM 1: CLICKABLE PROFILE) */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        travelerName={travelerName}
        onUpdateName={(name) => {
          setTravelerName(name);
          try {
            localStorage.setItem('voyage_name', name);
          } catch {}
        }}
        savedTripsCount={savedTrips.length}
        favoritesCount={favorites.length}
        onViewTrips={() => {
          setIsProfileModalOpen(false);
          handleTabChange('trips');
        }}
        onOpenProModal={() => setIsProModalOpen(true)}
      />

      {/* 7. Saved Trip View Modal (FIX PROBLEM 3: FULL SAVED ITINERARY SCHEDULE VIEW) */}
      <SavedTripModal
        trip={selectedSavedTrip}
        isOpen={isSavedTripModalOpen}
        onClose={() => setIsSavedTripModalOpen(false)}
        onDeleteTrip={handleDeleteTrip}
      />

      {/* 8. Auth Modal (Google OAuth & Email/Password Sign In) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* 9. Voyage Pro Plan Modal (Razorpay Payment Gateway Integration) */}
      <ProPlanModal
        isOpen={isProModalOpen}
        onClose={() => setIsProModalOpen(false)}
      />

      {/* 10. Promo Modal (50% Discount Popup) */}
      {isPromoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#111827] border border-lime-400/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-[#d4f938]/10 text-3xl sm:text-4xl flex items-center justify-center">🎉</div>
            <div>
              <span className="text-[11px] font-bold text-[#d4f938] uppercase tracking-wider">Limited Time</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-1">50% Discount on Off-Peak Dates!</h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Save up to 50% on boutique hostels in Goa, Kerala, and Himachal by booking mid-week (Tue-Thu).
              </p>
            </div>
            <div className="bg-[#090d16] p-3 rounded-xl border border-slate-800 text-xs font-mono text-lime-300">
              Promo Code: <strong className="text-white font-bold">VOYAGE50</strong>
            </div>
            <div className="flex gap-2.5 sm:gap-3 pt-2">
              <button onClick={() => setIsPromoModalOpen(false)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer">Close</button>
              <button onClick={() => { setIsPromoModalOpen(false); openAiPlanner(); }} className="flex-1 py-2.5 rounded-xl bg-[#d4f938] hover:bg-lime-400 text-black font-extrabold text-xs shadow-md shadow-lime-500/20 cursor-pointer">Plan Trip</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
