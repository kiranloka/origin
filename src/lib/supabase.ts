import { createClient } from "@supabase/supabase-js";

// Access environment variables via import.meta.env
// The build script will bake these into the client bundle
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in environment variables");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
