import { createClient } from '@supabase/supabase-js';
import { env } from './env';

export type Database = Record<string, any>;

let supabaseInstance: any = null;

const initializeSupabase = () => {
  if (supabaseInstance) return supabaseInstance;

  if (!env.supabase.url || !env.supabase.key) {
    console.warn(
      'Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables.'
    );
    return null;
  }

  supabaseInstance = createClient(env.supabase.url, env.supabase.key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseInstance;
};

export const supabase = new Proxy(
  {},
  {
    get(_, prop) {
      const instance = initializeSupabase();
      if (!instance) {
        throw new Error(
          'Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables.'
        );
      }
      return (instance as any)[prop];
    },
  }
) as any;
