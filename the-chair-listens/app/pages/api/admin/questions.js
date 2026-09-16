// Destination: pages/api/admin/questions.js
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminsession";

export default async function handler(req, res) {
    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
        const { script } = req.query;
        let query = supabase.from("questions").select("*").order("sort_order", { ascending: true });
        if (script) query = query.eq("script_key", script);

        const { data, error } = await query;
        if (error) {
            console.error("Admin questions fetch error:", error);
            return res.status(500).json({ message: "Failed to fetch questions" });
        }
        return res.status(200).json({ questions: data });
    }

    if (req.method === "POST") {
        const { script_key, title, question_text, placeholder, sort_order } = req.body;

        if (!script_key || !question_text) {
            return res.status(400).json({ message: "script_key and question_text are required" });
        }

        const { data, error } = await supabase
            .from("questions")
            .insert({
                script_key,
                title: title || "",
                question_text,
                placeholder: placeholder || "",
                sort_order: sort_order ?? 0,
            })
            .select()
            .single();

        if (error) {
            console.error("Admin questions insert error:", error);
            return res.status(500).json({ message: "Failed to add question" });
        }
        return res.status(200).json({ question: data });
    }

    if (req.method === "DELETE") {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: "id is required" });

        const { error } = await supabase.from("questions").delete().eq("id", id);
        if (error) {
            console.error("Admin questions delete error:", error);
            return res.status(500).json({ message: "Failed to delete question" });
        }
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
}