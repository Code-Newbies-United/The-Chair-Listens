// Usage (from the app folder):
//   node scripts/add-admin.js invite someone@example.com        (sends the invitation email; normal way to add an admin)
//   node scripts/add-admin.js add someone@example.com 'a-long-password'   (FIRST ADMIN / BREAK-GLASS ONLY: sets the password from the shell)
//   node scripts/add-admin.js deactivate someone@example.com
//   node scripts/add-admin.js activate someone@example.com
// Uses whichever Supabase project is in .env.local (set the env vars in the shell to target another).
// PowerShell: wrap passwords in single quotes so $ is not expanded.
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const COMMANDS = ["invite", "add", "activate", "deactivate"];
const [command, emailArg, password] = process.argv.slice(2);
const email = (emailArg || "").trim().toLowerCase();

if (!COMMANDS.includes(command) || !email.includes("@")) {
  console.error("Usage: node scripts/add-admin.js invite|add|activate|deactivate someone@example.com ['password' (add only)]");
  process.exit(1);
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (check .env.local).");
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
  if (command === "invite") {
    const existing = await findUserByEmail(email);
    if (existing) {
      console.error(`A Supabase user with ${email} already exists. Use activate, or delete the user in the Supabase dashboard first.`);
      process.exit(1);
    }
    const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);
    if (error) throw error;
    // Only the server can set app_metadata: this flag marks a genuine admin invite
    const { error: flagError } = await supabaseAdmin.auth.admin.updateUserById(data.user.id, {
      app_metadata: { admin_invite: true },
    });
    if (flagError) throw flagError;
    console.log(`Invitation sent to ${email}. They set their own password from the email link.`);
  } else if (command === "add") {
    if (!password || password.length < 12) {
      console.error("Password must be at least 12 characters.");
      process.exit(1);
    }
    if (password.length > 72) {
      console.error("Password must be at most 72 characters.");
      process.exit(1);
    }
    let user = await findUserByEmail(email);
    if (user) {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        password,
        email_confirm: true,
        // Clear any leftover invite so it cannot be used later
        app_metadata: { admin_invite: null },
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
