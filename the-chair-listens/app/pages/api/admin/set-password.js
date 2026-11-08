import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hasAdminInviteFlag, validatePassword, normalizeEmail } from "@/lib/adminInvite";

// Public by design but needs the invite session from /api/admin/accept-invite.
// POST { password }: creates the admins row, sets the password, clears the invite flag.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const passwordError = validatePassword(req.body?.password);
  if (passwordError) {
    return res.status(400).json({ success: false, message: passwordError });
  }
  const password = req.body.password;

  try {
    const { supabase } = createSupabaseServerClient(req, res);
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;
    if (error || !user || !hasAdminInviteFlag(user)) {
      return res.status(401).json({ success: false, message: "Your invitation has expired. Ask for a new one." });
    }

    // SECURITY: refuse if ANY admins row exists (even a deactivated one), otherwise a
    // leftover invite could re-activate a deactivated admin.
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("admins")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    if (lookupError) throw lookupError;
    if (existing) {
      return res.status(403).json({ success: false, message: "This invitation can no longer be used." });
    }

    // Plain insert (not upsert): a concurrent request loses on the primary key
    const { error: insertError } = await supabaseAdmin.from("admins").insert({
      user_id: user.id,
      email: normalizeEmail(user.email),
      role: "admin",
      active: true,
    });
    if (insertError) {
      if (insertError.code === "23505") {
        return res.status(403).json({ success: false, message: "This invitation can no longer be used." });
      }
      throw insertError;
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password,
      app_metadata: { admin_invite: null },
    });
    if (updateError) {
      // Roll back so the invitee can try again
      await supabaseAdmin.from("admins").delete().eq("user_id", user.id);
      throw updateError;
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Set password error:", err);
    return res.status(500).json({ success: false, message: "Server error, please try again." });
  }
}
