// lib/consentSession.js
//
// Server-side check that a request belongs to a person who gave consent
// (FIX-04). Used by routes that accept free text but have no `session_id` in
// their body (the id arrives in the x-session-id header instead).
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { SESSION_MAX_AGE_HOURS } from '@/lib/consentVersion';
import { isUuid } from '@/lib/validators';

/**
 * @returns {Promise<{ ok: true, session: object } | { ok: false, status: number }>}
 *   status 403 = no valid consent, 500 = the lookup itself failed.
 */
export async function verifyConsentSession(sessionId) {
  if (!isUuid(sessionId)) return { ok: false, status: 403 };

  const { data: session, error } = await supabaseAdmin
    .from('sessions')
    .select('id, consented_at')
    .eq('id', sessionId)
    .maybeSingle();

  if (error) {
    console.error('Consent session lookup failed:', error);
    return { ok: false, status: 500 };
  }
  if (!session || !session.consented_at) return { ok: false, status: 403 };

  const ageMs = Date.now() - new Date(session.consented_at).getTime();
  if (ageMs < 0 || ageMs > SESSION_MAX_AGE_HOURS * 60 * 60 * 1000) {
    return { ok: false, status: 403 };
  }

  return { ok: true, session };
}
