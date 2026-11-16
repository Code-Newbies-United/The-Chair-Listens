// lib/pathwayGuard.js
//
// Shared "is this a real pathway?" check for the API routes (FIX-16).
// validators.js only checks that a key is well-formed; whether it exists is a
// database question, answered here.
import { getPathway } from '@/lib/pathways';
import { badRequest, sendError } from '@/lib/apiErrors';

/**
 * Returns the pathway, or sends the error response and returns null:
 *
 *   const pathway = await resolvePathway(res, script, { includeInactive: true });
 *   if (!pathway) return;
 *
 * The 400 message is fixed text: it never repeats what the visitor sent.
 */
export async function resolvePathway(res, key, { includeInactive = false } = {}) {
  let pathway;
  try {
    pathway = await getPathway(key, { includeInactive });
  } catch (err) {
    console.error('Pathway lookup failed:', err?.message || err);
    sendError(res, 500, 'Connection failed', 'Failed to load pathways');
    return null;
  }

  if (!pathway) {
    badRequest(res, [
      { field: 'script', message: 'script is not a known pathway' },
    ]);
    return null;
  }
  return pathway;
}
