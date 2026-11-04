// Usage (from the app folder):
//   node scripts/add-admin.js add someone@example.com "a-long-password"   (creates, or resets the password)
//   node scripts/add-admin.js deactivate someone@example.com
//   node scripts/add-admin.js activate someone@example.com
// Uses whichever Supabase project is in .env.local (set the env vars in the shell to target another).
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const [command, emailArg, password] = process.argv.slice(2);
const email = (emailArg || "").trim().toLowerCase();

if (!["add", "activate", "deactivate"].includes(command) || !email.includes("@")) {
  console.error('Usage: node scripts/add-admin.js add|activate|deactivate someone@example.com ["password"]');
  process.exit(1);
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

async function findUserByEmail(target) {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const hit = data.users.find((u) => (u.email || "").toLowerCase() === target);
    if (hit) return hit;
    if (data.users.length < 1000) return null;
  }
  return null;
}

try {
  if (command === "add") {
    if (!password || password.length < 12) {
      console.error("Password must be at least 12 characters.");
      process.exit(1);
    }
    let user = await findUserByEmail(email);
    if (user) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password,
        email_confirm: true,
      });
      if (error) throw error;
    } else {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (error) throw error;
      user = data.user;
    }
    const { error } = await supabaseAdmin
      .from("admins")
      .upsert({ user_id: user.id, email, role: "admin", active: true }, { onConflict: "user_id" });
    if (error) throw error;
    console.log(`Admin ready: ${email}`);
  } else {
    const user = await findUserByEmail(email);
    if (!user) {
      console.error(`No Supabase user with email ${email}`);
      process.exit(1);
    }
    const { error } = await supabaseAdmin
      .from("admins")
      .update({ active: command === "activate" })
      .eq("user_id", user.id);
    if (error) throw error;
    console.log(`${command}d: ${email}`);
  }
} catch (err) {
  console.error("Failed:", err.message || err);
  process.exit(1);
}