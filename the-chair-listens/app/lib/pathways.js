// lib/pathways.js
//
// The ONE place the server reads pathways (FIX-16). A pathway is one of the
// reflection tracks a visitor can choose ("For Men", "Ally & Support", ...).
// Its key, label, description and AI prompt live in the `pathways` table, so
// staff can add or change one without a deploy.
//
// Rows are cached in memory for 30 seconds so /api/groq and friends do not hit
// the database on every request. A new row therefore appears within ~30s.
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const TTL_MS = 30_000;

let cache = { at: 0, rows: null };
let inflight = null;

// Used by tests, and after any write that must be visible immediately.
export function clearPathwaysCache() {
  cache = { at: 0, rows: null };
  inflight = null;
}

async function loadFromDatabase() {
  const { data, error } = await supabaseAdmin
    .from('pathways')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/**
 * Every pathway, including inactive ones (needed for old responses and the
 * dashboard). `fresh: true` skips the cache (used by the admin list).
 * If the database is briefly unreachable, the last good copy is served rather
 * than breaking a live activation.
 */
export async function getAllPathways({ fresh = false } = {}) {
  const isFresh = cache.rows && Date.now() - cache.at < TTL_MS;
  if (!fresh && isFresh) return cache.rows;

  if (!inflight) {
    inflight = loadFromDatabase().finally(() => {
      inflight = null;
    });
  }

  try {
    const rows = await inflight;
    cache = { at: Date.now(), rows };
    return rows;
  } catch (err) {
    if (cache.rows) {
      console.error(
        'Pathways reload failed, serving the last known copy:',
        err?.message || err,
      );
      return cache.rows;
    }
    throw err;
  }
}

export async function getActivePathways() {
  return (await getAllPathways()).filter((p) => p.active);
}

/**
 * One pathway by key, or null. Active pathways only, unless
 * `includeInactive` is set (use that when SAVING a visitor's answers, so
 * someone mid-session is not rejected when an admin switches a pathway off).
 */
export async function getPathway(key, { includeInactive = false } = {}) {
  if (typeof key !== 'string') return null;
  const all = await getAllPathways();
  return (
    all.find((p) => p.key === key && (includeInactive || p.active)) ?? null
  );
}
