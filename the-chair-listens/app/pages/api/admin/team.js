import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { data: admins, error: adminsError } = await supabaseAdmin
      .from("admins")
      .select("user_id, email, role, active, created_at")
      .order("created_at", { ascending: true });
    if (adminsError) throw adminsError;

    const { data: invites, error: invitesError } = await supabaseAdmin
      .from("admin_invites")
      .select("id, email, created_at, expires_at")
      .is("used_at", null)
      .is("revoked_at", null)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false });
    if (invitesError) throw invitesError;

    return res.status(200).json({ me: admin.id, admins: admins || [], invites: invites || [] });
  } catch (err) {
    console.error("Admin team error:", err);
    return res.status(500).json({ message: "Could not load the team." });
  }
}