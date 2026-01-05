import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.SUPABASE_URL ?? "";
const supabaseAnonKey: string = process.env.SUPABASE_PUBLISHABLE_KEY ?? "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or Anon Key is not set in environment variables"
  );
}

const supabase: SupabaseClient = (() => {
  let instance: SupabaseClient | null = null;

  return () => {
    if (!instance) {
      instance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return instance;
  };
})()();

export default supabase;
