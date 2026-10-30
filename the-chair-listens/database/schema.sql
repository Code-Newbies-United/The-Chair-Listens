-- schema.sql : FULL schema for a brand-new, empty Supabase database.
--
-- Run this once in the Supabase SQL editor, then run seed-data/questions.sql.
-- It matches what the merged code reads and writes (consent sessions, chair
-- locations, visitor map, community messages) and locks every table down with
-- Row Level Security (FIX-05 / FIX-23).
--
-- !! If you already have a live database, DO NOT run this over it blindly:
--    back it up first and apply only the pieces you are missing.
--
-- How access works after this file:
--   * The browser's public (anon) key can ONLY read non-sensitive `locations`.
--   * Everything else is read/written by the server API routes using the
--     service-role key (lib/supabaseAdmin.js), which bypasses RLS.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------------------------------------------------------------------------
-- Chair locations (stops). Exactly one row may be active at a time.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS locations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT             NOT NULL,
    lat            DOUBLE PRECISION NOT NULL,
    lng            DOUBLE PRECISION NOT NULL,
    active         BOOLEAN          NOT NULL DEFAULT FALSE,
    response_count INTEGER          NOT NULL DEFAULT 0,
    visited_at     TIMESTAMPTZ      NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS one_active_location ON locations (active) WHERE active;

-- Used by /api/set-location: deactivates the current stop and activates a new
-- one in a single transaction, so there is never a moment with two (or zero)
-- active stops.
CREATE OR REPLACE FUNCTION set_active_chair_location(
    p_name TEXT,
    p_lat  DOUBLE PRECISION,
    p_lng  DOUBLE PRECISION
) RETURNS SETOF locations
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE locations SET active = FALSE WHERE active;
    RETURN QUERY
        INSERT INTO locations (name, lat, lng, active)
        VALUES (btrim(p_name), p_lat, p_lng, TRUE)
        RETURNING *;
END;
$$;
REVOKE ALL ON FUNCTION set_active_chair_location(TEXT, DOUBLE PRECISION, DOUBLE PRECISION) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION set_active_chair_location(TEXT, DOUBLE PRECISION, DOUBLE PRECISION) TO service_role;

-- ---------------------------------------------------------------------------
-- Questions (managed from Admin -> Questions)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS questions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    script_key    TEXT        NOT NULL DEFAULT 'men_mental_health',
    title         TEXT        NOT NULL DEFAULT '',
    question_text TEXT        NOT NULL,
    placeholder   TEXT        NOT NULL DEFAULT '',
    sort_order    INTEGER     NOT NULL DEFAULT 0,
    active        BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_questions_script_sort ON questions (script_key, sort_order);

-- ---------------------------------------------------------------------------
-- Consent sessions: one row per person who ticked the consent box (FIX-04).
-- chair_location_id is the authoritative stop (set by the server, FIX-07).
-- location_id is the stop NAME, kept as legacy text for older reports.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chair_location_id UUID        REFERENCES locations(id),
    location_id       TEXT,
    consent_version   TEXT        NOT NULL,
    consented_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sessions_chair_location ON sessions (chair_location_id);

-- ---------------------------------------------------------------------------
-- Responses: every row must belong to a consent session.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS responses (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id       UUID        REFERENCES questions(id),   -- currently unused by the app
    answers           JSONB       NOT NULL,
    script            TEXT,
    location          TEXT,                                   -- legacy stop name
    chair_location_id UUID        REFERENCES locations(id),
    session_id        UUID        REFERENCES sessions(id),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT responses_require_session CHECK (session_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_responses_session_id ON responses (session_id);
CREATE INDEX IF NOT EXISTS idx_responses_chair_location ON responses (chair_location_id);

-- Keeps locations.response_count up to date.
CREATE OR REPLACE FUNCTION bump_location_response_count() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.chair_location_id IS NOT NULL THEN
        UPDATE locations SET response_count = response_count + 1
        WHERE id = NEW.chair_location_id;
    END IF;
    RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_bump_location_response_count ON responses;
CREATE TRIGGER trg_bump_location_response_count
    AFTER INSERT ON responses
    FOR EACH ROW EXECUTE FUNCTION bump_location_response_count();

-- ---------------------------------------------------------------------------
-- Knowledge-check quiz
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS quiz_questions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT        NOT NULL,
    options       JSONB       NOT NULL DEFAULT '[]'::jsonb,  -- [{"text": "...", "is_correct": true}]
    explanation   TEXT        NOT NULL DEFAULT '',
    sort_order    INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Legacy consent log (replaced by `sessions`). Kept because
-- scripts/backfill-city-totals.js reads it. New code does not write to it.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS consent (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent     TEXT        DEFAULT 'accepted',
    location_id TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Community messages (reflection page). Each one belongs to a consent session.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message    TEXT        NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 1000),
    session_id UUID        NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    is_visible BOOLEAN     NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_messages_visible_created_at
    ON messages (created_at DESC) WHERE is_visible = TRUE;

-- ---------------------------------------------------------------------------
-- Live visitor map + lifetime totals. Written by the SERVER when someone
-- consents (lib/visitorPins.js), using the chair's stop, never the visitor's GPS.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS visitor_pins (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    city       TEXT             NOT NULL,
    lat        DOUBLE PRECISION,
    lng        DOUBLE PRECISION,
    created_at TIMESTAMPTZ      NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_visitor_pins_created_at ON visitor_pins (created_at DESC);

CREATE TABLE IF NOT EXISTS city_visit_totals (
    city         TEXT PRIMARY KEY,
    lat          NUMERIC,
    lng          NUMERIC,
    total_visits INTEGER     NOT NULL DEFAULT 0,
    first_seen   TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_seen    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Atomic increment: safe under concurrent visits because the
-- INSERT ... ON CONFLICT ... DO UPDATE is a single database operation.
CREATE OR REPLACE FUNCTION increment_city_visit(
    p_city TEXT,
    p_lat  NUMERIC,
    p_lng  NUMERIC
) RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO city_visit_totals (city, lat, lng, total_visits, first_seen, last_seen)
    VALUES (p_city, p_lat, p_lng, 1, now(), now())
    ON CONFLICT (city) DO UPDATE SET
        total_visits = city_visit_totals.total_visits + 1,
        last_seen    = now();
END;
$$;

-- Used by scripts/backfill-city-totals.js (idempotent per city: it SETS the
-- total from historic consent rows rather than adding to it).
CREATE OR REPLACE FUNCTION backfill_city_visit(
    p_city       TEXT,
    p_lat        NUMERIC,
    p_lng        NUMERIC,
    p_count      INTEGER,
    p_first_seen TIMESTAMPTZ,
    p_last_seen  TIMESTAMPTZ
) RETURNS VOID
LANGUAGE plpgsql AS $$
BEGIN
    INSERT INTO city_visit_totals (city, lat, lng, total_visits, first_seen, last_seen)
    VALUES (p_city, p_lat, p_lng, p_count, p_first_seen, p_last_seen)
    ON CONFLICT (city) DO UPDATE SET
        total_visits = GREATEST(city_visit_totals.total_visits, EXCLUDED.total_visits),
        first_seen   = LEAST(city_visit_totals.first_seen, EXCLUDED.first_seen),
        last_seen    = GREATEST(city_visit_totals.last_seen, EXCLUDED.last_seen);
END;
$$;

REVOKE ALL ON FUNCTION increment_city_visit(TEXT, NUMERIC, NUMERIC) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION backfill_city_visit(TEXT, NUMERIC, NUMERIC, INTEGER, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION increment_city_visit(TEXT, NUMERIC, NUMERIC) TO service_role;
GRANT EXECUTE ON FUNCTION backfill_city_visit(TEXT, NUMERIC, NUMERIC, INTEGER, TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY (FIX-05 / FIX-23)
-- RLS ON + no policy = nobody using the public key can read or write.
-- The service-role key used by the server bypasses RLS.
-- ---------------------------------------------------------------------------
ALTER TABLE locations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses         ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent           ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_pins      ENABLE ROW LEVEL SECURITY;
ALTER TABLE city_visit_totals ENABLE ROW LEVEL SECURITY;

-- The ONLY thing the public key may do: read the (non-sensitive) stops.
DROP POLICY IF EXISTS "public can read locations" ON locations;
CREATE POLICY "public can read locations"
    ON locations FOR SELECT TO anon, authenticated USING (true);
