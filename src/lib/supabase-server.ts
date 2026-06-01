import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side Supabase client with service role key
// This bypasses Row Level Security — use only in API routes
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
