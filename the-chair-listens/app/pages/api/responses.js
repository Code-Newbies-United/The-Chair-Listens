import { supabase } from "@/lib/supabaseClient";

export default async function manage_responses(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint"
        });
    }

    const answers = req.body.answers;

    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Answers must be a non-empty array"
        });
    }

    const { error } = await supabase.from('responses').insert({ answers });
    if (error) {
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to save responses"
        })
    }

    res.status(200).json({ success: true });
}