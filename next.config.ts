import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/1-inches-in-cm",
        destination: "/1-inch-in-cm",
        permanent: true,
      },
      {
        source: "/1-inch-to-cm",
        destination: "/1-inch-in-cm",
        permanent: true,
      },
      {
        source: "/inches-to-centimeters",
        destination: "/inches-to-cm",
        permanent: true,
      },
      {
        source: "/centimeters-to-inches",
        destination: "/cm-to-inches",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
