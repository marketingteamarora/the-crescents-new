/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript type checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Image optimization
  images: {
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/app/image-loader.ts',
  },
  // Enable static export
  output: 'export',
  // Add trailing slashes to all paths for better compatibility
  trailingSlash: true,
  // Enable React strict mode
  reactStrictMode: true,
  // Disable server components (needed for static export)
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Configure webpack
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
  // Environment variables to expose to the browser
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  // Add CORS headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, apikey, Authorization' },
        ],
      },
    ]
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
