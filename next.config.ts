import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Lockfiles under parent dirs (e.g. ~/package-lock.json) confuse Turbopack; pin the app root. */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        pathname: "/api/**",
      },
    ],
  },
};

export default nextConfig;
