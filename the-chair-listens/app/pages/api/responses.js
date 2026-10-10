
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import {
    SESSION_MAX_AGE_HOURS,
    MAX_RESPONSES_PER_SESSION,
} from "@/lib/consentVersion";

const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function consentRequired(res, message) {
    return res.status(403).json({ error: "Consent required", message });
}

export default async function manage_responses(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint",
        });
    }

    const { answers, script, session_id } = req.body || {};

    // 1. Require a valid consent session.
    if (typeof session_id !== "string" || !UUID_RE.test(session_id)) {
        return consentRequired(
            res,
            "Consent is required before responses can be saved."
        );
    }

    const { data: session, error: sessionError } = await supabaseAdmin
        .from("sessions")
        .select("id, chair_location_id, location_id, consented_at")
        .eq("id", session_id)
        .maybeSingle();

    if (sessionError) {
        console.error("Session lookup failed:", sessionError);
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to verify consent",
        });
    }

    if (!session || !session.consented_at) {
        return consentRequired(
            res,
            "No valid consent was found. Please start again."
        );
    }

    const ageMs = Date.now() - new Date(session.consented_at).getTime();

    if (ageMs < 0 || ageMs > SESSION_MAX_AGE_HOURS * 60 * 60 * 1000) {
        return consentRequired(
            res,
            "Your session has expired or is invalid. Please start again."
        );
    }

    // New responses must have a valid chair location assigned by the server.
    // Older sessions without this value must start a new session.
    if (!session.chair_location_id) {
        return res.status(409).json({
            error: "Session needs to be restarted",
            message:
                "This session does not have a chair location assigned. Please start again.",
        });
    }

    // 2. Validate the answers.
    if (!Array.isArray(answers) || answers.length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "Answers must be a non-empty array",
        });
    }

    // 3. Enforce the response limit for this session.
    const { count, error: countError } = await supabaseAdmin
        .from("responses")
        .select("id", { count: "exact", head: true })
        .eq("session_id", session.id);

    if (countError) {
        console.error("Response count failed:", countError);
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to check response limits",
        });
    }

    if ((count ?? 0) >= MAX_RESPONSES_PER_SESSION) {
        return res.status(429).json({
            error: "Too Many Requests",
            message:
                "This session has already submitted the maximum number of responses.",
        });
    }

    // 4. Save the response using the chair location from the saved session.
    // Keep the legacy text field temporarily for compatibility.
    const { error } = await supabaseAdmin.from("responses").insert({
        answers,
        script,
        session_id: session.id,
        chair_location_id: session.chair_location_id,
        location: session.location_id ?? null,
    });

    if (error) {
        console.error("Failed to save response:", error);
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to save response",
        });
    }

    return res.status(200).json({ success: true });
}