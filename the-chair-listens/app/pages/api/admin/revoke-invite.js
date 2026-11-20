import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const inviteId = req.body?.invite_id;
  if (typeof inviteId !== "string" || !inviteId) {
    return res.status(400).json({ message: "An invitation is required." });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("admin_invites")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", inviteId)
      .is("used_at", null)
      .is("revoked_at", null)
      .select("id");
    if (error) throw error;
    if (!data || data.length === 0) {
      return res.status(404).json({ message: "That invitation no longer exists." });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Revoke invite error:", err);
    return res.status(500).json({ message: "Could not revoke the invitation." });
  }
}