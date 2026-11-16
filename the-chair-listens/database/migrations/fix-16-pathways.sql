CREATE TABLE IF NOT EXISTS pathways (
    key              TEXT PRIMARY KEY CHECK (key ~ '^[a-z0-9_]{1,64}$'),
    label            TEXT        NOT NULL,
    description      TEXT        NOT NULL DEFAULT '',
    ai_system_prompt TEXT        NOT NULL DEFAULT '',
    active           BOOLEAN     NOT NULL DEFAULT TRUE,
    sort_order       INTEGER     NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE pathways ENABLE ROW LEVEL SECURITY;  -- no policy: server-only, same as questions