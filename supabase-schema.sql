-- Diamond IQ Database Schema
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE
-- Extends auth.users with app-specific fields
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create profile automatically when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 2. DRILL_SESSIONS TABLE
-- Aggregated stats per user (one row per user)
-- ============================================
CREATE TABLE IF NOT EXISTS public.drill_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_attempts INTEGER DEFAULT 0 NOT NULL,
  total_correct INTEGER DEFAULT 0 NOT NULL,
  best_streak INTEGER DEFAULT 0 NOT NULL,
  scenarios_mastered INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_user_session UNIQUE (user_id)
);

-- ============================================
-- 3. SCENARIO_PROGRESS TABLE
-- Per-scenario tracking with SM-2 algorithm fields
-- ============================================
CREATE TYPE answer_quality AS ENUM ('best', 'ok', 'bad', 'timeout');

CREATE TABLE IF NOT EXISTS public.scenario_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES public.drill_sessions(id) ON DELETE CASCADE,
  scenario_id TEXT NOT NULL,

  -- Counters
  correct INTEGER DEFAULT 0 NOT NULL,
  incorrect INTEGER DEFAULT 0 NOT NULL,
  partial INTEGER DEFAULT 0 NOT NULL,
  timeouts INTEGER DEFAULT 0 NOT NULL,
  repetitions INTEGER DEFAULT 0 NOT NULL,

  -- SM-2 algorithm fields
  interval_days REAL DEFAULT 1 NOT NULL,
  ease REAL DEFAULT 2.5 NOT NULL,
  next_due TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Last attempt tracking
  last_shown TIMESTAMPTZ,
  last_answer answer_quality,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  CONSTRAINT unique_user_scenario UNIQUE (user_id, scenario_id)
);

-- ============================================
-- 4. TRIGGER: Update session aggregates
-- ============================================
CREATE OR REPLACE FUNCTION public.update_session_aggregates()
RETURNS TRIGGER AS $$
DECLARE
  v_session_id UUID;
  v_total_attempts INTEGER;
  v_total_correct INTEGER;
  v_scenarios_mastered INTEGER;
BEGIN
  -- Get the session_id from the modified row
  v_session_id := COALESCE(NEW.session_id, OLD.session_id);

  -- Calculate aggregates
  SELECT
    COALESCE(SUM(correct + incorrect + partial + timeouts), 0),
    COALESCE(SUM(correct), 0),
    COALESCE(COUNT(*) FILTER (WHERE (correct::REAL / NULLIF(correct + incorrect + partial, 0)) >= 0.8 AND (correct + incorrect + partial) >= 3), 0)
  INTO v_total_attempts, v_total_correct, v_scenarios_mastered
  FROM public.scenario_progress
  WHERE session_id = v_session_id;

  -- Update the session
  UPDATE public.drill_sessions
  SET
    total_attempts = v_total_attempts,
    total_correct = v_total_correct,
    scenarios_mastered = v_scenarios_mastered,
    updated_at = NOW()
  WHERE id = v_session_id;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_scenario_progress_change ON public.scenario_progress;
CREATE TRIGGER on_scenario_progress_change
  AFTER INSERT OR UPDATE OR DELETE ON public.scenario_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_session_aggregates();

-- ============================================
-- 5. LEADERBOARD VIEW (Materialized for performance)
-- ============================================
CREATE MATERIALIZED VIEW IF NOT EXISTS public.leaderboard_stats AS
SELECT
  ds.user_id,
  p.display_name,
  CASE
    WHEN ds.total_attempts > 0
    THEN ROUND((ds.total_correct::NUMERIC / ds.total_attempts) * 100, 1)
    ELSE 0
  END AS accuracy_pct,
  ds.best_streak,
  ds.scenarios_mastered,
  ds.total_attempts
FROM public.drill_sessions ds
JOIN public.profiles p ON ds.user_id = p.id
WHERE ds.total_attempts >= 10  -- Minimum attempts to appear on leaderboard
ORDER BY accuracy_pct DESC, ds.best_streak DESC;

-- Index for faster queries
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_user ON public.leaderboard_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_accuracy ON public.leaderboard_stats(accuracy_pct DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_streak ON public.leaderboard_stats(best_streak DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_mastered ON public.leaderboard_stats(scenarios_mastered DESC);

-- Function to refresh leaderboard
CREATE OR REPLACE FUNCTION public.refresh_leaderboard()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drill_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scenario_progress ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Drill Sessions: Users can CRUD their own sessions
CREATE POLICY "Users can view own sessions" ON public.drill_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON public.drill_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions" ON public.drill_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions" ON public.drill_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Scenario Progress: Users can CRUD their own progress
CREATE POLICY "Users can view own progress" ON public.scenario_progress
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.scenario_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.scenario_progress
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.scenario_progress
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- 7. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_drill_sessions_user ON public.drill_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_progress_user ON public.scenario_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_scenario_progress_session ON public.scenario_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_scenario_progress_scenario ON public.scenario_progress(scenario_id);
CREATE INDEX IF NOT EXISTS idx_scenario_progress_next_due ON public.scenario_progress(next_due);
