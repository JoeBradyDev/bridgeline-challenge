import { createClient } from "@supabase/supabase-js";
// import { Database } from '../types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

const supabase = (() => {
  let instance: ReturnType<typeof createClient> | null = null;

  return () => {
    if (!instance) {
      // instance = createClient<Database>(supabaseUrl, supabaseAnonKey);
      instance = createClient(supabaseUrl, supabaseAnonKey);
    }
    return instance;
  };
})();

export default supabase();
