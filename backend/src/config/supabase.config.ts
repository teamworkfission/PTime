import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

export const TABLES = {
  USER_PROFILES: 'user_profiles',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  BUSINESSES: 'businesses',
  EMPLOYERS: 'employers',
} as const;
