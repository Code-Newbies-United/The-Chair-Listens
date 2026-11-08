import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { normalizeEmail, isValidEmail } from "@/lib/adminInvite";

// POST { email }: an active admin invites a new admin by email.
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
    // The link in the email is built by the Invite email template (uses the project's Site URL)
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (error || !data?.user) {
      // Includes "already registered". Don't leak which emails have accounts.
      console.error("Admin invite error:", error?.message || error);
      return res.status(400).json({ message: "Could not send an invitation to that address." });
    }

    // Only the server can set app_metadata, so the invitee cannot fake an admin invite.
    const { error: flagError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
      app_metadata: { admin_invite: true },
    });
    if (flagError) throw flagError;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Admin invite error:", err);
    return res.status(500).json({ message: "Server error, please try again." });
  }
}
