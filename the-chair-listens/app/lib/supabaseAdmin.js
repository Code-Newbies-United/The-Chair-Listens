// lib/supabaseAdmin.js
//
// Server-only Supabase client that uses the SERVICE ROLE key, which bypasses
// Row Level Security. Never import this file from a page component or from
// anything that ships to the browser.
//
// The URL and key come ONLY from environment variables. They used to be typed
// into this file, which put the service-role key into git. Never do that again.
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Set them in .env.local (local) or in Vercel -> Settings -> Environment Variables.",
  );
}

// A database call that hangs would keep a serverless function open until the
// platform kills it. Give up after 8 seconds instead, so the route can answer
// with a clean error.
const SUPABASE_TIMEOUT_MS = 8000;

function fetchWithTimeout(input, init = {}) {
  const timeout = AbortSignal.timeout(SUPABASE_TIMEOUT_MS);
  const signal =
    init.signal && typeof AbortSignal.any === "function"
      ? AbortSignal.any([init.signal, timeout])
      : init.signal || timeout;
  return fetch(input, { ...init, signal });
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: { fetch: fetchWithTimeout },
});
