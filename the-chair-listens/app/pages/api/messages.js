import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { SESSION_MAX_AGE_HOURS } from "@/lib/consentVersion";
import { isUuid } from "@/lib/validators";
import { getClientIp, rateLimit } from "@/lib/rateLimit";

const MAX_MESSAGE_LENGTH = 1000;
const MAX_MESSAGES_TO_RETURN = 20;

async function applyRateLimit(reqs, res, sessionId) {
    const ip = getClientIp(req);
    const ipLimit = await rateLimit("messages", ip, 30, 60);
    if (!ipLimit.allowed) {
        res.setHeader("Retry-Header", "60");
        res.status(429).json({ error:"Too many requests", message: "Please wait before trying again."});
        return false;
    }

    if (sessionId) {
        const sessionLimit = await rateLimit("messages-session", sessionId, 5, 60);
        if (!sessionLimit.allowed) {
            res.setHeader(429).json({ error: "Too many requests", message: "You have sent messages too quickly, please wait and try again"});
            return false;
        }
    }

    return true;
}

async function verifyConsentSession(sessionId) {
    if (isUuid(sessionId)) return { valid: false, status: 403};

    const { data: session, error } = await supabaseAdmin
        .from("sessions")
        .select("id, consented_at")
        .eq("id", sessionId)
        .maybeSingle();
    
    if (error) {
        console.error("Message session lookup failed:", error);
        return { valid: false, status: 403};
    }

    return { valid: true, session };
}

export default async function handler(req, res) {
    if (req.method === "GET") {
        if (!(await applyRateLimit(req, res, null))) return;

        const { data, error } = await supabaseAdmin
            .from("messages")
            .select("id, message, created_at")
            .eq("is_visible", true)
            .order("created_at", { ascending: false })
            .limit(MAX_MESSAGES_TO_RETURN);

        if (error) {
            console.error("Failed to fetch community messages:", error);
            return res.status(500).json({ error: "Connection failed", message: "Failed to load messages." });
        }

        return res.status(200).json({ messages: data ?? [] });
    }

    if (req.method === "POST") {
        const sessionId = req.headers["x-session-id"];
        if (!(await applyRateLimit(req, res, isUuid(sessionId) ?  sessionId : null))) return;
        
        const { message } = req.body || {};
        if (typeof message !== "string") {
            return res.status(400).json({ error: "Bad Request", message: "Failed to load messages"});
        }

        const cleanMessage = message.trim();
    if (!cleanMessage) {
      return res.status(400).json({ error: "Bad Request", message: "Please enter a message before submitting." });
    }
    if (cleanMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: "Bad Request", message: `Messages must be ${MAX_MESSAGE_LENGTH} characters or fewer.` });
    }

    const consent = await verifyConsentSession(sessionId);
    if (!consent.valid) {
      if (consent.status === 500) {
        return res.status(500).json({ error: "Connection failed", message: "Could not verify your consent session." });
      }
      return res.status(403).json({ error: "Consent required", message: "Please complete the consent step before leaving a message." });
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert({ message: cleanMessage, session_id: consent.session.id })
      .select("id, message, created_at")
      .single();

    if (error) {
      console.error("Failed to save community message:", error);
      return res.status(500).json({ error: "Connection failed", message: "Failed to save your message. Please try again." });
    }
    return res.status(201).json({ success: true, message: data });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method Not Allowed", message: "Only GET and POST requests are accepted." });
}