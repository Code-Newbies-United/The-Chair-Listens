// pages/api/admin/pathways.js
//
// Admin management of reflection pathways (FIX-16 follow-up).
//   GET    -> every pathway (active and inactive), without the AI prompt
//   POST   -> create a pathway
//   PATCH  -> edit one pathway (label, description, active, AI prompt),
//             or reorder them all with { order: ["key1", "key2", ...] }
//
// There is no DELETE on purpose: questions and saved responses point at a
// pathway key, so a pathway is switched off (active = false) instead.
import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";
import { verifyAdminSession } from "@/lib/adminsession";
import { getAllPathways, clearPathwaysCache } from "@/lib/pathways";
import { toAdmin } from "@/lib/pathwayShape";
import { parseScriptKey } from "@/lib/validators";

const MAX_LABEL = 60;
const MAX_DESCRIPTION = 200;
const MAX_PROMPT = 4000;

function cleanText(value) {
    return typeof value === "string" ? value.trim() : "";
}

export default async function handler(req, res) {
    // Verify HMAC-signed session
    if (!verifyAdminSession(req)) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const { method } = req;

    switch (method) {
        case "GET": {
            try {
                const rows = await getAllPathways({ fresh: true });
                return res.status(200).json({ pathways: rows.map(toAdmin) });
            } catch (err) {
                console.error("Admin pathways fetch error:", err?.message || err);
                return res.status(500).json({ message: "Failed to load pathways" });
            }
        }

        case "POST": {
            const body = req.body || {};

            const parsedKey = parseScriptKey(body.key);
            if (!parsedKey.ok) {
                return res.status(400).json({
                    message: parsedKey.issues?.[0]?.message || "Invalid key",
                });
            }
            const key = parsedKey.data;

            const label = cleanText(body.label);
            const description = cleanText(body.description);
            const prompt = cleanText(body.ai_system_prompt);

            if (!label || label.length > MAX_LABEL) {
                return res
                    .status(400)
                    .json({ message: `Label is required (max ${MAX_LABEL} characters)` });
            }
            if (!description || description.length > MAX_DESCRIPTION) {
                return res.status(400).json({
                    message: `Description is required (max ${MAX_DESCRIPTION} characters)`,
                });
            }
            if (prompt.length > MAX_PROMPT) {
                return res.status(400).json({ message: "AI prompt is too long" });
            }

            try {
                const rows = await getAllPathways({ fresh: true });

                if (rows.some((p) => p.key === key)) {
                    return res
                        .status(400)
                        .json({ message: "A pathway with this key already exists" });
                }

                const nextOrder =
                    rows.reduce((max, p) => Math.max(max, p.sort_order ?? 0), 0) + 1;

                const { data, error } = await supabase
                    .from("pathways")
                    .insert([
                        {
                            key,
                            label,
                            description,
                            // Empty means "use the default prompt" (see buildSystemPrompt).
                            ai_system_prompt: prompt || "",
                            // New pathways start switched off unless asked otherwise,
                            // so questions can be prepared first.
                            active: body.active === true,
                            sort_order: nextOrder,
                        },
                    ])
                    .select();

                if (error) {
                    console.error("Admin pathway insert error:", error);
                    return res
                        .status(500)
                        .json({ message: error.message || "Failed to create pathway" });
                }

                clearPathwaysCache();
                return res.status(201).json({ success: true, pathway: toAdmin(data[0]) });
            } catch (err) {
                console.error("Admin pathway create error:", err?.message || err);
                return res.status(500).json({ message: "Failed to create pathway" });
            }
        }

        case "PATCH": {
            const body = req.body || {};

            try {
                // ---- Reorder: { order: ["key1", "key2", ...] } ----
                if (Array.isArray(body.order)) {
                    const keys = body.order.filter((k) => typeof k === "string");
                    if (keys.length === 0 || new Set(keys).size !== keys.length) {
                        return res.status(400).json({ message: "Invalid order" });
                    }

                    const rows = await getAllPathways({ fresh: true });
                    const known = new Set(rows.map((p) => p.key));
                    if (keys.some((k) => !known.has(k))) {
                        return res.status(400).json({ message: "Unknown pathway in order" });
                    }

                    const results = await Promise.all(
                        keys.map((k, index) =>
                            supabase
                                .from("pathways")
                                .update({ sort_order: index + 1 })
                                .eq("key", k)
                        )
                    );
                    const failed = results.find((r) => r.error);
                    if (failed) {
                        console.error("Admin pathway reorder error:", failed.error);
                        return res.status(500).json({ message: "Failed to reorder pathways" });
                    }

                    clearPathwaysCache();
                    return res.status(200).json({ success: true });
                }

                // ---- Edit one pathway ----
                if (typeof body.key !== "string" || !body.key) {
                    return res.status(400).json({ message: "Pathway key is required" });
                }

                const rows = await getAllPathways({ fresh: true });
                if (!rows.some((p) => p.key === body.key)) {
                    return res.status(404).json({ message: "Pathway not found" });
                }

                const update = {};

                if (body.label !== undefined) {
                    const label = cleanText(body.label);
                    if (!label || label.length > MAX_LABEL) {
                        return res.status(400).json({
                            message: `Label is required (max ${MAX_LABEL} characters)`,
                        });
                    }
                    update.label = label;
                }

                if (body.description !== undefined) {
                    const description = cleanText(body.description);
                    if (!description || description.length > MAX_DESCRIPTION) {
                        return res.status(400).json({
                            message: `Description is required (max ${MAX_DESCRIPTION} characters)`,
                        });
                    }
                    update.description = description;
                }

                if (body.active !== undefined) {
                    if (typeof body.active !== "boolean") {
                        return res.status(400).json({ message: "active must be true or false" });
                    }
                    update.active = body.active;
                }

                // The AI prompt is write-only: it is never sent back to the
                // browser. Only a non-empty value replaces the current prompt.
                if (body.ai_system_prompt !== undefined) {
                    const prompt = cleanText(body.ai_system_prompt);
                    if (prompt.length > MAX_PROMPT) {
                        return res.status(400).json({ message: "AI prompt is too long" });
                    }
                    if (prompt) update.ai_system_prompt = prompt;
                }

                if (Object.keys(update).length === 0) {
                    return res.status(400).json({ message: "Nothing to update" });
                }

                const { error } = await supabase
                    .from("pathways")
                    .update(update)
                    .eq("key", body.key);

                if (error) {
                    console.error("Admin pathway update error:", error);
                    return res.status(500).json({ message: "Failed to update pathway" });
                }

                clearPathwaysCache();
                return res.status(200).json({ success: true });
            } catch (err) {
                console.error("Admin pathway patch error:", err?.message || err);
                return res.status(500).json({ message: "Failed to update pathway" });
            }
        }

        default:
            res.setHeader("Allow", ["GET", "POST", "PATCH"]);
            return res.status(405).json({ message: `Method ${method} Not Allowed` });
    }
}