import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, error } = await supabase
    .from("consent")
    .select("location_id");

  if (error) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to fetch visit totals",
    });
  }

  // Tally how many times each location appears
  const counts = {};
  for (const row of data) {
    const location = row.location_id || "Unknown";
    counts[location] = (counts[location] || 0) + 1;
  }

  // Convert to an array and sort by total_visits descending
  const totals = Object.entries(counts)
    .map(([location_id, total_visits]) => ({ location_id, total_visits }))
    .sort((a, b) => b.total_visits - a.total_visits);

  res.status(200).json({ totals });
}
