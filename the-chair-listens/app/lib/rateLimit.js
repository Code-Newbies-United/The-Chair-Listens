import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// Returns the client IP address
export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];

  if (forwarded) {
    return forwarded.split(",")[0].trim();
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
