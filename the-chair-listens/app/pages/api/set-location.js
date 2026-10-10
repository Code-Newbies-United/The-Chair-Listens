// Destination: pages/api/set-location.js
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

    if (
        typeof name !== "string" ||
        !name.trim() ||
        typeof lat !== "number" ||
        !Number.isFinite(lat) ||
        lat < -90 ||
        lat > 90 ||
        typeof lng !== "number" ||
        !Number.isFinite(lng) ||
        lng < -180 ||
        lng > 180
    ) {
        return res.status(400).json({
            message: "A valid name, latitude, and longitude are required",
        });
    }

    // Only one location should be "active" (the chair's current spot) at a time
    
    const { data, error } = await supabase.rpc(
        "set_active_chair_location",
        {
            p_name: name.trim(),
            p_lat: lat,
            p_lng: lng,
        }
    );

    if (error || !data || data.length === 0) {
        console.error("Failed to set active chair location:", error);
        return res.status(500).json({
            message: "Failed to save the new chair location",
        });
    }

    return res.status(200).json({ location: data[0] });
}