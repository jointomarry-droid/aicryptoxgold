-- Run this SQL in your Supabase SQL Editor (Dashboard > SQL Editor)
-- This creates the price_alerts table used by the user profile page

CREATE TABLE IF NOT EXISTS public.price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset TEXT NOT NULL,
  target_price DOUBLE PRECISION NOT NULL,
  condition TEXT NOT NULL CHECK (condition IN ('above', 'below')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.price_alerts ENABLE ROW LEVEL SECURITY;

-- Users can only read their own alerts
CREATE POLICY "Users can view own alerts"
  ON public.price_alerts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own alerts
CREATE POLICY "Users can insert own alerts"
  ON public.price_alerts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own alerts
CREATE POLICY "Users can delete own alerts"
  ON public.price_alerts FOR DELETE
  USING (auth.uid() = user_id);

-- Enable real-time for the table (for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.price_alerts;
