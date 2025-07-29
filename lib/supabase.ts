import { createClient } from "@supabase/supabase-js"
import { createBrowserClient } from '@supabase/ssr'

// These are the public env vars that will be available on the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create a single supabase client for the browser
// Using createBrowserClient from @supabase/ssr for better Next.js integration
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Use PKCE flow for better security
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',

    },
  },
})

// Types for our database tables
export interface LandingPageContentRow {
  id: string
  content: any
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
  updated_by?: string
}

export interface ContentTemplateRow {
  id: string
  name: string
  description?: string
  content: any
  is_public: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface UploadedImageRow {
  id: string
  filename: string
  original_name: string
  file_path: string
  file_size?: number
  mime_type?: string
  width?: number
  height?: number
  alt_text?: string
  category?: string
  created_at: string
  user_id: string
}
