import { createClient } from "@supabase/supabase-js";
import { ENV } from "../env_config";

const supabaseUrl = ENV.VITE_SUPABASE_URL || (typeof process !== "undefined" ? process.env.VITE_SUPABASE_URL : undefined);
const supabaseAnonKey = ENV.VITE_SUPABASE_ANON_KEY || (typeof process !== "undefined" ? process.env.VITE_SUPABASE_ANON_KEY : undefined);

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing in .env");
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
