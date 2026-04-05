import { createClient } from "@supabase/supabase-js";

// Use Supabase client with service role for server-side DB operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder",
  { auth: { persistSession: false } }
);

// Re-export for backward compatibility
export const db = supabaseAdmin;
