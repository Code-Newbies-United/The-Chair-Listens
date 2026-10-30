// pages/api/visit-totals.js
//
// GET /api/visit-totals : lifetime visits per stop. Admin only (dashboard).
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyAdminSession } from '@/lib/adminsession';
import { methodNotAllowed, sendError } from '@/lib/apiErrors';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, 'GET');
  }

  if (!verifyAdminSession(req)) {
    return sendError(res, 401, 'Unauthorized', 'Admin login required.');
  }

  const { data, error } = await supabaseAdmin
    .from('city_visit_totals')
    .select('city, total_visits, first_seen, last_seen')
    .order('total_visits', { ascending: false });

  if (error) {
    console.error('Failed to fetch visit totals:', error);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to fetch visit totals',
    );
  }

  return res.status(200).json({ totals: data });
}
