import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Option demandée par Next.js pour autoriser votre IP */
  // @ts-ignore
  allowedDevOrigins: ["192.168.1.66", "localhost:3000"],
  
  experimental: {
    serverActions: {
      allowedOrigins: ["192.168.1.66:3000", "localhost:3000"]
    }
  }
};

export default nextConfig;
