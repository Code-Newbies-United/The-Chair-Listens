import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/locations
 * Returns every chair location (active and past) for ChairJourneyMap.
 *
 * Reads from the same Supabase "locations" table that
 * pages/api/set-location.js writes to.
 *
 * Uses the server-side (service role) client. The database is locked so the
 * public key can't read ANY table directly (see 003_enable_rls.sql); all data
 * reaches the browser through routes like this one, which choose exactly which
 * columns to return. Only explicit, non-sensitive columns are selected below.
 */
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { data, error } = await supabaseAdmin
        .from("locations")
        .select("id, name, lat, lng, active, visited_at")
        .order("visited_at", { ascending: false });

    if (error) {
        console.error("Failed to fetch locations:", error);
        return res.status(500).json({ error: "Failed to load locations" });
    }

    const locations = (data || []).map((row) => ({
        id: row.id,
        name: row.name,
        lat: row.lat,
        lng: row.lng,
        active: row.active,
        date: row.visited_at
            ? new Date(row.visited_at).toLocaleDateString("en-ZA", {
                month: "short",
                year: "numeric",
            })
            : null,
    }));

    return res.status(200).json({ locations });
}
