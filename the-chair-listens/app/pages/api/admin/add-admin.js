import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeEmail, isValidEmail } from "@/lib/adminInvite";
import { generateCode, hashCode, CODE_TTL_DAYS } from "@/lib/adminCode";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const email = normalizeEmail(req.body?.email);
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "A valid email address is required." });
  }

  try {
    const { data: existing, error: existingError } = await supabaseAdmin
      .from("admins")
      .select("user_id")
      .eq("email", email)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      return res
        .status(409)
        .json({ message: "That person is already an admin. Use Re-activate if they are inactive." });
    }

    const { error: revokeError } = await supabaseAdmin
      .from("admin_invites")
      .update({ revoked_at: new Date().toISOString() })
      .eq("email", email)
      .is("used_at", null)
      .is("revoked_at", null);
    if (revokeError) throw revokeError;

    const code = generateCode();
    const expiresAt = new Date(Date.now() + CODE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
    const { error: insertError } = await supabaseAdmin.from("admin_invites").insert({
      email,
      code_hash: hashCode(code),
      created_by: admin.id,
      expires_at: expiresAt,
    });
    if (insertError) throw insertError;

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ success: true, email, code, expires_at: expiresAt });
  } catch (err) {
    console.error("Add admin error:", err);
    return res.status(500).json({ message: "Server error, please try again." });
  }
}