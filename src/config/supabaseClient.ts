import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

export type Database = Record<string, any>;

let supabaseInstance: any = null;
let isConfigured = false;

const initializeSupabase = () => {
  if (supabaseInstance !== null) return supabaseInstance;

  if (!env.supabase.url || !env.supabase.key) {
    console.warn(
      "Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables.",
    );
    isConfigured = false;
    return null;
  }

  supabaseInstance = createClient(env.supabase.url, env.supabase.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  isConfigured = true;
  return supabaseInstance;
};

export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      // Special property to check if Supabase is configured
      if (prop === "_isConfigured") {
        initializeSupabase();
        return isConfigured;
      }

      const instance = initializeSupabase();
      if (!instance) {
        // Return safe dummy objects instead of throwing
        if (prop === "auth") {
          return null;
        }
        if (prop === "from") {
          return null;
        }
        // For unknown properties, return a dummy function that warns
        return () => {
          console.warn(
            "Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables.",
          );
          return null;
        };
      }
      return (instance as any)[prop];
    },
  },
) as any;
