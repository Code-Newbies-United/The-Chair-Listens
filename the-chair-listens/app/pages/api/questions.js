import { supabaseAdmin as supabase } from '@/lib/supabaseAdmin';
import { methodNotAllowed, badRequest, sendError } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';
import { parseScriptKey } from '@/lib/validators';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, 'GET');
  }

  if (!(await checkRateLimit(req, res, 'questions'))) return;

  // `script` must be exactly one known key (not missing, not repeated, not made up).
  const parsed = parseScriptKey(req.query.script);
  if (!parsed.ok) {
    return badRequest(res, [
      { field: 'script', message: parsed.issues[0].message },
    ]);
  }
  const script = parsed.data;

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

  res.status(200).json({ questions: data });
}
