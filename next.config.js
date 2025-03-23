/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      // Disable ESLint during builds
      ignoreDuringBuilds: true,
    },
    typescript: {
      // Disable TypeScript checks during builds
      ignoreBuildErrors: true,
    },
    // Help fix the blog/[slug] React Client Manifest error
    experimental: {
      serverComponentsExternalPackages: [],
      esmExternals: false
    }
  };
  
  module.exports = nextConfig;