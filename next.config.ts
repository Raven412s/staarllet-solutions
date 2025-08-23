import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // for Cloudinary assets
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com", // for Clerk profile images
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // for Clerk profile images
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
