import { supabaseAdmin } from "@/lib/supabaseAdmin";

const MAX_MESSAGE_LENGTH = 1000;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabaseAdmin
      .from("messages")
      .select("id, message, created_at")
      .eq("is_visible", true)
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("Failed to fetch messages:", error);
      return res.status(500).json({ error: "Failed to load messages" });
    }
    return res.status(200).json({ messages: data ?? [] });
  }

  if (req.method === "POST") {
    const { message } = req.body || {};

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    const trimmed = message.trim();

    // Check the trimmed text, since that's what gets stored
    if (trimmed.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: "Message too long (max 1000 characters)" });
    }

    const { data, error } = await supabaseAdmin
      .from("messages")
      .insert({ message: trimmed, is_visible: true })
      .select("id, message, created_at")
      .single();

    if (error) {
      console.error("Failed to save message:", error);
      return res.status(500).json({ error: "Failed to save message" });
    }
    return res.status(201).json({ success: true, message: data });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "Method Not Allowed" });
}