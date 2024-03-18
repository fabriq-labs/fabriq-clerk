/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  server: {
    port: process.env.PORT || 8080,
  },
};

export default nextConfig;
