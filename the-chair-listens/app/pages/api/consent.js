import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { CONSENT_VERSION } from '@/lib/consentVersion';
import { methodNotAllowed, badRequest } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';
import { parseConsentBody } from '@/lib/validators';
import { recordVisit } from '@/lib/visitorPins';

// Next.js rejects bigger bodies (413) before this code runs. Must be a literal.
export const config = { api: { bodyParser: { sizeLimit: '4kb' } } };

export default async function manage_communication(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res, 'POST');
  }

  // Creating a session writes a database row, so limit how fast one IP can do it.
  if (!(await checkRateLimit(req, res, 'consent'))) return;

  const parsed = parseConsentBody(req.body);
  if (!parsed.ok) {
    return badRequest(res, parsed.issues);
  }
  const { consent_version } = parsed.data;

  // Require consent to the current privacy wording.
  if (consent_version !== CONSENT_VERSION) {
    return res.status(409).json({
      error: 'Consent terms out of date',
      message:
        'The privacy terms have been updated. Please refresh the page and review them again.',
    });
  }

  // Resolve the chair's location on the server.
  const { data: location, error: locationError } = await supabaseAdmin
    .from('locations')
    .select('id, name, lat, lng')
    .eq('active', true)
    .maybeSingle();

  if (locationError) {
    console.error('Failed to find active chair location:', locationError);
    return res.status(500).json({
      error: 'Database error',
      message: 'Could not determine the active chair location.',
    });
  }

  if (!location) {
    return res.status(503).json({
      error: 'No active chair location',
      message: 'The chair is not currently configured. Please try again later.',
    });
  }

  // Save the UUID as the authoritative location.
  // Keep the old text field temporarily for compatibility with
  // application code that has not yet been migrated.
  const { data, error } = await supabaseAdmin
    .from('sessions')
    .insert({
      chair_location_id: location.id,
      location_id: location.name,
      consent_version: CONSENT_VERSION,
    })
    .select('id')
    .single();

  if (error || !data) {
    console.error('Failed to create consent session:', error);
    return res.status(500).json({
      error: 'Connection failed',
      message: 'Failed to save consent.',
    });
  }

  // Feed the live visitor map / lifetime totals with the chair's own stop
  // (best effort: never blocks the session).
  await recordVisit({ city: location.name, lat: location.lat, lng: location.lng });

  return res.status(201).json({ sessionId: data.id });
}
