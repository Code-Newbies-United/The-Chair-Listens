import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

export function withAdmin(handler) {
  return async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return res.status(401).json({ message: "Unauthorized" });
    req.admin = admin;
    return handler(req, res);
  };
}