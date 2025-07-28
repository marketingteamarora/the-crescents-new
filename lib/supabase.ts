import { createClient } from "@supabase/supabase-js"

// These are the public env vars that will be available on the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hkvknskptiiniqdwitau.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdmtuc2twdGlpbmlxZHdpdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODUwODgsImV4cCI6MjA2ODc2MTA4OH0.nunS_DYeEWX_0ROg8STpR6oz_1MQ8kWUXWsV9paaGOo'

// Create a custom fetch function that includes the required headers
const customFetch = (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Handle both string URLs and Request objects
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  // Get existing headers or create new ones
  const headers = new Headers(init?.headers);
  
  // Set the required headers for Supabase REST API
  headers.set('apikey', supabaseAnonKey);
  headers.set('Authorization', `Bearer ${supabaseAnonKey}`);
  
  // Ensure we're sending JSON content type
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Ensure we're accepting JSON
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/vnd.pgrst.object+json');
  }
  
  // Create new options with updated headers
  const newOptions: RequestInit = {
    ...init,
    headers: Object.fromEntries(headers.entries())
  };
  
  // If input is a Request object, create a new one with the updated options
  if (typeof input !== 'string' && !(input instanceof URL)) {
    return fetch(new Request(input, newOptions));
  }
  
  return fetch(input, newOptions);
};

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  global: {
    fetch: customFetch,
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.pgrst.object+json;version=1',
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
