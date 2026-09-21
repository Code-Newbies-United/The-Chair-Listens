CREATE TABLE IF NOT EXISTS locations (
                                         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    response_count INTEGER NOT NULL DEFAULT 0,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
