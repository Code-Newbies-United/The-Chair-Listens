import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hasAdminInviteFlag } from "@/lib/adminInvite";

// Public by design (the invitee has no session yet). POST { token_hash }.
// A session cookie is issued ONLY for a genuine admin invite.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const tokenHash = req.body?.token_hash;
  if (typeof tokenHash !== "string" || !tokenHash || tokenHash.length > 512) {
    return res.status(400).json({ success: false, message: "Invalid invitation link." });
  }

  const { supabase, commitCookies, discardCookies } = createSupabaseServerClient(req, res, {
    holdCookies: true,
  });
  const invalid = { success: false, message: "This invitation link is invalid or has expired." };

  try {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "invite" });
    if (error || !data?.user || !data?.session) {
      discardCookies();
      return res.status(401).json(invalid);
    }

    // Not created by the admin invite flow, or already onboarded: no session for them
    let allowed = hasAdminInviteFlag(data.user);
    if (allowed) {
      const { data: existing, error: rowError } = await supabaseAdmin
        .from("admins")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();
      if (rowError) throw rowError;
      if (existing) allowed = false;
    }

    if (!allowed) {
      discardCookies();
      await supabaseAdmin.auth.admin.signOut(data.session.access_token, "local").catch(() => {});
      return res.status(401).json(invalid);
    }

    commitCookies();
    return res.status(200).json({ success: true });
  } catch (err) {
    discardCookies();
    console.error("Accept invite error:", err);
    return res.status(500).json({ success: false, message: "Server error, please try again." });
  }
}
