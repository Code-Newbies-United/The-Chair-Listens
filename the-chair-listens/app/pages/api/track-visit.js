import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { city, lat, lng } = req.body;

  if (!city) {
    return res.status(400).json({ message: "Missing city" });
  }

  const { error } = await supabase.rpc("increment_city_visit", {
    p_city: city,
    p_lat: lat ?? null,
    p_lng: lng ?? null,
  });

  if (error) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to record visit",
    });
  }

  res.status(200).json({ success: true });
}