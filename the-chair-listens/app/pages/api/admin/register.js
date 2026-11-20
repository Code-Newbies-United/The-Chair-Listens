import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeEmail, isValidEmail, validatePassword } from "@/lib/adminInvite";
import { codeMatches } from "@/lib/adminCode";

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;
const failures = new Map();

function keyFor(req, email) {
  const ip = String(req.headers?.["x-forwarded-for"] || req.socket?.remoteAddress || "unknown")
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

const NO_MATCH = { success: false, message: "That email and code do not match an open invitation." };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const email = normalizeEmail(req.body?.email);
  const code = req.body?.code;
  const password = req.body?.password;

  if (!isValidEmail(email) || typeof code !== "string" || !code.trim()) {
    return res.status(400).json({ success: false, message: "Email and invitation code are required." });
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }

  const key = keyFor(req, email);
  if (isBlocked(key)) {
    return res
      .status(429)
      .json({ success: false, message: "Too many failed attempts. Try again in 15 minutes." });
  }

  try {
    const { data: invite, error: inviteError } = await supabaseAdmin
      .from("admin_invites")
      .select("id, code_hash, expires_at")
      .eq("email", email)
      .is("used_at", null)
      .is("revoked_at", null)
      .maybeSingle();
    if (inviteError) throw inviteError;

    if (!invite || new Date(invite.expires_at) <= new Date() || !codeMatches(code, invite.code_hash)) {
      recordFailure(key);
      return res.status(401).json(NO_MATCH);
    }

    const { data: claimed, error: claimError } = await supabaseAdmin
      .from("admin_invites")
      .update({ used_at: new Date().toISOString() })
      .eq("id", invite.id)
      .is("used_at", null)
      .is("revoked_at", null)
      .select("id");
    if (claimError) throw claimError;
    if (!claimed || claimed.length === 0) {
      return res.status(401).json(NO_MATCH);
    }

    const release = () => supabaseAdmin.from("admin_invites").update({ used_at: null }).eq("id", invite.id);

    const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created?.user) {
      await release();
      const exists = createError?.code === "email_exists" || /already/i.test(createError?.message || "");
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists. Ask an admin to remove it, then try again.",
        });
      }
      throw createError || new Error("User was not created");
    }

    const { error: adminError } = await supabaseAdmin.from("admins").insert({
      user_id: created.user.id,
      email,
      role: "admin",
      active: true,
    });
    if (adminError) {
      await supabaseAdmin.auth.admin.deleteUser(created.user.id).catch(() => {});
      await release();
      throw adminError;
    }

    failures.delete(key);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Admin register error:", err);
    return res.status(500).json({ success: false, message: "Server error, please try again." });
  }
}