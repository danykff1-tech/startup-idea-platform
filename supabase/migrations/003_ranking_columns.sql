-- =============================================================
-- 003: Ranking algorithm columns + source_platform expansion
-- Prerequisites: 001_initial_schema.sql, 002_email_subscribers.sql
-- =============================================================

-- 1. Expand source_platform to include 'hackernews' and allow NULL
--    (source_platform is optional in the ingest route since earlier fix)
ALTER TABLE public.ideas ALTER COLUMN source_platform DROP NOT NULL;
ALTER TABLE public.ideas DROP CONSTRAINT IF EXISTS ideas_source_platform_check;
ALTER TABLE public.ideas
  ADD CONSTRAINT ideas_source_platform_check
  CHECK (source_platform IS NULL OR source_platform IN (
    'reddit', 'indiehackers', 'producthunt', 'hackernews'
  ));

-- 2. Add AI analysis text columns (idempotent — safe to run multiple times)
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS competitive_edge TEXT;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS why_now          TEXT;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS market_gap       TEXT;

-- 3. Add ranking / classification columns
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS ranking_score  NUMERIC(5,2) NOT NULL DEFAULT 0;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_pro_pick    BOOLEAN      NOT NULL DEFAULT FALSE;
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS mention_count  INTEGER               DEFAULT 1;

-- 4. Performance indexes for feed & Pro Picks queries
CREATE INDEX IF NOT EXISTS idx_ideas_ranking_score
  ON public.ideas (ranking_score DESC)
  WHERE is_published = TRUE;

CREATE INDEX IF NOT EXISTS idx_ideas_pro_pick
  ON public.ideas (is_pro_pick, ranking_score DESC)
  WHERE is_pro_pick = TRUE AND is_published = TRUE;

-- 5. Helper: recompute Pro Pick labels (dynamic top-5% threshold)
--    Call manually: SELECT recompute_pro_picks();
--    Or schedule with pg_cron / Supabase Edge Function cron.
CREATE OR REPLACE FUNCTION public.recompute_pro_picks()
RETURNS void AS $$
DECLARE
  p95 NUMERIC;
BEGIN
  SELECT PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ranking_score)
  INTO p95
  FROM public.ideas
  WHERE is_published = TRUE;

  IF p95 IS NOT NULL THEN
    UPDATE public.ideas
    SET is_pro_pick = (ranking_score >= p95)
    WHERE is_published = TRUE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
