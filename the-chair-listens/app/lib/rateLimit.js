export function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
}

// Simple in-memory rate limiter
const rateLimitMap = new Map();

export function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  const timestamps = rateLimitMap.get(ip).filter((t) => t > windowStart);
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);

  return {
    success: timestamps.length <= limit,
    remaining: Math.max(0, limit - timestamps.length),
  };
}