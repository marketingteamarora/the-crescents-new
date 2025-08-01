/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/app/image-loader.ts',
  },
  // Remove static export for API routes to work
  trailingSlash: true,
  reactStrictMode: true,
  // Enable server components and API routes
  experimental: {
    serverActions: true,
  },
  
  // Remove experimental settings that cause warnings
  
  // Webpack configuration
  webpack: (config) => {
    return config;
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://hkvknskptiiniqdwitau.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhrdmtuc2twdGlpbmlxZHdpdGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxODUwODgsImV4cCI6MjA2ODc2MTA4OH0.nunS_DYeEWX_0ROg8STpR6oz_1MQ8kWUXWsV9paaGOo',
  },
  // Rewrite API requests to go through our proxy
  async rewrites() {
    return [
      {
        source: '/api/supabase/:path*',
        destination: 'https://hkvknskptiiniqdwitau.supabase.co/rest/v1/:path*',
      },
    ]
  },
}

export default nextConfig
