import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    // Inline the (small, Tailwind) stylesheet into <head> so it no longer blocks first paint.
    inlineCss: true,
  },
  images: {
    unoptimized: true,
    // Allows next/image to accept absolute URLs served from the Laravel
    // backend's public disk (e.g. http://localhost:8000/storage/hero/x.jpg)
    // once admin-uploaded images replace the hardcoded /public assets.
    // Optimization itself is a no-op while unoptimized:true (static export),
    // but remotePatterns still gates which hosts next/image will render.
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "https", hostname: "paperdreamz3api.dsdspl.com", pathname: "/storage/**" },
      { protocol: "https", hostname: "**.dsdspl.com", pathname: "/storage/**" },
    ],
  },
};

export default nextConfig;
