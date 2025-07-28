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
  // Disable image optimization API routes for static export
  images: {
    loader: 'custom',
    loaderFile: './src/app/image-loader.ts',
  },
}

export default nextConfig
