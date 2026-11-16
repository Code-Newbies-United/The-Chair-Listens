// scripts/seed-pathways.js
//
// Loads the starting pathways from data/pathways.js into the `pathways` table.
// Inserts only keys that are missing: it never overwrites a row, so edits made
// in Supabase are safe. Run it from the app folder after schema.sql
// (or after database/migrations/fix-16-pathways.sql):
//
//     node scripts/seed-pathways.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { SEED_PATHWAYS } from "../data/pathways.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function run() {
  const { data, error } = await supabaseAdmin
    .from("pathways")
    .upsert(SEED_PATHWAYS, { onConflict: "key", ignoreDuplicates: true })
    .select("key");

  if (error) {
    console.error("Seeding pathways failed:", error.message);
    process.exit(1);
  }

  const added = (data || []).map((row) => row.key);
  console.log(
    added.length
      ? `Added pathways: ${added.join(", ")}`
      : "Nothing to add: every seed pathway already exists.",
  );
}

run();
