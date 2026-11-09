// pages/api/admin/pathways.js
//
// GET /api/admin/pathways : every pathway (including inactive ones), for the
// admin screens (FIX-16). Admin session required. Read from the database each
// time (not the 30s cache) so a row you just added shows up straight away.
// The AI prompt is not returned: admins edit it in Supabase.
import { verifyAdminSession } from "@/lib/adminsession";
import { getAllPathways } from "@/lib/pathways";
import { toAdmin } from "@/lib/pathwayShape";

export default async function handler(req, res) {
    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }

    try {
        const pathways = await getAllPathways({ fresh: true });
        return res.status(200).json({ pathways: pathways.map(toAdmin) });
    } catch (err) {
        console.error("Admin pathways fetch error:", err?.message || err);
        return res.status(500).json({ message: "Failed to load pathways" });
    }
}
