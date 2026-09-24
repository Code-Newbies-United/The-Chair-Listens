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
 * Rate limiting a request
 * 
 * @param {string} keyPrefix - identifies the endpoint
 * @param {string} ip - client IP
 * @param {number} limit - maximum requests
 * @param {number} windowSeconds - time window
 */

export async function rateLimit(keyPrefix, ip, limit, windowSeconds) {
    // The resulting Redis key will be "rate-limit:login:192.168.1.1"
    const key = `rate-limit:${keyPrefix}:${ip}`;
    
    const now = Date.now(); // Current time in milliseconds
    const windowMs = windowSeconds * 1000;
    const clearBefore = now - windowMs; // The cutoff time for the current window

    // A unique identifier for this specific request to prevent duplicate element collisions in the ZSET
    const requestId = `${now}-${Math.random().toString(36).substring(2, 7)}`;

    // Execute commands atomically in a pipeline/transaction
    const multi = redis.multi();

    // 1. Remove old requests that fall outside the current sliding window
    multi.zremrangebyscore(key, 0, clearBefore);

    // 2. Add the current request timestamp to the sorted set
    multi.zadd(key, now, requestId);

    // 3. Count the total number of requests remaining inside this sliding window
    multi.zcard(key);

    // 4. Refresh the key's TTL so idle users don't consume Redis memory indefinitely
    multi.expire(key, windowSeconds);

    // Execute the transaction
    const results = await multi.exec();
    
    // The result of zcard is at index 2 of the execution results array
    const count = results[2]; 

    return {
        allowed: count <= limit,
        remaining: Math.max(0, limit - count),
        count
    };
}

