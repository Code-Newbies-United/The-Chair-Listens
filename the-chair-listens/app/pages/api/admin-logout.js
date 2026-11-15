import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { serializeCookieHeader } from "@supabase/ssr";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { supabase } = createSupabaseServerClient(req, res);
    await supabase.auth.signOut({ scope: "local" });
  } catch (err) {
    console.error("Admin logout error:", err);
  }

  const previous = res.getHeader("Set-Cookie");
  const previousList = previous ? (Array.isArray(previous) ? previous : [String(previous)]) : [];
  const expired = Object.keys(req.cookies || {})
    .filter((name) => name.startsWith("sb-"))
    .map((name) => serializeCookieHeader(name, "", { path: "/", maxAge: 0 }));
  res.setHeader("Set-Cookie", [...previousList, ...expired]);

  return res.status(200).json({ success: true });
}