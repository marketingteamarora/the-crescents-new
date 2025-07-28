import { createClient } from "@supabase/supabase-js"

// These are the public env vars that will be available on the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hkvknskptiiniqdwitau.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdmtuc2twdGlpbmlxZHdpdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODUwODgsImV4cCI6MjA2ODc2MTA4OH0.nunS_DYeEWX_0ROg8STpR6oz_1MQ8kWUXWsV9paaGOo'

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
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
