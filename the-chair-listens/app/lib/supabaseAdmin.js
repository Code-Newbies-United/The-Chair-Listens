import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://imvtsbbcxqjmlrnqwtzf.supabase.co"; //process.env.NEXT_PUBLIC_SUPABASE_URL; //read from env file
//const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImltdnRzYmJjeHFqbWxybnF3dHpmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODk2NTMwMywiZXhwIjoyMTA0NTQxMzAzfQ.gNZMDpgnlJQqNYFxdpzhKR2Kalij1T_mzW-ZTxfpY1E";

if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase environment variables in lib/supabaseAdmin.js");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
    },
});