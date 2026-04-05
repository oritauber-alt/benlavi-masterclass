import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// At build time these may be missing. At runtime on a request path that
// hits the DB, the caller will see a clear error instead of a cryptic
// Supabase 401 from placeholder credentials.
if (!supabaseUrl || !serviceRoleKey) {
  console.warn(
    "[db] Supabase env vars missing. DB calls will fail until NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl ?? "https://placeholder.supabase.co",
  serviceRoleKey ?? "placeholder-service-role-key",
  { auth: { persistSession: false } }
);

export const db = supabaseAdmin;
