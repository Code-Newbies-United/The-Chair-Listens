// lib/apiGuard.js
//
// Rate limiting for the public endpoints (FIX-11).
//
// Every request is counted against its IP address AND, when the browser sends
// its session ID, against that session too. Why both: at an activation many
// people share one IP (venue wifi, mobile carrier NAT), so the IP limit has to
// be generous. The per-session limit is what stops one person flooding an
// endpoint. The IP limit is the backstop against someone inventing session IDs.
import { getClientIp, rateLimit } from '@/lib/rateLimit';
import { tooManyRequests } from '@/lib/apiErrors';
import { isUuid } from '@/lib/validators';

// Starting points: tune after the first real activation.
// perIp is high on purpose (shared wifi). perSession is what limits a person.
export const RATE_LIMITS = {
  consent: { perIp: 30, windowSeconds: 60 },
  responses: { perIp: 60, perSession: 10, windowSeconds: 60 },
  questions: { perIp: 120, windowSeconds: 60 },
  quizQuestions: { perIp: 120, windowSeconds: 60 },
  transcribe: { perIp: 30, perSession: 8, windowSeconds: 60 },
  sessionReflection: { perIp: 30, perSession: 6, windowSeconds: 60 },
  groq: { perIp: 60, perSession: 12, windowSeconds: 60 },
};

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

  const byIp = await rateLimit(name, ip, config.perIp, config.windowSeconds);
  if (!byIp.allowed) {
    tooManyRequests(res, config.windowSeconds);
    return false;
  }

  if (sessionId && config.perSession) {
    const bySession = await rateLimit(
      `${name}-session`,
      sessionId,
      config.perSession,
      config.windowSeconds,
    );
    if (!bySession.allowed) {
      tooManyRequests(res, config.windowSeconds);
      return false;
    }
  }

  return true;
}
