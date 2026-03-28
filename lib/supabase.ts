import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Cache the instance globally in development to prevent HMR "Lock broken by another request" Web Locks API errors
const globalForSupabase = globalThis as unknown as {
  supabase: any | undefined;
}

export const supabase =
  globalForSupabase.supabase ?? createClient(supabaseUrl, supabaseAnonKey)

if (process.env.NODE_ENV !== "production") globalForSupabase.supabase = supabase
