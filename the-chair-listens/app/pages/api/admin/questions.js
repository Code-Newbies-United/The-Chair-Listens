// pages/api/admin/questions.js
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminsession";
import { getPathway } from "@/lib/pathways";
import { MOOD_IDS } from "@/lib/moods";

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
                .select("id, script_key, title, question_text, placeholder, sort_order, mood")
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
            // Matches what pages/admin/questions.jsx sends:
            // { script_key, title, question_text, placeholder, sort_order, mood }
            const { script_key, title, question_text, placeholder, sort_order, mood } =
                req.body || {};

            if (!title || !question_text) {
                return res.status(400).json({ message: "Title and Question Text are required" });
            }

            // Empty mood means "shown for every mood". Anything else must be
            // one of the known moods.
            if (mood && !MOOD_IDS.includes(mood)) {
                return res.status(400).json({ message: "Unknown mood" });
            }

            // No silent default pathway (FIX-16): the key must be sent and must
            // exist. A draft (inactive) pathway is allowed, so questions can be
            // prepared before it goes live.
            if (!script_key) {
                return res.status(400).json({ message: "A pathway (script_key) is required" });
            }

            let pathway;
            try {
                pathway = await getPathway(script_key, { includeInactive: true });
            } catch (err) {
                console.error("Admin question pathway lookup error:", err?.message || err);
                return res.status(500).json({ message: "Failed to check the pathway" });
            }
            if (!pathway) {
                return res.status(400).json({ message: "Unknown pathway" });
            }

            const { data, error } = await supabase
                .from("questions")
                .insert([
                    {
                        title,
                        question_text,
                        placeholder: placeholder || "",
                        script_key: pathway.key,
                        sort_order: sort_order ?? 0,
                        mood: mood || null,
                    },
                ])
                .select();

            if (error) {
                console.error("Admin question insert error:", error);
                return res.status(500).json({ message: error.message || "Failed to create question" });
            }

            return res.status(201).json({ success: true, question: data[0] });
        }

        case "PATCH": {
            // Change which mood a question is shown for (empty = every mood).
            const { id } = req.query;
            const { mood } = req.body || {};

            if (!id) {
                return res.status(400).json({ message: "Question ID is required" });
            }
            if (mood && !MOOD_IDS.includes(mood)) {
                return res.status(400).json({ message: "Unknown mood" });
            }

            const { error } = await supabase
                .from("questions")
                .update({ mood: mood || null })
                .eq("id", id);

            if (error) {
                console.error("Admin question update error:", error);
                return res.status(500).json({ message: "Failed to update question" });
            }

            return res.status(200).json({ success: true });
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
            res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}