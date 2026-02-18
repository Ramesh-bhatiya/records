import { createClient } from '@supabase/supabase-js';

const supabaseUrlRaw = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKeyRaw = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = supabaseUrlRaw?.trim();
const supabaseAnonKey = supabaseAnonKeyRaw?.trim();

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Supabase JS expects the project "anon" public key (JWT, typically starts with "eyJ").
// Keys like "sb_publishable_*" are not valid for supabase-js.
if (supabaseAnonKey.startsWith('sb_') || supabaseAnonKey.includes('publishable')) {
  throw new Error(
    'Invalid Supabase API key: use the Project API key "anon" from Supabase Dashboard → Settings → API (it typically starts with "eyJ").'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
