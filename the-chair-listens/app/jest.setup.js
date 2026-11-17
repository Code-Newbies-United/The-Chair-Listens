import '@testing-library/jest-dom';

// lib/supabaseAdmin.js reads its URL and key from the environment and throws if
// they are missing (the secrets used to be typed into the file, which leaked
// them). Tests never talk to a real database, so give them harmless values.
// Tests that need the database mock '@/lib/supabaseAdmin' themselves.
process.env.NEXT_PUBLIC_SUPABASE_URL ||= 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY ||= 'test-service-role-key-not-real';

// Same for the Redis client in lib/rateLimit.js.
process.env.UPSTASH_REDIS_REST_URL ||= 'http://localhost:6379';
process.env.UPSTASH_REDIS_REST_TOKEN ||= 'test-token-not-real';

// Rate-limit tests must always see the real numbers, never a staging multiplier.
delete process.env.RATE_LIMIT_MULTIPLIER;
// Monitoring stays off in tests.
delete process.env.SENTRY_DSN;
