/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1536, 1920, 2048],
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: "https", hostname: "ddtjhgaukckykhvnxidi.supabase.co" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "images.unsplash.com" }
    ]
  }
};

export default nextConfig;
