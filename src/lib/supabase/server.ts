import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

/**
 * Server-side Supabase client (RSC + Server Actions). Uses the public
 * anon/publishable key — all access is governed by Row Level Security.
 * No session is persisted; catalog reads are anonymous and cacheable.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
