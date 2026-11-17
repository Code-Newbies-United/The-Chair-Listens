// lib/apiGuard.js
//
// Rate limiting for the public endpoints (FIX-11).
//
// Every request is counted against its IP address AND, when the browser sends
// its session ID, against that session too. Why both: at an activation many
// people share one IP (venue wifi, and South African mobile networks that put
// many phones behind one address), so the IP limit has to be generous. The
// per-session limit is what stops one person flooding an endpoint. The IP
// limit is only the backstop against someone inventing session IDs.
import { getClientIp, rateLimit } from '@/lib/rateLimit';
import { tooManyRequests } from '@/lib/apiErrors';
import { isUuid } from '@/lib/validators';

// perIp is high on purpose (shared wifi, carrier NAT). perSession is what
// limits one person. Tune with real numbers after the first activation.
//
// Rough sizing for perIp: how many people on ONE network might do this in one
// minute at a busy event? Then add headroom. The previous values (30 consents
// per minute, 30 transcriptions per minute) would have blocked a busy venue.
export const RATE_LIMITS = {
  consent: { perIp: 200, windowSeconds: 60 },
  responses: { perIp: 300, perSession: 10, windowSeconds: 60 },
  questions: { perIp: 600, windowSeconds: 60 },
  pathways: { perIp: 600, windowSeconds: 60 },
  quizQuestions: { perIp: 600, windowSeconds: 60 },
  transcribe: { perIp: 120, perSession: 8, windowSeconds: 60 },
  sessionReflection: { perIp: 120, perSession: 6, windowSeconds: 60 },
  groq: { perIp: 240, perSession: 12, windowSeconds: 60 },
  messages: { perIp: 120, perSession: 5, windowSeconds: 60 },
  visitorPins: { perIp: 600, windowSeconds: 60 },
  locations: { perIp: 600, windowSeconds: 60 },
  health: { perIp: 120, windowSeconds: 60 },
};

// STAGING ONLY. A load test sends every request from one machine, so it would
// hit the per-IP limits instantly. Setting RATE_LIMIT_MULTIPLIER=50 on the
// staging deployment multiplies every limit. Leave it unset in production.
function limitMultiplier() {
  const value = Number(process.env.RATE_LIMIT_MULTIPLIER);
  if (!Number.isFinite(value) || value < 1) return 1;
  return Math.min(value, 100);
}

// Browsers send the consent session ID in this header on endpoints that have
// no session in their body (see sessionHeaders() in lib/session.js).
// Returns the ID only if it looks like a UUID, otherwise null.
export function getSessionIdFromHeader(req) {
  const value = req.headers?.['x-session-id'];
  return isUuid(value) ? value : null;
}

/**
 * Returns true if the request may continue.
 * Returns false after sending a 429, so the caller should `return` straight away:
 *
 *   if (!(await checkRateLimit(req, res, "responses", { sessionId }))) return;
 */
export async function checkRateLimit(req, res, name, { sessionId } = {}) {
  const config = RATE_LIMITS[name];
  const ip = getClientIp(req);
  const multiplier = limitMultiplier();

  const byIp = await rateLimit(
    name,
    ip,
    Math.round(config.perIp * multiplier),
    config.windowSeconds,
  );
  if (!byIp.allowed) {
    tooManyRequests(res, config.windowSeconds);
    return false;
  }

  if (sessionId && config.perSession) {
    const bySession = await rateLimit(
      `${name}-session`,
      sessionId,
      Math.round(config.perSession * multiplier),
      config.windowSeconds,
    );
    if (!bySession.allowed) {
      tooManyRequests(res, config.windowSeconds);
      return false;
    }
  }

  return true;
}
