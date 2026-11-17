import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { reportServerError } from "@/lib/monitor";
import {
  getClientIp,
  getFailureCount,
  recordFailure,
  clearFailures,
} from "@/lib/rateLimit";

// Lockout rules. Failures are counted in Redis (shared by every serverless
// instance), so an attacker cannot get fresh attempts just by hitting a
// different instance or waiting for a cold start.
//   * 5 failures for the same email from the same IP  -> locked for 15 minutes
//   * 20 failures from one IP across ANY emails        -> locked for 15 minutes
//     (stops one machine trying many accounts)
const WINDOW_SECONDS = 15 * 60;
const MAX_FAILURES_PER_ACCOUNT = 5;
const MAX_FAILURES_PER_IP = 20;
const ACCOUNT_NAMESPACE = "admin-login";
const IP_NAMESPACE = "admin-login-ip";

async function isLockedOut(accountId, ip) {
  const [accountFailures, ipFailures] = await Promise.all([
    getFailureCount(ACCOUNT_NAMESPACE, accountId),
    getFailureCount(IP_NAMESPACE, ip),
  ]);
  return (
    accountFailures >= MAX_FAILURES_PER_ACCOUNT ||
    ipFailures >= MAX_FAILURES_PER_IP
  );
}

async function recordLoginFailure(accountId, ip) {
  await Promise.all([
    recordFailure(ACCOUNT_NAMESPACE, accountId, WINDOW_SECONDS),
    recordFailure(IP_NAMESPACE, ip, WINDOW_SECONDS),
  ]);
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

  const ip = getClientIp(req);
  const accountId = `${ip}:${email}`;

  if (await isLockedOut(accountId, ip)) {
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
      await recordLoginFailure(accountId, ip);
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
      await recordLoginFailure(accountId, ip);
      return res.status(401).json({ success: false, message: "Incorrect email or password." });
    }

    // A good login clears this account's failures. The per-IP count is left to
    // expire on its own, so one valid login cannot be used to reset an attack.
    await clearFailures(ACCOUNT_NAMESPACE, accountId);
    commitCookies();
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Admin login error:", err);
    reportServerError(new Error(`admin-login failed: ${err?.name} ${err?.status ?? ""}`), {
      route: "admin-login",
    });
    return res.status(500).json({ success: false, message: "Server error, please try again." });
  }
}
