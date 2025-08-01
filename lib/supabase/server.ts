import { createClient } from "@supabase/supabase-js"

// This is a server-side only client that can be used in API routes
// In production, it uses the service role key which bypasses RLS - use with caution!
// In development, it falls back to the anon key for local development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Missing required Supabase environment variables. Please ensure NEXT_PUBLIC_SUPABASE_URL and either SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Helper function to create a server client with the user's auth token
export const createServerClient = (accessToken: string) => {
  return createClient(supabaseUrl, supabaseServiceKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
