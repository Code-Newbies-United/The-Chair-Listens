
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { CONSENT_VERSION } from "@/lib/consentVersion";

export default async function manage_communication(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method Not Allowed",
            message: "Only POST requests are accepted on this endpoint",
        });
    }

    const { consent_version } = req.body || {};

    // Require consent to the current privacy wording.
    if (consent_version !== CONSENT_VERSION) {
        return res.status(409).json({
            error: "Consent terms out of date",
            message:
                "The privacy terms have been updated. Please refresh the page and review them again.",
        });
    }

    // Resolve the chair's location on the server.
    const { data: location, error: locationError } = await supabaseAdmin
        .from("locations")
        .select("id, name")
        .eq("active", true)
        .maybeSingle();

    if (locationError) {
        console.error("Failed to find active chair location:", locationError);
        return res.status(500).json({
            error: "Database error",
            message: "Could not determine the active chair location.",
        });
    }

    if (!location) {
        return res.status(503).json({
            error: "No active chair location",
            message:
                "The chair is not currently configured. Please try again later.",
        });
    }

    // Save the UUID as the authoritative location.
    // Keep the old text field temporarily for compatibility with
    // application code that has not yet been migrated.
    const { data, error } = await supabaseAdmin
        .from("sessions")
        .insert({
            chair_location_id: location.id,
            location_id: location.name,
            consent_version: CONSENT_VERSION,
        })
        .select("id")
        .single();

    if (error || !data) {
        console.error("Failed to create consent session:", error);
        return res.status(500).json({
            error: "Connection failed",
            message: "Failed to save consent.",
        });
    }

    return res.status(201).json({ sessionId: data.id });
}