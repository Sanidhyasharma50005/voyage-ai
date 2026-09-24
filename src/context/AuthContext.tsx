'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { Profile, ItineraryRecord } from '@/lib/supabase/types';
import { SavedTrip } from '@/types/travel';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isPro: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfileName: (name: string) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const configured = isSupabaseConfigured();
  const supabase = getSupabaseBrowserClient();

  // Helper: Load profile data for a specific user ID
  const fetchProfile = useCallback(async (userId: string) => {
    if (!configured) return;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Could not fetch user profile:', error.message);
      } else if (data) {
        setProfile(data as Profile);
      }
    } catch (err) {
      console.warn('Profile fetch error:', err);
    }
  }, [configured, supabase]);

  // Bug 4 & Edge Case 1: Synchronize local guest itineraries to cloud PostgreSQL upon login
  const syncGuestItineraries = useCallback(async (userId: string) => {
    if (!configured) return;
    try {
      const localTripsStr = localStorage.getItem('voyage_saved_trips');
      if (!localTripsStr) return;

      const localTrips: SavedTrip[] = JSON.parse(localTripsStr);
      if (!Array.isArray(localTrips) || localTrips.length === 0) return;

      // Filter out any dummy sample trips (e.g. trip_default_1) if desired, or sync all
      const tripsToSync = localTrips.filter((t) => !t.id.startsWith('cloud_'));
      if (tripsToSync.length === 0) return;

      // Inject authenticated user_id and format for PostgreSQL schema
      const payload: Omit<ItineraryRecord, 'id' | 'created_at' | 'updated_at'>[] = tripsToSync.map((trip) => ({
        user_id: userId,
        destination_id: trip.destinationId || 'custom',
        destination_name: trip.destinationName || trip.title.split(':')[1]?.trim() || 'India Voyage',
        title: trip.title,
        days_count: trip.daysCount || 4,
        budget_tier: trip.budgetTier || 'budget',
        travel_style: trip.travelStyle || 'solo',
        total_cost: trip.totalCost || 0,
        dates: trip.dates || 'Seasonal Voyage',
        image_url: trip.imageUrl || null,
        plan_data: trip.plan,
      }));

      // Insert directly into public.itineraries with RLS
      const { error } = await supabase.from('itineraries').insert(payload);
      if (!error) {
        // Clear guest storage after successful cloud sync
        localStorage.removeItem('voyage_saved_trips');
        console.log(`[Voyage Cloud] Successfully synced ${payload.length} guest itineraries to PostgreSQL.`);
      } else {
        console.warn('[Voyage Cloud] Error syncing guest itineraries:', error.message);
      }
    } catch (err) {
      console.warn('[Voyage Cloud] Guest sync exception:', err);
    }
  }, [configured, supabase]);

  // Initial session check & auth listener
  useEffect(() => {
    if (!configured) {
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          if (session?.user) {
            await fetchProfile(session.user.id);
            await syncGuestItineraries(session.user.id);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initAuth();

    // Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, currentSession: any) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
          if (event === 'SIGNED_IN') {
            await syncGuestItineraries(currentSession.user.id);
          }
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, supabase, fetchProfile, syncGuestItineraries]);

  // Sign In with Google OAuth
  const signInWithGoogle = async () => {
    if (!configured) {
      return { error: new Error('Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local') };
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
      },
    });
    return { error };
  };

  // Sign In with Email & Password
  const signInWithEmail = async (email: string, password: string) => {
    if (!configured) {
      return { error: new Error('Supabase credentials missing. Running in local demo mode.') };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // Sign Up with Email & Password
  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    if (!configured) {
      return { error: new Error('Supabase credentials missing. Running in local demo mode.') };
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || splitEmail(email),
        },
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });
    return { error };
  };

  // Sign Out
  const signOut = async () => {
    if (configured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  // Refresh Profile (Bug 8 Fix: invoked post-checkout or on demand)
  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  // Update Display Name
  const updateProfileName = async (name: string) => {
    if (!user || !configured) return { error: null };
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', user.id);

    if (!error) {
      setProfile((prev) => (prev ? { ...prev, full_name: name } : null));
    }
    return { error };
  };

  const isPro = Boolean(profile?.is_pro);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isPro,
        isLoading,
        isConfigured: configured,
        isAuthModalOpen,
        setIsAuthModalOpen,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        refreshProfile,
        updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function splitEmail(email: string): string {
  const name = email.split('@')[0] || 'Traveler';
  return name.charAt(0).toUpperCase() + name.slice(1);
}
