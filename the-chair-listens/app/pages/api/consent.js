// pages/api/consent.js
// Creates a consent "session" and returns its ID. This is the ONLY way to get a
// session, and /api/responses refuses anything without one.
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CONSENT_VERSION } from "@/lib/consentVersion";

export default async function manage_communication(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint"
        });
    }

    const { location_id, consent_version } = req.body || {};

    if (typeof location_id !== "string" || location_id.trim() === "" || location_id.length > 200) {
        return res.status(400).json({
            error: "Bad Request",
            message: "location_id is required"
        });
    }

    // The person must have consented to the CURRENT wording. If their browser
    // is showing an older cached page, make them reload and read the new terms.
    if (consent_version !== CONSENT_VERSION) {
        return res.status(409).json({
            error: "Consent terms out of date",
            message: "The privacy terms have been updated. Please refresh the page and review them again."
        });
    }

    const { data, error } = await supabaseAdmin
        .from("sessions")
        .insert({
            location_id: location_id.trim(),
            consent_version: CONSENT_VERSION, // consented_at is filled in by the database clock
        })
        .select("id")
        .single();

    if (error || !data) {
        console.error("Failed to create consent session:", error);
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to save consent"
        });
    }

    return res.status(201).json({ sessionId: data.id });
}
