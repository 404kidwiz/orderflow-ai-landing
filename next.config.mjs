/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.vercel.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split vendor chunks to stay under Cloudflare Pages 25MB limit
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          // Separate large UI/animation libs
          framerMotion: {
            test: /[\\/]node_modules[\\/](framer-motion|@motion[\\/])/,
            name: 'framer-motion',
            chunks: 'all',
            priority: 30,
          },
          gsap: {
            test: /[\\/]node_modules[\\/](gsap|@gsap[\\/])/,
            name: 'gsap',
            chunks: 'all',
            priority: 30,
          },
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three|@use-gesture|@react-spring)/,
            name: 'three-vendor',
            chunks: 'all',
            priority: 30,
          },
          // Default vendor chunk for everything else
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;