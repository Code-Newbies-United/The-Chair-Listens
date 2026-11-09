// pages/api/pathways.js
//
// GET /api/pathways : the active reflection pathways, for the "Choose your
// path" screen (FIX-16). Public, so it only ever returns key, label and
// description. The AI prompt never leaves the server.
import { methodNotAllowed, sendError } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';
import { getActivePathways } from '@/lib/pathways';
import { toPublic } from '@/lib/pathwayShape';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, 'GET');
  }

  if (!(await checkRateLimit(req, res, 'pathways'))) return;

  try {
    const pathways = await getActivePathways();
    return res.status(200).json({ pathways: pathways.map(toPublic) });
  } catch (err) {
    console.error('Failed to fetch pathways:', err?.message || err);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to fetch pathways',
    );
  }
}
