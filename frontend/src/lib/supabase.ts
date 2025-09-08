import { createClient } from '@supabase/supabase-js'

// For development, you'll need to replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  PROFILES: 'profiles',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
} as const
