import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d8j0ntlcm91z4.cloudfront.net",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/register",
        destination: "/login",
        permanent: true,
      },
      {
        source: "/:locale/register",
        destination: "/:locale/login",
        permanent: true,
      },
      {
        source: "/freelancers",
        destination: "/freelances",
        permanent: true,
      },
      {
        source: "/:locale/freelancers",
        destination: "/:locale/freelances",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
