// pages/api/health.js
//
// GET /api/health : for uptime monitors (UptimeRobot, Better Stack, ...).
//
//   HTTP 200 {"status":"ok", ...}        everything works
//   HTTP 200 {"status":"degraded", ...}  site works but Redis is down, which
//                                        means rate limiting is switched off
//   HTTP 503 {"status":"down", ...}      the database is unreachable: nobody
//                                        can start a session
//
// Point the monitor at this URL and have it alert when it gets a 503, or when
// the body no longer contains "status":"ok" (a "keyword" monitor).
//
// It reveals nothing but those words: no versions, hostnames or keys.
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { pingRedis } from '@/lib/rateLimit';
import { methodNotAllowed } from '@/lib/apiErrors';
import { checkRateLimit } from '@/lib/apiGuard';

async function checkDatabase() {
  try {
    const { error } = await supabaseAdmin.from('locations').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return methodNotAllowed(res, 'GET, HEAD');
  }

  if (!(await checkRateLimit(req, res, 'health'))) return;

  const [databaseOk, redisOk] = await Promise.all([checkDatabase(), pingRedis()]);

  const status = !databaseOk ? 'down' : !redisOk ? 'degraded' : 'ok';

  // A healthy answer may be cached for 10 s so a flood of checks cannot hammer
  // the database. A problem is never cached.
  res.setHeader(
    'Cache-Control',
    status === 'ok' ? 'public, s-maxage=10' : 'no-store',
  );

  return res.status(databaseOk ? 200 : 503).json({
    status,
    checks: {
      database: databaseOk ? 'ok' : 'down',
      redis: redisOk ? 'ok' : 'down',
    },
  });
}
