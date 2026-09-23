// scripts/backfill-city-totals.js
//
// Run once with: node scripts/backfill-city-totals.js
// Safe to re-run: totals only ever go up, never down (see backfill_city_visit
// in the database), so running this again after further name-cleanup is fine.
//
// Requires SUPABASE_SERVICE_ROLE_KEY in your environment (loaded from
// .env.local by Next.js normally, but a standalone script needs it loaded
// manually — see the dotenv import below).

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

// Known free-text variants seen in consent.location_id, mapped to a single
// canonical city name. Expand this as more variants turn up during review.
const CITY_ALIASES = {
  "joburg": "Johannesburg",
  "jhb": "Johannesburg",
  "johannesburg": "Johannesburg",
  "pta": "Pretoria",
  "pretoria": "Pretoria",
  "cpt": "Cape Town",
  "cape town": "Cape Town",
  "dbn": "Durban",
  "durban": "Durban",
};

function normalizeCity(raw) {
  if (!raw) return null;
  const cleaned = raw.trim().toLowerCase();
  if (!cleaned) return null;
  if (CITY_ALIASES[cleaned]) return CITY_ALIASES[cleaned];
  // Not a known alias — title-case it as a best-effort fallback
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

async function geocodeCity(city) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
      city
    )}&country=South Africa&format=jsonv2&limit=1`,
    { headers: { "User-Agent": "TheChairListens-Backfill/1.0" } }
  );
  const results = await res.json();
  if (!results.length) return null;
  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log("Fetching all consent records...");
  const { data: consentRows, error } = await supabaseAdmin
    .from("consent")
    .select("location_id, created_at");

  if (error) {
    console.error("Failed to fetch consent records:", error);
    return;
  }

  // Group raw rows by normalized city
  const grouped = {};
  const skipped = [];

  for (const row of consentRows) {
    const city = normalizeCity(row.location_id);
    if (!city) {
      skipped.push(row);
      continue;
    }
    if (!grouped[city]) {
      grouped[city] = { count: 0, first: row.created_at, last: row.created_at };
    }
    grouped[city].count += 1;
    if (row.created_at < grouped[city].first) grouped[city].first = row.created_at;
    if (row.created_at > grouped[city].last) grouped[city].last = row.created_at;
  }

  const cityNames = Object.keys(grouped);
  console.log(`Found ${cityNames.length} distinct cities after normalization.`);

  for (const city of cityNames) {
    const { count, first, last } = grouped[city];

    console.log(`Geocoding "${city}"...`);
    const coords = await geocodeCity(city);

    if (!coords) {
      console.warn(`  Could not geocode "${city}" — logging for manual review.`);
      skipped.push({ city, reason: "geocoding failed", count });
      await sleep(1100); // respect Nominatim's ~1 req/sec rate limit
      continue;
    }

    const { error: rpcError } = await supabaseAdmin.rpc("backfill_city_visit", {
      p_city: city,
      p_lat: coords.lat,
      p_lng: coords.lng,
      p_count: count,
      p_first_seen: first,
      p_last_seen: last,
    });

    if (rpcError) {
      console.error(`  Failed to backfill "${city}":`, rpcError.message);
    } else {
      console.log(`  ${city}: ${count} visits backfilled.`);
    }

    await sleep(1100); // respect Nominatim's ~1 req/sec rate limit
  }

  if (skipped.length > 0) {
    console.log("\n--- Rows/cities needing manual review ---");
    console.log(JSON.stringify(skipped, null, 2));
  }

  console.log("\nBackfill complete.");
}

run();