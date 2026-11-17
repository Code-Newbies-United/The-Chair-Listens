// lib/visitorPins.js
//
// Feeds the live "recent visitors" map and the lifetime city totals on the
// admin dashboard. It is called by the SERVER when someone consents, using the
// chair's own stop. The visitor's GPS is never read or sent anywhere (FIX-07),
// and there is no public endpoint that can write pins.
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Best effort: a failure here is logged and ignored, because it must never
 * stop a person from starting their session.
 */
export async function recordVisit({ city, lat, lng }) {
  if (!city) return;
  try {
    const { error: pinError } = await supabaseAdmin
      .from('visitor_pins')
      .insert({ city, lat: lat ?? null, lng: lng ?? null });
    if (pinError) throw pinError;

    const { error: incrementError } = await supabaseAdmin.rpc(
      'increment_city_visit',
      { p_city: city, p_lat: lat ?? null, p_lng: lng ?? null },
    );
    if (incrementError) throw incrementError;
  } catch (err) {
    console.error('Could not record visit pin:', err?.message || err);
  }
}

// Postgres / PostgREST codes for "that function does not exist (yet)".
const FUNCTION_MISSING_CODES = new Set(['PGRST202', '42883']);

/**
 * Visitors per stop in the last 24 hours, for the map.
 *
 * The counting happens in Postgres (recent_visitors_by_city, see
 * database/migrations/fix-pins-aggregate.sql): one row per city comes back,
 * however many people visited. Counting in Node instead hit Supabase's
 * 1,000-row response cap and silently under-counted.
 */
export async function recentVisitorsByCity() {
  const { data, error } = await supabaseAdmin.rpc('recent_visitors_by_city', {
    p_hours: 24,
  });

  if (error) {
    // Code deployed before the SQL migration was run: keep the map working
    // (with the old, capped count) instead of failing, and say so in the logs.
    if (FUNCTION_MISSING_CODES.has(error.code)) {
      console.error(
        'recent_visitors_by_city is missing: run database/migrations/fix-pins-aggregate.sql. Using the slower capped fallback.',
      );
      return recentVisitorsFallback();
    }
    return { error };
  }

  return {
    visitors: (data || []).map((row) => ({
      location: row.city,
      visitor_count: Number(row.visitor_count),
      lat: row.lat,
      lng: row.lng,
    })),
  };
}

// The pre-migration behaviour, kept only as a safety net.
async function recentVisitorsFallback() {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('visitor_pins')
    .select('city, lat, lng, created_at')
    .gte('created_at', since)
    .order('created_at', { ascending: true });

  if (error) return { error };

  const grouped = {};
  for (const row of data || []) {
    if (!grouped[row.city]) {
      grouped[row.city] = {
        location: row.city,
        visitor_count: 0,
        lat: row.lat,
        lng: row.lng,
      };
    }
    grouped[row.city].visitor_count += 1;
    grouped[row.city].lat = row.lat;
    grouped[row.city].lng = row.lng;
  }
  return { visitors: Object.values(grouped) };
}
