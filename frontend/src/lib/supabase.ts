import { createClient } from '@supabase/supabase-js'

// For development, you'll need to replace these with your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

// Debug logging in development
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl,
    hasKey: !!supabaseAnonKey,
    keyPrefix: supabaseAnonKey.substring(0, 20) + '...',
  })
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USER_PROFILES: 'user_profiles',
  JOBS: 'jobs',
  APPLICATIONS: 'applications',
  BUSINESSES: 'businesses',
  EMPLOYERS: 'employers',
} as const
