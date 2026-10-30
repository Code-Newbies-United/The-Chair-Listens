// pages/api/responses.js
//
// POST /api/responses : saves one participant's answers.
//
// Order of checks (cheapest and safest first):
//   1. method            -> 405
//   2. rate limit        -> 429  (per IP, and per consent session)
//   3. consent session   -> 403  (FIX-04: no valid consent = nothing is saved)
//   4. payload           -> 400  (FIX-11: nothing is read or written on a bad payload)
//   5. session lookup / expiry / per-session cap
//   6. insert, tagged with the chair location stored on the SESSION (FIX-07),
//      never with anything the browser claims.
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import {
  SESSION_MAX_AGE_HOURS,
  MAX_RESPONSES_PER_SESSION,
} from '@/lib/consentVersion';
import { methodNotAllowed, badRequest, sendError } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';
import { isUuid, parseResponseBody } from '@/lib/validators';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
// 15 answers x (4000 + 500) chars, even at 2 bytes per character.
export const config = { api: { bodyParser: { sizeLimit: '256kb' } } };

function consentRequired(res, message) {
  return sendError(res, 403, 'Consent required', message);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, 'POST');
  }

  const sessionId = req.body?.session_id;

  if (
    !(await checkRateLimit(req, res, 'responses', {
      sessionId: isUuid(sessionId) ? sessionId : undefined,
    }))
  ) {
    return;
  }

  // 3a. A session id of the right shape is required.
  if (!isUuid(sessionId)) {
    return consentRequired(
      res,
      'Consent is required before responses can be saved.',
    );
  }

  // 4. Validate the payload before touching the database.
  const parsed = parseResponseBody(req.body);
  if (!parsed.ok) {
    return badRequest(res, parsed.issues);
  }
  const { answers, script } = parsed.data;

  // 3b. The session must exist, have consent, and not be expired.
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('sessions')
    .select('id, chair_location_id, location_id, consented_at')
    .eq('id', sessionId)
    .maybeSingle();

  if (sessionError) {
    console.error('Session lookup failed:', sessionError);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to verify consent',
    );
  }

  if (!session || !session.consented_at) {
    return consentRequired(
      res,
      'No valid consent was found. Please start again.',
    );
  }

  const ageMs = Date.now() - new Date(session.consented_at).getTime();
  if (ageMs < 0 || ageMs > SESSION_MAX_AGE_HOURS * 60 * 60 * 1000) {
    return consentRequired(
      res,
      'Your session has expired or is invalid. Please start again.',
    );
  }

  // Sessions created before FIX-07 have no chair location: restart them.
  if (!session.chair_location_id) {
    return sendError(
      res,
      409,
      'Session needs to be restarted',
      'This session does not have a chair location assigned. Please start again.',
    );
  }

  // 5. One session cannot flood the archive.
  const { count, error: countError } = await supabaseAdmin
    .from('responses')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', session.id);

  if (countError) {
    console.error('Response count failed:', countError);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to check response limits',
    );
  }

  if ((count ?? 0) >= MAX_RESPONSES_PER_SESSION) {
    return sendError(
      res,
      429,
      'Too Many Requests',
      'This session has already submitted the maximum number of responses.',
    );
  }

  // 6. Save. Only validated fields are written; the location comes from the
  //    session. `location` is the legacy text name, kept until reports migrate.
  const { error } = await supabaseAdmin.from('responses').insert({
    answers,
    script,
    session_id: session.id,
    chair_location_id: session.chair_location_id,
    location: session.location_id ?? null,
  });

  if (error) {
    console.error('Failed to save response:', error);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to save response',
    );
  }

  return res.status(200).json({ success: true });
}
