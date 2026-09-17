import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminsession";

export default async function handler(req, res) {
    // Verify HMAC-signed session
    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { method } = req;

    switch (method) {
        case "GET": {
            const { script } = req.query;

            let query = supabase
                .from("questions")
                .select("id, script_key, title, question_text, placeholder, sort_order")
                .order("sort_order", { ascending: true });

            if (script) {
                query = query.eq("script_key", script);
            }

            const { data, error } = await query;

            if (error) {
                console.error("Admin questions fetch error:", error);
                return res.status(500).json({ message: "Failed to load questions" });
            }

            return res.status(200).json({ questions: data || [] });
        }

        case "POST": {
            // Matches what pages/admin/questions.jsx actually sends:
            // { script_key, title, question_text, placeholder, sort_order }
            const { script_key, title, question_text, placeholder, sort_order } = req.body || {};

            if (!title || !question_text) {
                return res.status(400).json({ message: "Title and Question Text are required" });
            }

            const { data, error } = await supabase
                .from("questions")
                .insert([
                    {
                        title,
                        question_text,
                        placeholder: placeholder || "",
                        script_key: script_key || "men_mental_health",
                        sort_order: sort_order ?? 0,
                    },
                ])
                .select();

            if (error) {
                console.error("Admin question insert error:", error);
                return res.status(500).json({ message: error.message || "Failed to create question" });
            }

            return res.status(201).json({ success: true, question: data[0] });
        }

        case "DELETE": {
            const { id } = req.query;

            if (!id) {
                return res.status(400).json({ message: "Question ID is required" });
            }

            const { error } = await supabase
                .from("questions")
                .delete()
                .eq("id", id);

            if (error) {
                console.error("Admin question delete error:", error);
                return res.status(500).json({ message: "Failed to delete question" });
            }

            return res.status(200).json({ success: true });
        }

        default:
            res.setHeader("Allow", ["GET", "POST", "DELETE"]);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}