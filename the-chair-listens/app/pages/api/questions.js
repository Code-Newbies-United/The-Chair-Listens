import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { methodNotAllowed, badRequest, sendError } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';
import { parseScriptKey } from '@/lib/validators';
import { resolvePathway } from '@/lib/pathwayGuard';
import { toPublic } from '@/lib/pathwayShape';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, 'GET');
  }

  if (!(await checkRateLimit(req, res, 'questions'))) return;

  // `script` must be exactly one well-formed key (not missing, not repeated).
  const parsed = parseScriptKey(req.query.script);
  if (!parsed.ok) {
    return badRequest(res, [
      { field: 'script', message: parsed.issues[0].message },
    ]);
  }
  const script = parsed.data;

  // ...and it must be an ACTIVE pathway: inactive or unknown keys get a 400.
  const pathway = await resolvePathway(res, script);
  if (!pathway) return;

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('script_key', script)
    .order('sort_order', { ascending: true });

  if (error) {
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to fetch questions',
    );
  }

  // `pathway` lets the page show its title without a second request.
  res.status(200).json({ questions: data, pathway: toPublic(pathway) });
}
