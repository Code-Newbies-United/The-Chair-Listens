// pages/api/responses.js
// Saves a finished set of answers. REFUSES to save anything unless it comes with
// a valid, unexpired consent session (created by /api/consent).
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SESSION_MAX_AGE_HOURS, MAX_RESPONSES_PER_SESSION } from "@/lib/consentVersion";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function consentRequired(res, message) {
    return res.status(403).json({ error: "Consent required", message });
}

export default async function manage_responses(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint"
        });
    }

    const { answers, script, location, session_id } = req.body || {};

    // 1. CONSENT GATE: checked before anything else
    if (typeof session_id !== "string" || !UUID_RE.test(session_id)) {
        return consentRequired(res, "Consent is required before responses can be saved.");
    }

    const { data: session, error: sessionError } = await supabaseAdmin
        .from("sessions")
        .select("id, location_id, consented_at")
        .eq("id", session_id)
        .maybeSingle();

    if (sessionError) {
        console.error("Session lookup failed:", sessionError);
        return res.status(500).json({ error: "Connection failed", message: "Failed to verify consent" });
    }
    if (!session || !session.consented_at) {
        return consentRequired(res, "No valid consent was found. Please start again.");
    }

    const ageMs = Date.now() - new Date(session.consented_at).getTime();
    if (ageMs > SESSION_MAX_AGE_HOURS * 60 * 60 * 1000) {
        return consentRequired(res, "Your session has expired. Please start again.");
    }

    // 2. Validate the payload
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Answers must be a non-empty array"
        });
    }

    // 3. Don't let one session flood the archive
    const { count, error: countError } = await supabaseAdmin
        .from("responses")
        .select("id", { count: "exact", head: true })
        .eq("session_id", session.id);

    if (countError) {
        console.error("Response count failed:", countError);
        return res.status(500).json({ error: "Connection failed", message: "Failed to save responses" });
    }
    if ((count ?? 0) >= MAX_RESPONSES_PER_SESSION) {
        return res.status(429).json({
            error: "Too Many Requests",
            message: "This session has already submitted the maximum number of responses."
        });
    }

    // 4. Save, linked to the consent session. The location recorded at consent
    //    time wins over whatever the browser sends now.
    const { error } = await supabaseAdmin.from("responses").insert({
        answers,
        script,
        location: session.location_id ?? location,
        session_id: session.id,
    });

    if (error) {
        console.error("Failed to save responses:", error);
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to save responses"
        });
    }

    return res.status(200).json({ success: true });
}
