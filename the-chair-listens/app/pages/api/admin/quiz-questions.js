import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
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
        const { question_text, options, explanation, sort_order } = req.body || {};

        if (!question_text || !question_text.trim()) {
            return res.status(400).json({ message: "question_text is required" });
        }
        if (!explanation || !explanation.trim()) {
            return res.status(400).json({ message: "explanation is required" });
        }
        if (!Array.isArray(options) || options.length < 2) {
            return res.status(400).json({ message: "At least 2 options are required" });
        }
        const cleanedOptions = options
            .map((o) => ({
                text: (o.text || "").trim(),
                is_correct: Boolean(o.is_correct),
            }))
            .filter((o) => o.text.length > 0);

        if (cleanedOptions.length < 2) {
            return res.status(400).json({ message: "At least 2 non-empty options are required" });
        }
        if (!cleanedOptions.some((o) => o.is_correct)) {
            return res.status(400).json({ message: "Mark at least one option as correct" });
        }

        const { data, error } = await supabase
            .from("quiz_questions")
            .insert({
                question_text: question_text.trim(),
                options: cleanedOptions,
                explanation: explanation.trim(),
                sort_order: sort_order ?? 0,
            })
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