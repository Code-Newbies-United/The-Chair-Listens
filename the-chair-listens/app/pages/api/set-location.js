// Destination: pages/api/admin/set-location.js
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminsession";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, lat, lng } = req.body;

    if (!name || typeof lat !== "number" || typeof lng !== "number") {
        return res.status(400).json({ message: "name, lat, and lng are required" });
    }

    // Only one location should be "active" (the chair's current spot) at a time
    const { error: deactivateError } = await supabase
        .from("locations")
        .update({ active: false })
        .eq("active", true);

    if (deactivateError) {
        console.error("Failed to deactivate previous location:", deactivateError);
        return res.status(500).json({ message: "Failed to update previous location" });
    }

    const { data, error: insertError } = await supabase
        .from("locations")
        .insert({
            name,
            lat,
            lng,
            active: true,
            visited_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (insertError) {
        console.error("Failed to insert new location:", insertError);
        return res.status(500).json({ message: "Failed to save new location" });
    }

    return res.status(200).json({ location: data });
}