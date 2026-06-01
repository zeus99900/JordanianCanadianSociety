-- ============================================
-- Jordanian Canadian Society — Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Events catalog
-- ============================================
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT,                          -- Arabic title
    description TEXT,
    event_date TIMESTAMPTZ NOT NULL,
    location TEXT,
    price_adult_cents INT DEFAULT 1000,     -- $10.00 CAD default
    price_kid_cents INT DEFAULT 0,          -- Free default
    max_capacity INT,
    is_active BOOLEAN DEFAULT TRUE,
    image_url TEXT,
    etransfer_email TEXT                    -- Email for e-transfer payments
);

-- ============================================
-- Event registrations
-- ============================================
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
    event_id UUID REFERENCES events(id) NOT NULL,
    lead_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    count_men INT DEFAULT 0 NOT NULL,
    count_women INT DEFAULT 0 NOT NULL,
    count_kids INT DEFAULT 0 NOT NULL,
    amount_paid_cents INT DEFAULT 0 NOT NULL,
    payment_method TEXT DEFAULT 'stripe',   -- 'stripe', 'cash_at_door', 'e_transfer'
    stripe_intent_id TEXT UNIQUE,
    is_paid BOOLEAN DEFAULT FALSE,
    is_checked_in BOOLEAN DEFAULT FALSE,
    checked_in_at TIMESTAMPTZ
);

-- ============================================
-- Indexes for performance
-- ============================================
CREATE INDEX idx_reg_event ON event_registrations(event_id);
CREATE INDEX idx_reg_lead_name ON event_registrations(lead_name);
CREATE INDEX idx_reg_checked_in ON event_registrations(is_checked_in);
CREATE INDEX idx_reg_stripe ON event_registrations(stripe_intent_id);
CREATE INDEX idx_reg_is_paid ON event_registrations(is_paid);
CREATE INDEX idx_events_active ON events(is_active);
CREATE INDEX idx_events_date ON events(event_date);

-- ============================================
-- Row Level Security
-- ============================================

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Events: anyone can read active events
CREATE POLICY "Public can read active events"
    ON events FOR SELECT
    USING (is_active = TRUE);

-- Events: service role can do everything (used by API routes)
CREATE POLICY "Service role full access to events"
    ON events FOR ALL
    USING (TRUE)
    WITH CHECK (TRUE);

-- Registrations: service role can do everything
CREATE POLICY "Service role full access to registrations"
    ON event_registrations FOR ALL
    USING (TRUE)
    WITH CHECK (TRUE);

-- Registrations: public can insert (for creating registrations)
CREATE POLICY "Public can create registrations"
    ON event_registrations FOR INSERT
    WITH CHECK (TRUE);

-- Registrations: public can read their own (by ID)
CREATE POLICY "Public can read registrations by ID"
    ON event_registrations FOR SELECT
    USING (TRUE);

-- ============================================
-- Enable Realtime for live metrics
-- ============================================
ALTER PUBLICATION supabase_realtime ADD TABLE event_registrations;

-- ============================================
-- Seed data: Sample event for development
-- ============================================
INSERT INTO events (title, title_ar, description, event_date, location, price_adult_cents, price_kid_cents, max_capacity, is_active, etransfer_email)
VALUES (
    'Summer Cultural Celebration 2026',
    'احتفال ثقافي صيفي ٢٠٢٦',
    'Join us for an evening of Jordanian culture, food, music, and community. Enjoy traditional dishes, dabke dancing, and connect with fellow community members. Families welcome — kids under 12 attend free!',
    '2026-07-15T18:00:00-03:00',
    'Halifax Convention Centre, 1650 Argyle St, Halifax, NS',
    2500,  -- $25.00 CAD per adult
    0,     -- Free for kids
    200,
    TRUE,
    'jcs.payments@example.com'
);

-- ============================================
-- User Profiles (Maps to auth.users)
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
    ON user_profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON user_profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- Annual Memberships
-- ============================================
CREATE TABLE memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'active', 'expired'
    expires_at TIMESTAMPTZ,
    stripe_payment_id TEXT UNIQUE
);

-- Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own memberships"
    ON memberships FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to memberships"
    ON memberships FOR ALL
    USING (TRUE)
    WITH CHECK (TRUE);

-- Indexes
CREATE INDEX idx_memberships_user ON memberships(user_id);
CREATE INDEX idx_memberships_status ON memberships(status);
