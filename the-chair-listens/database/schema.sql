-- Row Level Security is NOT enabled here yet; see FIX-05.

-- schema.sql : FULL schema for a brand-new, empty database.
-- (For a database that already exists, run migrations/001_align_schema.sql instead.)
-- Matches what the code reads and writes as of FIX-04.
-- Row Level Security is NOT enabled here yet; see FIX-05.

CREATE TABLE IF NOT EXISTS locations (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name           TEXT        NOT NULL,
    lat            DOUBLE PRECISION NOT NULL,
    lng            DOUBLE PRECISION NOT NULL,
    active         BOOLEAN     NOT NULL DEFAULT FALSE,
    response_count INTEGER     NOT NULL DEFAULT 0,
    visited_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS one_active_location ON locations (active) WHERE active;

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

CREATE TABLE IF NOT EXISTS sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id     TEXT,
    consent_version TEXT        NOT NULL,
    consented_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS responses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES questions(id),   -- currently unused by the app
    answers     JSONB       NOT NULL,
    script      TEXT,
    location    TEXT,
    session_id  UUID REFERENCES sessions(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT responses_require_session CHECK (session_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_responses_session_id ON responses (session_id);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT        NOT NULL,
    options       JSONB       NOT NULL DEFAULT '[]'::jsonb,  -- [{"text": "...", "is_correct": true}]
    explanation   TEXT        NOT NULL DEFAULT '',
    sort_order    INTEGER     NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consent (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    consent     TEXT        DEFAULT 'accepted',
    location_id TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message TEXT NOT NULL CHECK (char_length(btrim(message)) BETWEEN 1 AND 1OOO),
    session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
    is_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_visible_created_at
    ON messages (created_at DESC) WHERE is_visible = TRUE;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

