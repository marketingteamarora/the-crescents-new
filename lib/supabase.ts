import { createClient } from "@supabase/supabase-js"

// These are the public env vars that will be available on the client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create a custom fetch function that uses our proxy in production
const customFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  // Handle both string and URL/Request objects
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  
  // In production, route Supabase API requests through our proxy
  if (process.env.NODE_ENV === 'production' && isBrowser && typeof url === 'string') {
    const proxyUrl = new URL('/api/supabase', window.location.origin);
    const originalUrl = new URL(url);
    
    // Extract the path after /rest/v1
    const pathMatch = originalUrl.pathname.match(/\/rest\/v1(\/.*)/);
    if (pathMatch) {
      proxyUrl.searchParams.set('path', pathMatch[1]);
    }
    
    // Copy all search params to the proxy URL
    originalUrl.searchParams.forEach((value, key) => {
      proxyUrl.searchParams.set(key, value);
    });
    
    // Update the URL to use our proxy
    return fetch(proxyUrl.toString(), init);
  }
  
  // Fall back to the original fetch for non-browser or non-production environments
  return fetch(input, init);
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
