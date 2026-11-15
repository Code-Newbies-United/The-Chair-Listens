import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();

function keyFor(req, email) {
  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
    .split(",")[0]
    .trim();
  return `${ip}:${email}`;
}
function isBlocked(key) {
  const entry = failures.get(key);
  if (!entry) return false;
  if (Date.now() > entry.resetAt) {
    failures.delete(key);
    return false;
  }
  return entry.count >= MAX_FAILURES;
}
function recordFailure(key) {
  const entry = failures.get(key);
  if (!entry || Date.now() > entry.resetAt) {
    failures.set(key, { count: 1, resetAt: Date.now() + WINDOW_MS });
  } else {
    entry.count += 1;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { email: rawEmail, password } = req.body || {};
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
  if (!email || typeof password !== "string" || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }

  const key = keyFor(req, email);
  if (isBlocked(key)) {
    return res
      .status(429)
      .json({ success: false, message: "Too many failed attempts. Try again in 15 minutes." });
  }

  const { supabase, commitCookies, discardCookies } = createSupabaseServerClient(req, res, {
    holdCookies: true,
  });

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.user || !data?.session) {
      recordFailure(key);
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }

    const { data: adminRow, error: rowError } = await supabaseAdmin
      .from("admins")
      .select("active")
      .eq("user_id", data.user.id)
      .maybeSingle();
    if (rowError) throw rowError;

    if (!adminRow?.active) {
      discardCookies();
      await supabaseAdmin.auth.admin.signOut(data.session.access_token, "local").catch(() => {});
      recordFailure(key);
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }

    failures.delete(key);
    commitCookies();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ success: false, message: "Server error, please try again." });
  }
}