// Destination: pages/api/admin/quiz-questions.js
import { supabase } from "@/lib/supabaseClient";
import { verifyAdminSession } from "@/lib/adminsession";

export default async function handler(req, res) {
    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.method === "GET") {
        const { data, error } = await supabase
            .from("quiz_questions")
            .select("*")
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("Admin quiz fetch error:", error);
            return res.status(500).json({ message: "Failed to fetch quiz questions" });
        }
        return res.status(200).json({ questions: data });
    }

    if (req.method === "POST") {
        const { statement, is_myth, explanation, sort_order } = req.body;

        if (!statement || typeof is_myth !== "boolean" || !explanation) {
            return res.status(400).json({
                message: "statement, is_myth (boolean), and explanation are required",
            });
        }

        const { data, error } = await supabase
            .from("quiz_questions")
            .insert({ statement, is_myth, explanation, sort_order: sort_order ?? 0 })
            .select()
            .single();

        if (error) {
            console.error("Admin quiz insert error:", error);
            return res.status(500).json({ message: "Failed to add quiz question" });
        }
        return res.status(200).json({ question: data });
    }

    if (req.method === "DELETE") {
        const { id } = req.query;
        if (!id) return res.status(400).json({ message: "id is required" });

        const { error } = await supabase.from("quiz_questions").delete().eq("id", id);
        if (error) {
            console.error("Admin quiz delete error:", error);
            return res.status(500).json({ message: "Failed to delete quiz question" });
        }
        return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: "Method not allowed" });
}