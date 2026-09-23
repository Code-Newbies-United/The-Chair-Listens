import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return handlePost(req, res);
  }
  if (req.method === "GET") {
    return handleGet(req, res);
  }
  return res.status(405).json({ message: "Method not allowed" });
}

// Records a single visit: inserts a raw pin row, and atomically increments
// that city's lifetime total in the same request.
async function handlePost(req, res) {
  const { city, lat, lng } = req.body;

  if (!city) {
    return res.status(400).json({ message: "Missing city" });
  }

  const { error: pinError } = await supabase.from("visitor_pins").insert({
    city,
    lat: lat ?? null,
    lng: lng ?? null,
  });

  if (pinError) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to record visitor pin",
    });
  }

  const { error: incrementError } = await supabase.rpc("increment_city_visit", {
    p_city: city,
    p_lat: lat ?? null,
    p_lng: lng ?? null,
  });

  if (incrementError) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to update lifetime totals",
    });
  }

  res.status(200).json({ success: true });
}

// Returns pins grouped by city, counted within the last 24 hours, for the live map.
async function handleGet(req, res) {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from("visitor_pins")
    .select("city, lat, lng, created_at")
    .gte("created_at", twentyFourHoursAgo)
    .order("created_at", { ascending: true });

  if (error) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to fetch visitor pins",
    });
  }

  // Group by city: count visits, and use the most recent row's coordinates
  const grouped = {};
  for (const row of data) {
    if (!grouped[row.city]) {
      grouped[row.city] = { location: row.city, visitor_count: 0, lat: row.lat, lng: row.lng };
    }
    grouped[row.city].visitor_count += 1;
    // Keep updating lat/lng so the latest row in the window "wins"
    grouped[row.city].lat = row.lat;
    grouped[row.city].lng = row.lng;
  }

  res.status(200).json({ visitors: Object.values(grouped) });
}