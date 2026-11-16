//set-admin-active.js
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

  const userId = req.body?.user_id;
  const active = req.body?.active;
  if (typeof userId !== "string" || !userId || typeof active !== "boolean") {
    return res.status(400).json({ message: "An admin and a status are required." });
  }

  if (!active && userId === admin.id) {
    return res.status(400).json({ message: "You cannot deactivate your own account." });
  }

  try {
    const { data: target, error: rowError } = await supabaseAdmin
      .from("admins")
      .select("user_id, active")
      .eq("user_id", userId)
      .maybeSingle();
    if (rowError) throw rowError;
    if (!target) {
      return res.status(404).json({ message: "That admin does not exist." });
    }

    if (!active && target.active) {
      const { count, error: countError } = await supabaseAdmin
        .from("admins")
        .select("user_id", { count: "exact", head: true })
        .eq("active", true);
      if (countError) throw countError;
      if ((count ?? 0) <= 1) {
        return res.status(400).json({ message: "There must always be at least one active admin." });
      }
    }

    const { error: updateError } = await supabaseAdmin
      .from("admins")
      .update({ active })
      .eq("user_id", userId);
    if (updateError) throw updateError;

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Set admin active error:", err);
    return res.status(500).json({ message: "Could not update that admin." });
  }
}