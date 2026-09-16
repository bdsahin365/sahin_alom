-- ====================================================================
-- Wedding RSVPs Table Migration
-- Run this in your Supabase SQL Editor to enable dedicated RSVP storage
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.wedding_rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT,
  event TEXT DEFAULT 'All Celebrations',
  guests INTEGER DEFAULT 1,
  notes TEXT,
  confirmed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.wedding_rsvps ENABLE ROW LEVEL SECURITY;

-- Allow public guests to submit RSVP without logging in
DROP POLICY IF EXISTS "Public insert wedding_rsvps" ON public.wedding_rsvps;
CREATE POLICY "Public insert wedding_rsvps" ON public.wedding_rsvps 
  FOR INSERT WITH CHECK (true);

-- Allow reading RSVPs
DROP POLICY IF EXISTS "Read wedding_rsvps" ON public.wedding_rsvps;
CREATE POLICY "Read wedding_rsvps" ON public.wedding_rsvps 
  FOR SELECT USING (true);

-- Allow deleting/updating RSVPs
DROP POLICY IF EXISTS "Admin modify wedding_rsvps" ON public.wedding_rsvps;
CREATE POLICY "Admin modify wedding_rsvps" ON public.wedding_rsvps 
  FOR ALL USING (true) WITH CHECK (true);
