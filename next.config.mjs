/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      appDir: true,
      serverComponentsExternalPackages: ['@vercel/postgres'],
      runtime: 'nodejs'
    },
    webpack: (config) => {
      // Enhance module resolution
      config.resolve.extensions = [
        '.js',
        '.mjs',
        '.jsx',
        '.json',
        ...config.resolve.extensions
      ];
      
      // Configure aliases
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': '.',
      };
      
      return config;
    }
  };
  
  export default nextConfig;