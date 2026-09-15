// Destination: pages/api/stats.js
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminsession";

const SCRIPT_COLUMN = "script";
const SCRIPT_KEYS = ["men_mental_health", "ally_support", "fast_track_activations"];

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const [totalResponsesRes, totalLocationsRes, activeLocationRes, ...scriptCountResults] =
            await Promise.all([
                supabase.from("responses").select("*", { count: "exact", head: true }),
                supabase.from("locations").select("*", { count: "exact", head: true }),
                supabase.from("locations").select("name").eq("active", true).maybeSingle(),
                ...SCRIPT_KEYS.map((key) =>
                    supabase
                        .from("responses")
                        .select("*", { count: "exact", head: true })
                        .eq(SCRIPT_COLUMN, key)
                ),
            ]);

        const breakdown = SCRIPT_KEYS.reduce((acc, key, i) => {
            acc[key] = scriptCountResults[i]?.count ?? 0;
            return acc;
        }, {});

        const { data: recentLocations, error: recentError } = await supabase
            .from("locations")
            .select("name, visited_at, active")
            .order("visited_at", { ascending: false })
            .limit(5);

        if (recentError) {
            console.error("Admin stats — recent locations error:", recentError);
        }

        return res.status(200).json({
            totalResponses: totalResponsesRes.count ?? 0,
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