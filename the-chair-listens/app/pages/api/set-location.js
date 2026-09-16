import { createClient } from "@supabase/supabase-js";

// Use SERVICE_ROLE_KEY on the server to bypass RLS policies
const supabaseServer = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    const { name } = req.body;

    const { data, error } = await supabaseServer
        .from("locations")
        .insert([{ name }]);

    if (error) {
        return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({ success: true, data });
}