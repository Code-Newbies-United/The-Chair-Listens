import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hasAdminInviteFlag } from "@/lib/adminInvite";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = req.body?.user_id;
  if (typeof userId !== "string" || !userId) {
    return res.status(400).json({ message: "An invitation is required." });
  }

  try {
    const { data: existing, error: rowError } = await supabaseAdmin
      .from("admins")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (rowError) throw rowError;
    if (existing) {
      return res.status(409).json({ message: "This person is already an admin. Deactivate them instead." });
    }

    const { data, error: lookupError } = await supabaseAdmin.auth.admin.getUserById(userId);
    const user = data?.user;
    if (lookupError || !user || !hasAdminInviteFlag(user)) {
      return res.status(404).json({ message: "That invitation no longer exists." });
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (deleteError) throw deleteError;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Revoke invite error:", err);
    return res.status(500).json({ message: "Could not revoke the invitation." });
  }
}