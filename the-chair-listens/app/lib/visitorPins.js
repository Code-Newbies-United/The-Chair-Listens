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

/** Visitors per stop in the last 24 hours, for the map. */
export async function recentVisitorsByCity() {
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
