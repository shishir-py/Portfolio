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
    // External packages configuration (fixed from serverComponentsExternalPackages)
    serverExternalPackages: [],
    
    // Optionally add image domains if you're using external images
    images: {
      domains: ['placehold.co', 'res.cloudinary.com'],
      dangerouslyAllowSVG: true,
    },
    
    // Environment variables that will be used client-side
    // These are exposed to the browser - be careful what you add here!
    env: {
      NEXT_PUBLIC_ADMIN_USERNAME: process.env.NEXT_PUBLIC_ADMIN_USERNAME,
      NEXT_PUBLIC_ADMIN_PASSWORD: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    },
  };

  
  module.exports = nextConfig;