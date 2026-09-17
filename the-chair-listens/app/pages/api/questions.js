import { supabaseAdmin as supabase } from "@/lib/supabaseAdmin";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { script } = req.query;

  if (!script) {
    return res.status(400).json({ message: "Missing script parameter" });
  }

  const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('script_key', script)
      .order('sort_order', { ascending: true });

  if (error) {
    return res.status(500).json({
      error: "Connection failed",
      message: "Failed to fetch questions"
    });
  }

  res.status(200).json({ questions: data });
}