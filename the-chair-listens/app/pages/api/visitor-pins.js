// pages/api/visitor-pins.js
//
// GET /api/visitor-pins : visitors per stop in the last 24 hours (aggregate
// counts only), for the live map. Read-only: pins are written by the server
// when someone consents (see lib/visitorPins.js).
import { methodNotAllowed, sendError } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';
import { recentVisitorsByCity } from '@/lib/visitorPins';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res, 'GET');
  }

  if (!(await checkRateLimit(req, res, 'visitorPins'))) return;

  const { visitors, error } = await recentVisitorsByCity();
  if (error) {
    console.error('Failed to fetch visitor pins:', error);
    return sendError(
      res,
      500,
      'Connection failed',
      'Failed to fetch visitor pins',
    );
  }

  // Everybody sees the same numbers, so let Vercel's CDN answer for 30 seconds.
  // Under load that turns thousands of requests into one database query.
  // (Only successful answers are cached: errors above are never cached.)
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=30, stale-while-revalidate=120',
  );
  return res.status(200).json({ visitors });
}
