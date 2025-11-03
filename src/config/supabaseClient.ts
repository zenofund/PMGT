import { createClient } from '@supabase/supabase-js';
import { env } from './env';

if (!env.supabase.url || !env.supabase.key) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_KEY environment variables.');
}

export const supabase = createClient(
  env.supabase.url,
  env.supabase.key,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export type Database = Record<string, any>;
