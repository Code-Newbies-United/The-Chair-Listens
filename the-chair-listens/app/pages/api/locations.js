import { supabase } from "@/lib/supabaseClient";

/**
 * GET /api/locations
 * Returns every chair location (active and past) for ChairJourneyMap.
 *
 * Reads from the same Supabase "locations" table that
 * pages/api/admin/set-location.js writes to — this is what wires the
 * admin's "set location" action through to the public journey map.
 *
 * Requires a public SELECT policy in Supabase, since this uses the
 * anon-key client (safe here — it's read-only, non-sensitive data):
 *
 *   alter table locations enable row level security;
 *   create policy "Public can read locations"
 *     on locations for select
 *     using (true);
 *
 * (Your existing "no anonymous insert" restriction stays as-is — this
 * only adds read access, not write access.)
 */
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { data, error } = await supabase
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