CREATE TABLE IF NOT EXISTS consent (
    id SERIAL PRIMARY KEY,
    location_id TEXT NOT NULL,
    created_at TIMESTAMP default now()
);


CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP default now(),
    answers JSONB
);

