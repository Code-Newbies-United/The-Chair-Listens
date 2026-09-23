import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // Get every consent record from the last 24 hours
  const { data: consentRows, error: consentError } = await supabase
    .from("consent")
    .select("location_id, created_at")
    .gte("created_at", twentyFourHoursAgo);

  if (consentError) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to fetch recent visitors",
    });
  }

  // Tally visits per city
  const counts = {};
  for (const row of consentRows) {
    const city = row.location_id || "Unknown";
    counts[city] = (counts[city] || 0) + 1;
  }

  const cityNames = Object.keys(counts);

  if (cityNames.length === 0) {
    return res.status(200).json({ visitors: [] });
  }

  // Look up coordinates for these cities from city_visit_totals
  const { data: coordRows, error: coordError } = await supabase
    .from("city_visit_totals")
    .select("city, lat, lng")
    .in("city", cityNames);

  if (coordError) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to fetch city coordinates",
    });
  }

  const coordsByCity = {};
  for (const row of coordRows) {
    coordsByCity[row.city] = { lat: row.lat, lng: row.lng };
  }

  const visitors = cityNames.map((city) => ({
    location: city,
    visitor_count: counts[city],
    lat: coordsByCity[city]?.lat ?? null,
    lng: coordsByCity[city]?.lng ?? null,
  }));

  res.status(200).json({ visitors });
}