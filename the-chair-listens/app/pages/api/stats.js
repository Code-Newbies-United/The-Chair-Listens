// Destination: pages/api/stats.js
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin"; // server-side key: reads responses, which the public key must never be able to read
import { verifyAdminSession } from "@/lib/adminsession";
import { getAllPathways } from "@/lib/pathways";

const SCRIPT_COLUMN = "script";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        // Every pathway in the database, including inactive ones, so older
        // responses still show up and a newly added pathway appears at once (FIX-16).
        const pathways = await getAllPathways();

        const [totalResponsesRes, totalLocationsRes, activeLocationRes, ...scriptCountResults] =
            await Promise.all([
                supabase.from("responses").select("*", { count: "exact", head: true }),
                supabase.from("locations").select("*", { count: "exact", head: true }),
                supabase.from("locations").select("name").eq("active", true).maybeSingle(),
                ...pathways.map((p) =>
                    supabase
                        .from("responses")
                        .select("*", { count: "exact", head: true })
                        .eq(SCRIPT_COLUMN, p.key)
                ),
            ]);

        // An array (not an object) so the order and the labels come from the table.
        const breakdown = pathways.map((p, i) => ({
            key: p.key,
            label: p.label,
            active: p.active,
            count: scriptCountResults[i]?.count ?? 0,
        }));

        // Responses whose pathway no longer exists in the table are not hidden.
        const totalResponses = totalResponsesRes.count ?? 0;
        const counted = breakdown.reduce((sum, row) => sum + row.count, 0);
        if (totalResponses > counted) {
            breakdown.push({
                key: "__other",
                label: "Other / unassigned",
                active: false,
                count: totalResponses - counted,
            });
        }

        const { data: recentLocations, error: recentError } = await supabase
            .from("locations")
            .select("name, visited_at, active")
            .order("visited_at", { ascending: false })
            .limit(5);

        if (recentError) {
            console.error("Admin stats — recent locations error:", recentError);
        }

        return res.status(200).json({
            totalResponses,
            totalLocations: totalLocationsRes.count ?? 0,
            activeLocationName: activeLocationRes?.data?.name ?? null,
            breakdown,
            recentLocations: recentLocations || [],
        });
    } catch (err) {
        console.error("Admin stats error:", err);
        return res.status(500).json({ message: "Failed to load dashboard stats" });
    }
}