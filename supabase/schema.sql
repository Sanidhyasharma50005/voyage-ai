-- =============================================================================
-- VOYAGE PRO — PRODUCTION DATABASE SCHEMA & SECURITY POLICIES
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  home_city TEXT DEFAULT 'New Delhi, India',
  bio TEXT DEFAULT 'Passionate traveler exploring India.',
  is_pro BOOLEAN NOT NULL DEFAULT false,
  pro_plan_name TEXT,
  pro_valid_until TIMESTAMPTZ,
  razorpay_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Strict row isolation (no public exposure of emails or payment identifiers)
CREATE POLICY "Users can view own profile only"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own non-sensitive profile info"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Privilege escalation prevention trigger:
-- Ensures only service_role (backend Server Route) or postgres superuser can alter subscription fields
CREATE OR REPLACE FUNCTION public.protect_profile_privilege_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF current_user NOT IN ('service_role', 'postgres', 'supabase_admin') AND
     COALESCE(current_setting('request.jwt.claim.role', true), '') <> 'service_role' THEN
    IF (NEW.is_pro IS DISTINCT FROM OLD.is_pro) OR
       (NEW.pro_plan_name IS DISTINCT FROM OLD.pro_plan_name) OR
       (NEW.pro_valid_until IS DISTINCT FROM OLD.pro_valid_until) OR
       (NEW.razorpay_customer_id IS DISTINCT FROM OLD.razorpay_customer_id) THEN
      RAISE EXCEPTION 'Unauthorized: Subscription fields can only be modified by authorized payment handlers.';
    END IF;
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_privilege_escalation ON public.profiles;
CREATE TRIGGER tr_protect_profile_privilege_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_privilege_escalation();

-- Trigger to automatically create profile row when new auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', null)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 2. ORDERS / PAYMENTS LEDGER TABLE (Replay Attack Defense & Compliance)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Financial records persist even if user deletes profile
  razorpay_order_id TEXT NOT NULL UNIQUE,
  razorpay_payment_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'fulfilled', 'failed')),
  plan_code TEXT NOT NULL DEFAULT 'voyage_pro_pass',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance & Uniqueness Indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON public.orders(razorpay_order_id);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own payment receipts
CREATE POLICY "Users can view own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Service role manages orders completely
CREATE POLICY "Service role manages orders"
  ON public.orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 3. ITINERARIES TABLE (Direct Supabase Access with Full RLS)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id TEXT NOT NULL,
  destination_name TEXT NOT NULL,
  title TEXT NOT NULL,
  days_count INT NOT NULL,
  budget_tier TEXT NOT NULL CHECK (budget_tier IN ('budget', 'comfort', 'luxury')),
  travel_style TEXT DEFAULT 'solo',
  total_cost NUMERIC NOT NULL DEFAULT 0,
  dates TEXT NOT NULL,
  image_url TEXT,
  plan_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance indexes for rapid user-filtered queries
CREATE INDEX IF NOT EXISTS idx_itineraries_user_id ON public.itineraries(user_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_created_at ON public.itineraries(created_at DESC);

ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select own itineraries"
  ON public.itineraries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own itineraries"
  ON public.itineraries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own itineraries"
  ON public.itineraries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own itineraries"
  ON public.itineraries FOR DELETE
  USING (auth.uid() = user_id);
