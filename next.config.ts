import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/sales-page.html",
      },
    ];
  },
};

export default nextConfig;
