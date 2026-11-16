//team.js
import { requireAdmin } from "@/lib/requireAdmin";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { hasAdminInviteFlag } from "@/lib/adminInvite";

const PER_PAGE = 200;
const MAX_PAGES = 10;

async function listPendingInvites(adminIds) {
  const invites = [];
  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: PER_PAGE });
    if (error) throw error;
    const users = data?.users || [];
    for (const user of users) {
      if (hasAdminInviteFlag(user) && !adminIds.has(user.id)) {
        invites.push({
          id: user.id,
          email: user.email,
          invited_at: user.invited_at || user.created_at,
        });
      }
    }
    if (users.length < PER_PAGE) break;
  }
  return invites;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { data: admins, error } = await supabaseAdmin
      .from("admins")
      .select("user_id, email, role, active, created_at")
      .order("created_at", { ascending: true });
    if (error) throw error;

    const adminIds = new Set((admins || []).map((a) => a.user_id));
    const invites = await listPendingInvites(adminIds);

    return res.status(200).json({ me: admin.id, admins: admins || [], invites });
  } catch (err) {
    console.error("Admin team error:", err);
    return res.status(500).json({ message: "Could not load the team." });
  }
}