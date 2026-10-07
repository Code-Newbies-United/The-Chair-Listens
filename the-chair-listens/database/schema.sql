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

CREATE TABLE IF NOT EXISTS city_visit_totals (
  city text primary key,
  lat numeric,
  lng numeric,
  total_visits integer not null default 0,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

-- Atomic increment function: safe under concurrent visits because the
-- INSERT ... ON CONFLICT ... DO UPDATE happens as a single database
-- operation, not a separate read-then-write from application code.
create or replace function increment_city_visit(
  p_city text,
  p_lat numeric,
  p_lng numeric
)
returns void as $$
begin
  insert into city_visit_totals (city, lat, lng, total_visits, first_seen, last_seen)
  values (p_city, p_lat, p_lng, 1, now(), now())
  on conflict (city)
  do update set
    total_visits = city_visit_totals.total_visits + 1,
    last_seen = now();
end;
$$ language plpgsql;
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    response_count INTEGER NOT NULL DEFAULT 0,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
