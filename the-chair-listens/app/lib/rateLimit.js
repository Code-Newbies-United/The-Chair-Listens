import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

// Redis is called on EVERY guarded request, so a slow Redis must never make the
// whole site slow. Give each command 1.2 s and retry once at most; after that
// the limiter treats Redis as unreachable (see `failOpen` below).
const REDIS_TIMEOUT_MS = 1200;

const redis = Redis.fromEnv({
  signal: () => AbortSignal.timeout(REDIS_TIMEOUT_MS),
  retry: { retries: 1, backoff: () => 100 },
});

// Returns the client IP address.
// On Vercel, x-vercel-forwarded-for is set by the platform and cannot be
// spoofed by the visitor, so it is preferred. Elsewhere, the first address in
// x-forwarded-for is used.
export function getClientIp(req) {
  const headers = req.headers || {};

  const vercel = headers["x-vercel-forwarded-for"];
  if (vercel) {
    return String(vercel).split(",")[0].trim();
  }

  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    return String(forwarded).split(",")[0].trim();
  }

  return req.socket?.remoteAddress || "unknown";
}

/**
 * Rate limiting a request (sliding window)
 *
 * @param {string} keyPrefix    identifies the endpoint, e.g. "groq"
 * @param {string} ip           client IP
 * @param {number} limit        maximum requests in the window
 * @param {number} windowSeconds  length of the window
 * @param {object} [options]
 * @param {boolean} [options.failOpen=true]  if Redis is unreachable, allow the
 *        request (true) or block it (false). Use false for login.
 */
export async function rateLimit(keyPrefix, ip, limit, windowSeconds, { failOpen = true } = {}) {
  const key = `rate-limit:${keyPrefix}:${ip}`;

  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const clearBefore = now - windowMs;
  const requestId = `${now}-${Math.random().toString(36).substring(2, 7)}`;

  try {
    const multi = redis.multi();

    // 1. Remove requests older than the window
    multi.zremrangebyscore(key, 0, clearBefore);

    // 2. Add this request. NOTE: @upstash/redis wants { score, member },
    //    not (score, member) like ioredis.
    multi.zadd(key, { score: now, member: requestId });

    // 3. Count requests in the window
    multi.zcard(key);

    // 4. Expire idle keys
    multi.expire(key, windowSeconds);

    const results = await multi.exec();
    const count = results[2];

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
      count,
    };
  } catch (err) {
    console.error("Rate limiter error (Redis unreachable?):", err);
    return { allowed: failOpen, remaining: failOpen ? limit : 0, count: 0 };
  }
}

// ---------------------------------------------------------------------------
// Failure counters for login lockout.
//
// rateLimit() above counts every request. A lockout must count only FAILED
// logins and forget them after a success, so it has its own small helpers.
//
// They live in Redis so every serverless instance shares one count (an
// in-memory Map is per instance and is wiped on every cold start, which made
// the old lockout almost useless on Vercel). If Redis is unreachable they fall
// back to a per-instance in-memory count: weaker, but never "no protection".
// ---------------------------------------------------------------------------

const memoryFailures = new Map(); // key -> { count, resetAt }

// Hash the identifier so email addresses are never stored in Redis in clear text.
function lockoutKey(namespace, id) {
  const hash = createHash("sha256").update(String(id)).digest("hex").slice(0, 32);
  return `lockout:${namespace}:${hash}`;
}

function memoryCount(key) {
  const entry = memoryFailures.get(key);
  if (!entry) return 0;
  if (Date.now() > entry.resetAt) {
    memoryFailures.delete(key);
    return 0;
  }
  return entry.count;
}

/** How many failures are currently recorded for this id. */
export async function getFailureCount(namespace, id) {
  const key = lockoutKey(namespace, id);
  try {
    const value = await redis.get(key);
    return Number(value) || 0;
  } catch (err) {
    console.error("Lockout counter error (Redis unreachable?):", err?.message || err);
    return memoryCount(key);
  }
}

/** Record one failure. The counter forgets itself `windowSeconds` after the LAST failure. */
export async function recordFailure(namespace, id, windowSeconds) {
  const key = lockoutKey(namespace, id);
  try {
    const pipeline = redis.pipeline();
    pipeline.incr(key);
    pipeline.expire(key, windowSeconds);
    await pipeline.exec();
  } catch (err) {
    console.error("Lockout counter error (Redis unreachable?):", err?.message || err);
    const entry = memoryFailures.get(key);
    if (!entry || Date.now() > entry.resetAt) {
      memoryFailures.set(key, { count: 1, resetAt: Date.now() + windowSeconds * 1000 });
    } else {
      entry.count += 1;
      entry.resetAt = Date.now() + windowSeconds * 1000;
    }
  }
}

/** Forget all failures for this id (after a successful login). */
export async function clearFailures(namespace, id) {
  const key = lockoutKey(namespace, id);
  memoryFailures.delete(key);
  try {
    await redis.del(key);
  } catch (err) {
    console.error("Lockout counter error (Redis unreachable?):", err?.message || err);
  }
}

/** For the /api/health check. Never throws. */
export async function pingRedis() {
  try {
    await redis.ping();
    return true;
  } catch {
    return false;
  }
}
