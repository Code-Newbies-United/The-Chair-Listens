-- fix-pins-aggregate.sql
--
-- WHY: the live map used to download EVERY visitor pin from the last 24 hours
-- and count them in Node. Supabase's API returns at most 1,000 rows per request
-- by default, so the counts silently stopped growing at 1,000 a day, and every
-- map load moved thousands of rows over the network.
--
-- This function does the counting inside Postgres and returns ONE row per city.
--
-- HOW TO RUN: paste into Supabase -> SQL Editor and run it once on each
-- project (staging first, then production). It is safe to run again.

CREATE OR REPLACE FUNCTION recent_visitors_by_city(p_hours INTEGER DEFAULT 24)
RETURNS TABLE (
    city          TEXT,
    lat           DOUBLE PRECISION,
    lng           DOUBLE PRECISION,
    visitor_count BIGINT
)
LANGUAGE sql
STABLE
AS $$
    SELECT
        p.city,
        -- Use the most recent pin's coordinates for the city.
        (array_agg(p.lat ORDER BY p.created_at DESC))[1] AS lat,
        (array_agg(p.lng ORDER BY p.created_at DESC))[1] AS lng,
        count(*)::bigint                                 AS visitor_count
    FROM visitor_pins p
    WHERE p.created_at >= now() - make_interval(hours => p_hours)
    GROUP BY p.city
    -- Same order the old code produced: the city seen first comes first.
    ORDER BY min(p.created_at);
$$;

-- Only the server (service role) may call it, like the other functions.
REVOKE ALL ON FUNCTION recent_visitors_by_city(INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION recent_visitors_by_city(INTEGER) TO service_role;

-- The dashboard counts responses per pathway on every load.
CREATE INDEX IF NOT EXISTS idx_responses_script ON responses (script);

-- OPTIONAL housekeeping: pins older than 30 days are never read (lifetime
-- totals live in city_visit_totals). Run this by hand now and then, or put it
-- in a Supabase scheduled job:
--   DELETE FROM visitor_pins WHERE created_at < now() - interval '30 days';
