import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";

/**
 * GET /api/quiz-questions
 * Public, read-only. Returns all quiz questions, ordered.
 *
 * Uses the service-role client server-side, same reasoning as
 * pages/api/questions.js — no public SELECT policy exists on this
 * table, so the anon client would silently return zero rows.
 */
export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const { data, error } = await supabase
        .from("quiz_questions")
        .select("id, question_text, options, explanation, sort_order")
        .order("sort_order", { ascending: true });

    if (error) {
        console.error("Public quiz questions fetch error:", error);
        return res.status(500).json({ message: "Failed to load quiz questions" });
    }

    return res.status(200).json({ questions: data || [] });
}