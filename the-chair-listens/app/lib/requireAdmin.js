import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * Returns { id, email, role } for an active admin, or null.
 * Runs on EVERY request: the session is verified with Supabase Auth, then the
 * admins table is checked, so deactivating an admin blocks their next request.
 */
export async function requireAdmin(req, res) {
  try {
    const { supabase } = createSupabaseServerClient(req, res);
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) return null;

    const { data: row, error: rowError } = await supabaseAdmin
      .from("admins")
      .select("user_id, email, role, active")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (rowError || !row || !row.active) return null;

    return { id: data.user.id, email: row.email, role: row.role };
  } catch (err) {
    console.error("requireAdmin error:", err);
    return null;
  }
}

// Wrap an API handler: 401 unless an active admin is logged in. Sets req.admin.
export function withAdmin(handler) {
  return async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return res.status(401).json({ message: "Unauthorized" });
    req.admin = admin;
    return handler(req, res);
  };
}