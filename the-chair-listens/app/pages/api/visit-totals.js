import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { data, error } = await supabase
    .from("city_visit_totals")
    .select("city, total_visits, first_seen, last_seen")
    .order("total_visits", { ascending: false });

  if (error) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to fetch visit totals",
    });
  }

  res.status(200).json({ totals: data });
}