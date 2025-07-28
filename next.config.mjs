/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Ensure static export
  output: 'export',
  // Optional: Add a trailing slash to all paths
  trailingSlash: true,
  // Optional: Enable React strict mode
  reactStrictMode: true,
  // Optional: Add base path if your app is served from a subdirectory
  // basePath: '/your-base-path',
  // Optional: Configure the build output directory
  distDir: 'out',
}

export default nextConfig
