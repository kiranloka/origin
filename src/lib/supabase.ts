import { createClient } from "@supabase/supabase-js";

// Bun automatically loads .env into process.env
const supabaseUrl = typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : undefined;
const supabaseAnonKey = typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in environment variables");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
