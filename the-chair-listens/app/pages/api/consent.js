import { supabase } from "@/lib/supabaseClient";

export default async function manage_communication(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: "Method Not Allowed",
            message:"Only POST requests are accepted on this endpoint"
        });
    }
    const location_id = req.body.location_id;

    if (location_id == null || location_id === "") {
        return res.status(400).json({
            error: "Bad Request",
            message: "location_id is required"
        })
    }

    const { error } = await supabase.from('consent').insert({ location_id });
    if (error) {
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to save consent"
        })
    }

    res.status(200).json({success: true});
}