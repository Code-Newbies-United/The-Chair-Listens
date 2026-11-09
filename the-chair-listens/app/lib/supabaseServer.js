import { createServerClient, serializeCookieHeader } from "@supabase/ssr";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function createSupabaseServerClient(req, res, { holdCookies = false } = {}) {
  const pending = [];

  function commitCookies() {
    if (!pending.length) return;
    const previous = res.getHeader("Set-Cookie");
    const previousList = previous ? (Array.isArray(previous) ? previous : [String(previous)]) : [];
    const serialized = pending.map(({ name, value, options }) =>
      serializeCookieHeader(name, value, {
        ...options,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })
    );
    res.setHeader("Set-Cookie", [...previousList, ...serialized]);
    pending.length = 0;
  }

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return Object.entries(req.cookies || {}).map(([name, value]) => ({
          name,
          value: value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        pending.push(...cookiesToSet);
        if (!holdCookies) commitCookies();
      },
    },
  });

  return {
    supabase,
    commitCookies,
    discardCookies: () => {
      pending.length = 0;
    },
  };
}